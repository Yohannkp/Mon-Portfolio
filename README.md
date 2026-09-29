# Portfolio — Yendi Yohann

Portfolio d'un élève ingénieur Big Data & IA (ECE Paris) qui vise le **MLOps** et le **machine learning engineering** : affiner un modèle, le servir derrière une API, le conteneuriser et le déployer de façon reproductible.

🌐 **En ligne : [v0-junior-developer-portfolio-bay.vercel.app](https://v0-junior-developer-portfolio-bay.vercel.app/)**

Le site cherche un stage de 4 à 6 mois à partir d'avril 2027.

## Ce que contient le site

| Page | Contenu |
| --- | --- |
| `/` | Page d'accueil : l'essentiel du parcours, dans l'ordre décrit ci-dessous |
| `/projects` | Les 17 projets, classés par ce qu'ils démontrent (voir ci-dessous). `/data-projects` y redirige |
| `/projects/[slug]` | Étude de cas détaillée des applications (problème, solution, défis, apprentissages) |
| `/about` | Parcours, formation, expériences |
| `/contact` | Formulaire de contact |

### La page d'accueil, section par section

1. **Hero** — le titre, la disponibilité et les deux appels à l'action.
2. **Schéma RAG** — un pipeline animé (requête → recherche hybride vectorielle + BM25 → fusion RRF → reranking → réponse citée), épinglé pendant le défilement.
3. **En chiffres** — le bandeau de compteurs.
4. **Projets** — six études de cas : la question qu'un recruteur se pose, la preuve chiffrée en grand, un schéma de l'idée, et la méthode qui se déplie en un clic.
5. **Démonstrations** — quatre visites guidées, chacune menée par le robot (RAG-Local sur des fichiers, un scan rendu cherchable, SELF_DEV_AGENT, Mina-Translator). Ce sont des simulations, et la page le dit.
6. **À propos**, **Compétences**, **Méthode**, **Veille** — le profil, les technologies regroupées par famille avec une preuve pour chacune, la démarche de travail et ce qui est en cours d'apprentissage.
7. **Contact** — l'appel final.

## Le robot : fil conducteur de la page d'accueil

Un cube filaire, à droite du hero, se transforme en petit robot dès qu'on descend, puis accompagne la lecture. Il ne bouge jamais « pour bouger » : chaque section lui donne un rôle, et le rail de lecture à gauche indique l'étape en cours, de la donnée au déploiement.

| Section | Rôle du robot |
| --- | --- |
| Hero | Cube fermé et grand : la donnée brute, avant que quoi que ce soit ne tourne |
| Schéma RAG | Il porte la requête le long du pipeline et se dédouble pendant la recherche parallèle |
| En chiffres | Il passe sous le bandeau et désigne chaque compteur |
| Projets | Il suit l'étude de cas lue et dit ce qu'elle démontre, puis attire l'œil vers son dépôt |
| Démonstrations | Il guide la visite, étape par étape (voir ci-dessous), puis invite à essayer un autre scénario |
| À propos | Il souligne les phrases qui portent le propos |
| Compétences | Il s'arrête sous chaque famille, sur le badge dont le site contient la preuve |
| Méthode | Il parcourt les étapes et les allume derrière lui |
| Veille | Il lit les trois chantiers en cours |
| Contact | Il grossit, puis rétrécit et devient le bouton « Me contacter » |

Il réagit aussi à ce que fait le visiteur : son regard suit la souris et se pose sur ce qu'on survole, il s'incline avec la vitesse de défilement, et un clic sur un onglet attire son attention.

**Les démonstrations sont des visites guidées.** Le robot ne laisse plus une animation filer : il explique la simulation une étape à la fois, dans le panneau, à côté de la scène.

- Chaque étape a un titre et une phrase que le robot écrit à une vitesse lisible, puis un temps de lecture proportionnel à la longueur du texte (de 5 à 9 secondes par étape). Une fine barre montre le temps avant la suite.
- Le visiteur garde la main : pause, précédent, suivant, saut direct à une étape, flèches du clavier. La visite démarre quand on la voit et se met en pause quand on la quitte des yeux.
- La scène est une fonction de l'étape courante : on peut reculer, sauter ou rejouer sans jamais obtenir un état incohérent.
- Le robot se pose dans la colonne du guide, regarde ce que l'étape montre, et prend l'humeur de l'étape (concentré, curieux, content). À la fin, les autres scénarios s'allument pour l'inviter à continuer.
- Sous 1281 px, le robot n'existe pas, mais la visite est complète : le guide et ses contrôles s'empilent au-dessus de la scène.

Chaque scénario montre son mécanisme, pas un décor :

| Scénario | Ce que la scène montre |
| --- | --- |
| SELF_DEV_AGENT | La boucle explorer → comprendre → tester → corriger, un éditeur avec le diff, les tests qui passent au rouge puis au vert |
| RAG-Local | Les fichiers lus un par un, les images décrites par un modèle de vision, puis la carte de recherche : la question et ses plus proches voisins avec leur score |
| Scan cherchable | Une page-image, le balayage, les lignes repérées, la transcription, le passage retrouvé, et la réponse dont le renvoi [1] pointe la ligne exacte |
| Mina-Translator | Les 360 paires du corpus, le modèle de base et son adaptateur LoRA, puis la chaîne voix → Whisper → traduction |

Le moteur commun est `components/sections/demo-guide.tsx` ; chaque scénario ne fournit que ses étapes et sa scène.

Règles de conception :

- Il ne se pose jamais sur du texte : il vit dans la marge droite, dans les respirations entre deux blocs, ou sur le schéma lui-même.
- Aucune dépendance en plus : pas de canvas, pas de WebGL. Le JavaScript écrit des variables CSS, le GPU compose le reste.
- Il n'existe qu'à partir de 1281 px de large. En dessous, la page est identique sans lui, et le bouton de contact reprend sa place normale.
- Avec `prefers-reduced-motion`, il se positionne sans lissage ni oscillation.

Le code est dans `components/objet-3d.tsx` (les scènes) et dans la fin de `app/globals.css` (le volume, les expressions et les effets posés sur la page).

## Les projets : présentés par ce qu'ils prouvent

Une liste de technologies ne dit pas pourquoi un projet compte. Chaque projet est donc décrit par un **dossier** (`lib/dossiers.ts`) : le problème posé, ce qui a été fait, ce que cela démontre, et **une preuve chiffrée quand elle existe**.

- **Aucun chiffre inventé.** Chaque valeur vient d'un projet documenté (360 paires, AUC 0,88, 85 % de précision, +15 % de rotation des stocks, 0 requête sortante…). Un projet sans chiffre n'en reçoit pas : il a un enjeu et un résultat.
- **Sur l'accueil**, six projets phares sont des études de cas. Chacun répond à une question de recruteur (« Peut-il livrer un système d'IA sans exposer les données ? »), avec un schéma qui illustre l'idée (`components/glyphes.tsx`). Le schéma est une illustration, jamais une mesure.
- **Sur `/projects`**, un bandeau réunit les huit preuves chiffrées, puis les 17 projets sont classés en quatre axes : mettre des modèles en production, affiner et entraîner, mesurer et prouver, construire des applications. Un sommaire collant suit l'axe lu. Il remplace l'ancien mur de filtres techniques.

## Transitions et interactions

- **Entre les pages :** la page sort en fondu pendant qu'une fine barre indique le chargement, puis la suivante entre en cascade (`components/page-transition.tsx`, styles en fin de `app/globals.css`). Un Ctrl/Cmd+clic, une ancre ou le bouton retour du navigateur gardent leur comportement normal.
- **Boutons :** tous réagissent au survol (léger relief) et au clic (léger enfoncement). Une flèche de bouton avance vers ce qu'il promet.
- **Menu :** la pastille du menu glisse d'un lien à l'autre.
- **Mouvement réduit :** avec `prefers-reduced-motion`, la navigation est immédiate et les effets de survol sont coupés.

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
  sections/             les sections de la page d'accueil ; demo-guide.tsx est le moteur des visites guidées
  ui/                   composants shadcn/ui
  objet-3d.tsx          le robot
  reading-rail.tsx      le rail de lecture
  page-transition.tsx   la transition entre les pages
lib/
  dossiers.ts           les projets : enjeu, résultat, preuve chiffrée, axe (source unique de l'accueil et de /projects)
  projects.ts           le détail des études de cas des applications (/projects/[slug])
public/                 images et icônes
```

Pour ajouter un projet, on ajoute un dossier dans `lib/dossiers.ts` : il apparaît dans son axe sur `/projects`, et sur l'accueil s'il porte un `phare`. Une étude de cas détaillée s'ajoute en plus dans `lib/projects.ts`, et se relie par le champ `fiche`.

## Licence

Code publié sous licence MIT — voir [LICENSE](LICENSE).
