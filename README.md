# Portfolio — Yendi Yohann

Portfolio d'un élève ingénieur Big Data & IA (ECE Paris) qui vise le **MLOps** et le **machine learning engineering** : affiner un modèle, le servir derrière une API, le conteneuriser et le déployer de façon reproductible.

🌐 **En ligne : [v0-junior-developer-portfolio-bay.vercel.app](https://v0-junior-developer-portfolio-bay.vercel.app/)**

Le site cherche un stage de 4 à 6 mois à partir d'avril 2027.

## Ce que contient le site

| Page | Contenu |
| --- | --- |
| `/` | Page d'accueil : l'essentiel du parcours, dans l'ordre décrit ci-dessous |
| `/projects` et `/projects/[slug]` | Projets de développement, avec une fiche détaillée par projet |
| `/data-projects` | Projets data / ML (RAG, fine-tuning, RL, scoring, tests A/B…) |
| `/about` | Parcours, formation, expériences |
| `/contact` | Formulaire de contact |

### La page d'accueil, section par section

1. **Hero** — le titre, la disponibilité et les deux appels à l'action.
2. **Schéma RAG** — un pipeline animé (requête → recherche hybride vectorielle + BM25 → fusion RRF → reranking → réponse citée), épinglé pendant le défilement.
3. **En chiffres** — le bandeau de compteurs.
4. **Projets** — les projets phares, une carte par projet.
5. **Démonstrations** — quatre scénarios simulés au clic (RAG-Local sur des fichiers, un scan rendu cherchable, SELF_DEV_AGENT, Mina-Translator). Ce sont des simulations, et la page le dit.
6. **À propos**, **Compétences**, **Méthode**, **Veille** — le profil, les technologies regroupées par famille avec une preuve pour chacune, la démarche de travail et ce qui est en cours d'apprentissage.
7. **Contact** — l'appel final.

## Le robot : fil conducteur de la page d'accueil

Un cube filaire, à droite du hero, se transforme en petit robot dès qu'on descend, puis accompagne la lecture. Il ne bouge jamais « pour bouger » : chaque section lui donne un rôle, et le rail de lecture à gauche indique l'étape en cours, de la donnée au déploiement.

| Section | Rôle du robot |
| --- | --- |
| Hero | Cube fermé et grand : la donnée brute, avant que quoi que ce soit ne tourne |
| Schéma RAG | Il porte la requête le long du pipeline et se dédouble pendant la recherche parallèle |
| En chiffres | Il passe sous le bandeau et désigne chaque compteur |
| Projets | Il suit la carte lue, puis attire l'œil vers son lien |
| Démonstrations | Il regarde la simulation, puis invite à essayer un autre scénario |
| À propos | Il souligne les phrases qui portent le propos |
| Compétences | Il s'arrête sous chaque famille, sur le badge dont le site contient la preuve |
| Méthode | Il parcourt les étapes et les allume derrière lui |
| Veille | Il lit les trois chantiers en cours |
| Contact | Il grossit, puis rétrécit et devient le bouton « Me contacter » |

Il réagit aussi à ce que fait le visiteur : son regard suit la souris et se pose sur ce qu'on survole, il s'incline avec la vitesse de défilement, et un clic sur un onglet attire son attention.

Règles de conception :

- Il ne se pose jamais sur du texte : il vit dans la marge droite, dans les respirations entre deux blocs, ou sur le schéma lui-même.
- Aucune dépendance en plus : pas de canvas, pas de WebGL. Le JavaScript écrit des variables CSS, le GPU compose le reste.
- Il n'existe qu'à partir de 1281 px de large. En dessous, la page est identique sans lui, et le bouton de contact reprend sa place normale.
- Avec `prefers-reduced-motion`, il se positionne sans lissage ni oscillation.

Le code est dans `components/objet-3d.tsx` (les scènes) et dans la fin de `app/globals.css` (le volume, les expressions et les effets posés sur la page).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) et React 19
- TypeScript
- Tailwind CSS 4, composants [shadcn/ui](https://ui.shadcn.com/) (Radix)
- [anime.js](https://animejs.com/) pour les simulations et le hero, [Framer Motion](https://www.framer.com/motion/) pour les apparitions
- `next-themes` : thème sombre par défaut, clair disponible
- Déploiement sur Vercel, avec Vercel Analytics

## Démarrer en local

Prérequis : Node.js 20 ou plus, et [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/Yohannkp/Mon-Portfolio.git
cd Mon-Portfolio
pnpm install
pnpm dev
```

Le site est alors disponible sur <http://localhost:3000>.

Pour tester une version de production : `pnpm build` puis `pnpm start`.

## Organisation du code

```
app/                    pages (App Router) et styles globaux
components/
  sections/             les sections de la page d'accueil et les démos
  ui/                   composants shadcn/ui
  objet-3d.tsx          le robot
  reading-rail.tsx      le rail de lecture
lib/
  projects.ts           projets de développement
  data-projects.ts      projets data / ML
public/                 images et icônes
```

Pour ajouter un projet, il suffit d'ajouter une entrée dans `lib/projects.ts` ou `lib/data-projects.ts` : la liste et la fiche détaillée sont générées à partir de ces fichiers.

## Licence

Code publié sous licence MIT — voir [LICENSE](LICENSE).
