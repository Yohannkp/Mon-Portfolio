"use client"

import { useMemo } from "react"
import { foc, GuideShell, useSerie, versEtapes, type EtapeT } from "@/components/sections/demo-guide"
import { useLangue } from "@/lib/langue"

/**
 * SELF_DEV_AGENT corrige un bug : la boucle explorer -> comprendre -> tester -> corriger.
 * Rien n'est execute : chaque etape n'est qu'un etat de la scene, calcule a partir de l'etape.
 */

const ETAPES: EtapeT[] = [
  {
    titre: ["Une consigne", "An instruction"],
    texte: [
      "Je demande à l'agent de corriger un bug dans la fonction divide. Il n'a que cette phrase, et des outils.",
      "I ask the agent to fix a bug in the divide function. It has only that sentence, and tools.",
    ],
    humeur: "neutre",
  },
  {
    titre: ["Chercher", "Searching"],
    texte: [
      "Avant de toucher au code, il cherche où la fonction est définie : ici, ligne 42 de calc.py.",
      "Before touching the code, it looks for where the function is defined: here, line 42 of calc.py.",
    ],
    humeur: "concentre",
  },
  {
    titre: ["Lire", "Reading"],
    texte: [
      "Il lit le code autour pour comprendre ce que la fonction fait vraiment, sans deviner.",
      "It reads the surrounding code to understand what the function really does, without guessing.",
    ],
    humeur: "concentre",
  },
  {
    titre: ["Tester d'abord", "Test first"],
    texte: [
      "Il lance les tests avant de modifier quoi que ce soit : il veut voir le bug, pas le supposer.",
      "It runs the tests before changing anything: it wants to see the bug, not assume it.",
    ],
    humeur: "curieux",
    attente: 1200,
  },
  {
    titre: ["Le test rouge", "The red test"],
    texte: [
      "test_divide_by_zero échoue avec une ZeroDivisionError. Le bug est reproduit : on a une cible précise.",
      "test_divide_by_zero fails with a ZeroDivisionError. The bug is reproduced: we have a precise target.",
    ],
    humeur: "concentre",
    attente: 600,
  },
  {
    titre: ["Corriger", "Fixing"],
    texte: [
      "Il écrit la correction : lever une erreur claire quand le diviseur est nul, au lieu de planter.",
      "It writes the fix: raise a clear error when the divisor is zero, instead of crashing.",
    ],
    humeur: "concentre",
    attente: 600,
  },
  {
    titre: ["Vérifier", "Verifying"],
    texte: [
      "Il relance les mêmes tests sur son correctif. Rien n'est admis tant que ça n'a pas été exécuté.",
      "It reruns the same tests on its fix. Nothing is accepted until it has been executed.",
    ],
    humeur: "curieux",
    attente: 1200,
  },
  {
    titre: ["Le test vert", "The green test"],
    texte: [
      "Les 4 tests passent. La correction n'est pas seulement proposée : elle est prouvée.",
      "All 4 tests pass. The fix isn't just proposed: it's proven.",
    ],
    humeur: "content",
  },
  {
    titre: ["Pourquoi c'est fiable", "Why it's reliable"],
    texte: [
      "Un modèle local de 7 milliards de paramètres se trompe souvent. Ce qu'on croit, ce ne sont pas ses réponses : ce sont les tests.",
      "A local 7-billion-parameter model is often wrong. What we trust isn't its answers: it's the tests.",
    ],
    humeur: "content",
  },
]

const NOEUDS: [string, string][] = [
  ["Explorer", "Explore"],
  ["Comprendre", "Understand"],
  ["Tester", "Test"],
  ["Corriger", "Fix"],
]
const TESTS = ["test_add", "test_multiply", "test_divide", "test_divide_by_zero"]
const AVANT = [
  "def add(a, b):",
  "    return a + b",
  "",
  "",
  "def divide(a, b):",
  "    return a / b",
  "",
  "",
  "def multiply(a, b):",
  "    return a * b",
  "",
]
const GARDE_FR = ["    if b == 0:", '        raise ValueError("division par zero")']
const GARDE_EN = ["    if b == 0:", '        raise ValueError("division by zero")']

type Ligne = { t: string; c?: "moins" | "plus" | "neuf" | "cible" | "sel" | "rouge"; foc?: boolean }

const JOURNAL_FR: [number, string, string][] = [
  [0, "selfdev> corrige le bug dans la fonction divide", "inv"],
  [1, "▸ grep divide", ""],
  [1, "  calc.py:42   def divide(a, b):", "bleu"],
  [2, "▸ read_file calc.py — lignes 38 à 48", ""],
  [3, "▸ run_python tests.py", ""],
  [4, "  FAILED test_divide_by_zero — ZeroDivisionError", "ko"],
  [5, "▸ edit_file calc.py", ""],
  [5, "  + if b == 0: raise ValueError(…)", "ok"],
  [6, "▸ run_python tests.py", ""],
  [7, "  4 passed in 0.03s", "ok"],
  [8, "✓ Corrigé et vérifié.", "ok"],
]
const JOURNAL_EN: [number, string, string][] = [
  [0, "selfdev> fix the bug in the divide function", "inv"],
  [1, "▸ grep divide", ""],
  [1, "  calc.py:42   def divide(a, b):", "bleu"],
  [2, "▸ read_file calc.py — lines 38 to 48", ""],
  [3, "▸ run_python tests.py", ""],
  [4, "  FAILED test_divide_by_zero — ZeroDivisionError", "ko"],
  [5, "▸ edit_file calc.py", ""],
  [5, "  + if b == 0: raise ValueError(…)", "ok"],
  [6, "▸ run_python tests.py", ""],
  [7, "  4 passed in 0.03s", "ok"],
  [8, "✓ Fixed and verified.", "ok"],
]

/** Quel noeud de la boucle travaille a cette etape ; -1 : aucun. */
const ACTIF = [-1, 0, 1, 2, 2, 3, 2, 2, -1]
const VU = (i: number, etape: number) => [1, 2, 3, 5][i] <= etape

function editeur(etape: number, GARDE: string[]): Ligne[] {
  const lignes: Ligne[] = []
  AVANT.forEach((t, i) => {
    if (i === 5 && etape >= 5) {
      if (etape === 5) {
        lignes.push({ t, c: "moins" }, { t: GARDE[0], c: "plus", foc: true }, { t: GARDE[1], c: "plus" }, { t, c: "plus" })
      } else {
        lignes.push({ t: GARDE[0], c: "neuf" }, { t: GARDE[1], c: "neuf" }, { t, c: "neuf" })
      }
      return
    }
    let c: Ligne["c"]
    let f = false
    if (i === 4 && etape === 1) (c = "cible"), (f = true)
    if ((i === 4 || i === 5) && etape === 2) (c = "sel"), (f = i === 5)
    if (i === 5 && etape === 4) (c = "rouge")
    lignes.push({ t, c, foc: f })
  })
  return lignes
}

function Scene({ etape }: { etape: number }) {
  const en = useLangue() === "en"
  const JOURNAL = en ? JOURNAL_EN : JOURNAL_FR
  const k = useSerie(etape === 3 || etape === 6, 4, 560)
  const lignes = editeur(etape, en ? GARDE_EN : GARDE_FR)
  let num = 38

  const etat = (i: number) => {
    if (etape < 3) return "attente"
    if (etape === 3 || etape === 6) {
      if (i < k) return etape === 3 && i === 3 ? "ko" : "ok"
      return i === k ? "cours" : "attente"
    }
    if (etape <= 5) return i === 3 ? "ko" : "ok"
    return "ok"
  }
  const bilan =
    etape >= 7 ? { t: "4 passed in 0.03s", c: "ok" } : etape === 4 || etape === 5 ? { t: "3 passed · 1 failed", c: "ko" } : { t: "—", c: "" }

  return (
    <div className="ag">
      <div className="ag__boucle" {...foc(etape === 8)} data-fin={etape === 8 ? "1" : "0"}>
        {NOEUDS.map(([nFr, nEn], i) => (
          <div key={nFr} className="ag__noeud-conteneur">
            <div
              className="ag__noeud"
              data-etat={ACTIF[etape] === i ? "actif" : etape === 8 ? "actif" : VU(i, etape) ? "vu" : "attente"}
            >
              {en ? nEn : nFr}
            </div>
            {i < NOEUDS.length - 1 ? <span className="ag__lien" data-on={VU(i + 1, etape) ? "1" : "0"} /> : null}
          </div>
        ))}
        <span className="ag__retour" data-on={etape >= 5 ? "1" : "0"}>
          {en ? "↻ while the tests fail" : "↻ tant que les tests échouent"}
        </span>
      </div>

      <div className="ag__grille">
        <div className="ag__editeur" data-etat={etape === 0 ? "ferme" : "ouvert"}>
          <div className="ag__onglet">
            <span>calc.py</span>
            {etape === 1 ? (
              <em>grep divide → calc.py:42</em>
            ) : etape === 0 ? (
              <em>{en ? "not open" : "non ouvert"}</em>
            ) : null}
          </div>
          <div className="ag__code">
            {lignes.map((l, i) => {
              const n = l.c === "moins" ? num : num++
              return (
                <div key={i} className="ag__ligne" data-c={l.c ?? ""} {...foc(!!l.foc)} style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="ag__n">{n}</span>
                  <code>{l.t || " "}</code>
                  {l.c === "rouge" ? <b className="ag__err">ZeroDivisionError</b> : null}
                </div>
              )
            })}
          </div>
        </div>

        <div className="ag__droite">
          <div className="ag__tests" {...foc(etape === 3 || etape === 6 || etape === 7)}>
            <p className="ag__t">Tests</p>
            {TESTS.map((t, i) => (
              <div key={t} className="ag__test" data-etat={etat(i)} {...foc(etape === 4 && i === 3)}>
                <span className="ag__pastille" />
                <code>{t}</code>
              </div>
            ))}
            <p className="ag__bilan" data-c={bilan.c}>
              {bilan.t}
            </p>
          </div>

          <div className="ag__term" {...foc(etape === 0)}>
            {JOURNAL.filter(([e]) => e <= etape)
              .slice(-7)
              .map(([e, t, c], i) => (
                <div key={`${e}-${t}`} className="ag__log" data-c={c} data-neuf={e === etape ? "1" : "0"} style={{ animationDelay: `${i * 30}ms` }}>
                  {t}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DemoAgent(_props: { nu?: boolean } = {}) {
  const en = useLangue() === "en"
  const etapes = useMemo(() => versEtapes(ETAPES, en), [en])
  return (
    <GuideShell
      nom="SELF_DEV_AGENT"
      sim={en ? "Simulation — no agent is executed" : "Simulation — aucun agent n'est exécuté"}
      etapes={etapes}
      scene={({ etape }) => <Scene etape={etape} />}
    />
  )
}
