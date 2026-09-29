/**
 * Ce que fait une simulation, lu sur la page.
 *
 * Les demonstrations sont des timelines anime.js qui ecrivent dans le DOM :
 * lignes de terminal qui apparaissent, barre qui avance, texte qui se tape,
 * boites qui s'allument. Le robot n'a donc pas besoin de deviner ni de
 * chronometrer : il lit l'etat reel de la simulation a l'instant present, et
 * son commentaire ne peut pas etre en avance ni en retard sur ce qu'on voit.
 *
 * Aucune dependance vers les composants : seulement des selecteurs. Si une
 * demo change de structure, la fonction renvoie null et le robot se tait.
 */

export type Scenario = "agent" | "fichiers" | "scan" | "mina"
export type Humeur = "neutre" | "concentre" | "content" | "curieux"

export type PhaseDemo = {
  /** Identifie l'etape : le commentaire ne change que si la cle change. */
  cle: string
  titre: string
  texte: string
  humeur: Humeur
  /** L'element que la simulation vient de toucher : c'est la que regarde le robot. */
  focus: Element | null
  /**
   * Un moment qui compte (test rouge, test vert, reponse citee…). Il interrompt le
   * commentaire en cours au lieu d'attendre son tour, et on lui laisse le temps d'etre lu.
   */
  marquant?: boolean
}

/** Ce que la simulation a etabli, une fois terminee. */
export const RESULTAT: Record<Scenario, string> = {
  agent: "Test vert — 4 sur 4",
  fichiers: "3 photos retrouvées",
  scan: "Réponse citée",
  mina: "Traduction produite",
}

/** Opacite posee par anime.js en style inline ; 0 tant que l'element n'est pas apparu. */
const opacite = (el: Element | null | undefined) => {
  const v = parseFloat((el as HTMLElement | null)?.style.opacity ?? "")
  return Number.isNaN(v) ? 0 : v
}
const visible = (el: Element | null | undefined) => opacite(el) > 0.5
const dernier = <T>(liste: T[], garde: (x: T) => boolean): T | null => {
  for (let i = liste.length - 1; i >= 0; i--) if (garde(liste[i])) return liste[i]
  return null
}

export function scenarioDemo(zone: ParentNode | null): Scenario | null {
  if (!zone) return null
  if (zone.querySelector(".term")) return "agent"
  if (zone.querySelector("[data-ligne-idx]")) return "fichiers"
  if (zone.querySelector("[data-scan]")) return "scan"
  if (zone.querySelector(".chaine")) return "mina"
  return null
}

const phase = (
  cle: string,
  titre: string,
  texte: string,
  focus: Element | null,
  humeur: Humeur = "concentre",
  marquant = false,
): PhaseDemo => ({ cle, titre, texte, humeur, focus, marquant })

/** L'agent : on lit la derniere ligne du terminal, et combien de fois les tests ont ete lances. */
function agent(zone: ParentNode): PhaseDemo | null {
  const lignes = Array.from(zone.querySelectorAll<HTMLElement>(".term__l"))
  const l = dernier(lignes, visible)
  if (!l) return null
  const vues = lignes.slice(0, lignes.indexOf(l) + 1)
  const outil = l.querySelector(".term__outil")?.textContent?.trim()
  const lancers = vues.filter((v) => v.querySelector(".term__outil")?.textContent?.trim() === "run_python").length

  if (l.classList.contains("inv")) return phase("tache", "Tâche", "Corriger le bug dans divide", l, "neutre")
  if (outil === "grep") return phase("grep", "Recherche", "Il localise la fonction avant d'y toucher", l)
  if (outil === "read_file") return phase("lecture", "Lecture", "Il lit le code autour, sans deviner", l)
  if (outil === "run_python")
    return lancers < 2
      ? phase("test1", "Tests", "Premier lancement de la suite de tests", l, "curieux")
      : phase("test2", "Tests", "Il relance les mêmes tests sur son correctif", l, "curieux")
  if (l.classList.contains("ko")) return phase("rouge", "Test rouge", "ZeroDivisionError : le bug est reproduit", l, "concentre", true)
  if (outil === "edit_file" || l.classList.contains("plus") || l.classList.contains("moins"))
    return phase("edition", "Correction", "Il ajoute une garde sur b == 0", l)
  if (l.classList.contains("out") && l.classList.contains("ok"))
    return phase("vert", "Test vert", "4 tests sur 4 passent", l, "content", true)
  if (l.classList.contains("ok"))
    return phase("verifie", "Vérifié", "La correction est testée, pas seulement proposée", l, "content")
  return null
}

/** Les fichiers : de l'indexation a la recherche, de la derniere etape la plus avancee a la premiere. */
function fichiers(zone: ParentNode): PhaseDemo | null {
  const journal = Array.from(zone.querySelectorAll("[data-j]"))
  const note = zone.querySelector(".note-vision")
  const fics = Array.from(zone.querySelectorAll(".fic"))
  const q = zone.querySelector("[data-q]")?.textContent ?? ""
  const ligne = zone.querySelector("[data-ligne-idx]")
  const etat = ligne?.textContent?.trim() ?? ""

  const dernierJ = dernier(journal, visible)
  if (dernierJ)
    return phase("local", "Local", "Aucune requête réseau sortante : tout reste sur la machine", dernierJ, "content", true)
  if (visible(note))
    return phase("sans-texte", "Sans texte", "Ces photos n'ont aucun texte : on cherche leur description", note, "curieux", true)
  const dernierF = dernier(fics, visible)
  if (dernierF) return phase("resultats", "Recherche", "Les fichiers sont classés par similarité avec la question", dernierF, "concentre", true)
  if (q.length > 0)
    return phase("question", "Question", "Elle est comparée à l'index, pas aux mots des fichiers", zone.querySelector("[data-q]"))
  if (etat.startsWith("Indexation terminée")) return phase("index-fin", "Index prêt", "1 247 fichiers sont cherchables", ligne, "content")
  if (etat.startsWith("Fichier inchangé"))
    return phase("incremental", "Incrémental", "Fichier inchangé : il n'est pas réanalysé", ligne, "curieux")
  if (etat.startsWith("Description de l'image"))
    return phase("vision", "Vision", "Un modèle de vision décrit l'image : ce texte sera cherché", ligne)
  if (etat.startsWith("Lecture")) return phase("lecture", "Lecture", "Le texte du document est extrait", ligne)
  return null
}

/** Le scan : une page-image qui devient interrogeable. */
function scan(zone: ParentNode): PhaseDemo | null {
  const journal = Array.from(zone.querySelectorAll("[data-j]"))
  const rep = zone.querySelector("[data-rep]")
  const q = zone.querySelector("[data-q]")
  const avant = zone.querySelector("[data-avant]")?.textContent ?? ""
  const lignes = Array.from(zone.querySelectorAll(".scan__l"))
  const balayeur = zone.querySelector("[data-scan]")

  const dernierJ = dernier(journal, visible)
  if (dernierJ) return phase("local", "Local", "Tout s'est passé sur la machine", dernierJ, "content")
  if (rep?.querySelector(".demo__cit"))
    return phase("citation", "Citation", "[1] renvoie au passage exact de la page", rep.querySelector(".demo__cit"), "content", true)
  if (visible(rep)) return phase("reponse", "Réponse", "Rédigée depuis le passage retrouvé, pas de mémoire", rep, "concentre", true)
  if ((q?.textContent ?? "").length > 0) return phase("question", "Question", "Elle est cherchée dans le texte transcrit", q)
  if (avant.includes("412")) return phase("indexe", "Indexé", "412 caractères transcrits : la page est cherchable", zone.querySelector("[data-avant]"), "content")
  const derniereL = dernier(lignes, visible)
  if (derniereL) return phase("transcription", "Transcription", "Le modèle de vision lit la page ligne par ligne", derniereL)
  if (visible(balayeur)) return phase("scan", "Scan", "Une image : aucun texte n'est extractible pour l'instant", balayeur, "curieux")
  return null
}

/** Mina : la chaine Whisper -> modele affine -> sortie. */
function mina(zone: ParentNode): PhaseDemo | null {
  const boites = Array.from(zone.querySelectorAll(".chaine__boite"))
  const allumee = (b: Element | undefined) => opacite(b) > 0.9
  const note = zone.querySelector("[data-note]")

  if (visible(note)) return phase("corpus", "Corpus", "360 paires validées par un locuteur", note, "content")
  if (allumee(boites[2])) return phase("sortie", "Sortie", "Le texte mina est produit", boites[2], "content", true)
  if (allumee(boites[1])) return phase("traduction", "Traduction", "Qwen2-0.5B affiné en QLoRA 4 bits traduit", boites[1])
  if (allumee(boites[0])) return phase("whisper", "Transcription", "Whisper transforme la voix en texte", boites[0], "curieux")
  return null
}

export function lireDemo(zone: ParentNode | null): PhaseDemo | null {
  switch (scenarioDemo(zone)) {
    case "agent":
      return agent(zone!)
    case "fichiers":
      return fichiers(zone!)
    case "scan":
      return scan(zone!)
    case "mina":
      return mina(zone!)
    default:
      return null
  }
}
