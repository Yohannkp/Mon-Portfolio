"use client"

import { foc, GuideShell, useSerie, type Etape } from "@/components/sections/demo-guide"

/**
 * SELF_DEV_AGENT corrige un bug : la boucle explorer -> comprendre -> tester -> corriger.
 * Rien n'est execute : chaque etape n'est qu'un etat de la scene, calcule a partir de l'etape.
 */

const ETAPES: Etape[] = [
  {
    titre: "Une consigne",
    texte: "Je demande à l'agent de corriger un bug dans la fonction divide. Il n'a que cette phrase, et des outils.",
    humeur: "neutre",
  },
  {
    titre: "Chercher",
    texte: "Avant de toucher au code, il cherche où la fonction est définie : ici, ligne 42 de calc.py.",
    humeur: "concentre",
  },
  {
    titre: "Lire",
    texte: "Il lit le code autour pour comprendre ce que la fonction fait vraiment, sans deviner.",
    humeur: "concentre",
  },
  {
    titre: "Tester d'abord",
    texte: "Il lance les tests avant de modifier quoi que ce soit : il veut voir le bug, pas le supposer.",
    humeur: "curieux",
    attente: 1200,
  },
  {
    titre: "Le test rouge",
    texte: "test_divide_by_zero échoue avec une ZeroDivisionError. Le bug est reproduit : on a une cible précise.",
    humeur: "concentre",
    attente: 600,
  },
  {
    titre: "Corriger",
    texte: "Il écrit la correction : lever une erreur claire quand le diviseur est nul, au lieu de planter.",
    humeur: "concentre",
    attente: 600,
  },
  {
    titre: "Vérifier",
    texte: "Il relance les mêmes tests sur son correctif. Rien n'est admis tant que ça n'a pas été exécuté.",
    humeur: "curieux",
    attente: 1200,
  },
  {
    titre: "Le test vert",
    texte: "Les 4 tests passent. La correction n'est pas seulement proposée : elle est prouvée.",
    humeur: "content",
  },
  {
    titre: "Pourquoi c'est fiable",
    texte:
      "Un modèle local de 7 milliards de paramètres se trompe souvent. Ce qu'on croit, ce ne sont pas ses réponses : ce sont les tests.",
    humeur: "content",
  },
]

const NOEUDS = ["Explorer", "Comprendre", "Tester", "Corriger"]
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
const GARDE = ["    if b == 0:", '        raise ValueError("division par zero")']

type Ligne = { t: string; c?: "moins" | "plus" | "neuf" | "cible" | "sel" | "rouge"; foc?: boolean }

const JOURNAL: [number, string, string][] = [
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

/** Quel noeud de la boucle travaille a cette etape ; -1 : aucun. */
const ACTIF = [-1, 0, 1, 2, 2, 3, 2, 2, -1]
const VU = (i: number, etape: number) => [1, 2, 3, 5][i] <= etape

function editeur(etape: number): Ligne[] {
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
  const k = useSerie(etape === 3 || etape === 6, 4, 560)
  const lignes = editeur(etape)
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
        {NOEUDS.map((n, i) => (
          <div key={n} className="ag__noeud-conteneur">
            <div
              className="ag__noeud"
              data-etat={ACTIF[etape] === i ? "actif" : etape === 8 ? "actif" : VU(i, etape) ? "vu" : "attente"}
            >
              {n}
            </div>
            {i < NOEUDS.length - 1 ? <span className="ag__lien" data-on={VU(i + 1, etape) ? "1" : "0"} /> : null}
          </div>
        ))}
        <span className="ag__retour" data-on={etape >= 5 ? "1" : "0"}>
          ↻ tant que les tests échouent
        </span>
      </div>

      <div className="ag__grille">
        <div className="ag__editeur" data-etat={etape === 0 ? "ferme" : "ouvert"}>
          <div className="ag__onglet">
            <span>calc.py</span>
            {etape === 1 ? (
              <em>grep divide → calc.py:42</em>
            ) : etape === 0 ? (
              <em>non ouvert</em>
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
  return (
    <GuideShell
      nom="SELF_DEV_AGENT"
      sim="Simulation — aucun agent n'est exécuté"
      etapes={ETAPES}
      scene={({ etape }) => <Scene etape={etape} />}
    />
  )
}
