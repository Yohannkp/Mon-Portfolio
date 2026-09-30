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
| `/about` | Parcours (dont les stages), ce que je recherche, valeurs |
| `/contact` | Formulaire de contact et coordonnées |
| `/sitemap.xml`, `/robots.txt`, image d'aperçu | Générés au build : plan du site, indexation, et image affichée quand on partage le lien |

### La page d'accueil, section par section

1. **Hero** — le titre, la disponibilité et les deux appels à l'action.
2. **Schéma RAG** — un pipeline animé (requête → recherche hybride vectorielle + BM25 → fusion RRF → reranking → réponse citée), épinglé pendant le défilement.
3. **En chiffres** — le bandeau de compteurs.
4. **Projets** — sept études de cas : la question qu'un recruteur se pose, la preuve chiffrée en grand, un schéma de l'idée, et la méthode qui se déplie en un clic.
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
| Contact | Il reste grand dans son cercle, au-dessus du titre, et regarde le bouton « Me contacter » |

Il réagit aussi à ce que fait le visiteur : son regard suit la souris et se pose sur ce qu'on survole, il s'incline avec la vitesse de défilement, et un clic sur un onglet attire son attention. Quand on passe la souris sur lui, il réagit au hasard (jamais deux fois la même de suite) : il prend un air fier, il s'avance en brillant pendant que le fond s'assombrit, il tourne sur lui-même, ou il se balance de gauche à droite.

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
- Il n'existe qu'à partir de 1281 px de large. En dessous, la page se lit à l'identique sans lui : son cercle en fin de page disparaît, et le bouton « Me contacter » reste le même.
- Avec `prefers-reduced-motion`, il se positionne sans lissage ni oscillation.

Le code est dans `components/objet-3d.tsx` (les scènes) et dans la fin de `app/globals.css` (le volume, les expressions et les effets posés sur la page).

## Les projets : présentés par ce qu'ils prouvent

Une liste de technologies ne dit pas pourquoi un projet compte. Chaque projet est donc décrit par un **dossier** (`lib/dossiers.ts`) : le problème posé, ce qui a été fait, ce que cela démontre, et **une preuve chiffrée quand elle existe**.

- **Aucun chiffre inventé.** Chaque valeur vient d'un projet documenté (360 paires, AUC 0,88, 85 % de précision, +15 % de rotation des stocks, 0 requête sortante…). Un projet sans chiffre n'en reçoit pas : il a un enjeu et un résultat.
- **Sur l'accueil**, sept projets phares sont des études de cas. Chacun répond à une question de recruteur (« Peut-il livrer un système d'IA sans exposer les données ? »), avec un schéma qui illustre l'idée (`components/glyphes.tsx`). Le schéma est une illustration, jamais une mesure.
- **Sur `/projects`**, un bandeau réunit les huit preuves chiffrées, puis les 17 projets sont classés en quatre axes : mettre des modèles en production, affiner et entraîner, mesurer et prouver, construire des applications. Un sommaire collant suit l'axe lu. Il remplace l'ancien mur de filtres techniques.

## La présentation automatique (accueil uniquement)

Un bouton rond, en bas à gauche de la page d'accueil (il s'efface pendant que vous faites défiler la page, pour ne jamais gêner la lecture), lance une **visite guidée qui défile toute seule** : le visiteur n'a rien à faire, la page va d'un arrêt à l'autre, et les animations et le robot suivent.

- **▶ / ■** lance ou arrête la visite. Au repos, le bouton n'est qu'une icône ; en lecture, la phrase du guide s'affiche au-dessus (« Étape 5 / 17 · Projet 2 sur 6 · Mina-Translator »), et un anneau autour du bouton indique l'avancement.
- **Défiler arrête aussitôt** : molette, tactile, clavier (flèches, espace, Page haut/bas, Échap) ou glissement de la barre de défilement.
- **Rappuyer reprend là où l'on est**, pas au début, et continue jusqu'à la fin. Après la fin, ▶ repart du début.
- **Invitation :** quand le visiteur arrive de lui-même sur les projets (en faisant défiler, pas pendant une visite), une petite carte douce monte au-dessus du bouton et lui propose de lancer la visite à partir de là ; un anneau respire autour du bouton. Elle se ferme d'un clic, avec « Plus tard » ou Échap, et ne réapparaît pas de la session (`sessionStorage`).
- **Au survol**, « Recommencer » apparaît : la page remonte tout en haut, la démonstration repart de sa première étape, et la visite reprend à zéro.

Les 17 arrêts suivent le fil de la page : accueil, schéma RAG (balayé lentement, car il est piloté par le défilement), chiffres, les sept projets un par un avec sa question et sa preuve (le projet présenté grandit nettement, de 10 %, pendant que les six autres reculent et s'estompent ; le robot se cale sur son bord, et le schéma du projet se met en mouvement : une vague qui parcourt ses éléments dans l'ordre, et des flux sur les traits en tirets), les démonstrations (la visite guidée de la démo se joue jusqu'au bout avant de continuer), à propos, compétences, méthode, veille, contact.

Rien n'est « joué » à part : la visite ne fait que **faire défiler la page**, donc les animations et le robot se comportent exactement comme si l'on défilait à la main. Le moteur est dans `components/presentation-auto.tsx` ; ajouter un arrêt, c'est ajouter une entrée à la liste `ARRETS`. Avec `prefers-reduced-motion`, les trajets entre deux arrêts sont instantanés.

## Contact : ce que fait vraiment le formulaire

Ce site n'a pas de serveur de courrier. Le formulaire **ne prétend donc pas envoyer** : il prépare le message dans l'application e-mail du visiteur (`mailto:` avec sujet et corps remplis), lui dit clairement qu'il lui reste à l'envoyer, et lui donne l'adresse si rien ne s'ouvre (boutons « Rouvrir » et « Copier l'adresse »). La saisie est conservée si on clique sur « Modifier le message ». Les coordonnées viennent d'un seul endroit : `lib/contact.ts`.

Pour recevoir les messages directement dans une boîte, sans passer par l'application e-mail du visiteur, il faudrait un service d'envoi (Formspree, Web3Forms, Resend…) et sa clé : c'est une décision à part.

## Version mobile

Le site est vérifié de 360 à 768 px de large : aucune page ne déborde à l'horizontale.

- **Schéma RAG :** sous 820 px il garde une taille lisible (700 px) et se fait glisser du doigt, avec une indication au-dessus, plutôt que d'être réduit à quelques pixels. Les étapes s'empilent en cartes.
- **Présentation automatique :** un petit rond en bas à droite (le texte est aligné à gauche). « Recommencer » n'apparaît que lorsqu'une visite est commencée, puisqu'il n'y a pas de survol au doigt. Le bouton s'efface pendant le défilement manuel.
- **Projets :** les cartes passent en une colonne, le schéma ou l'image occupe toute la largeur.
- **Au doigt** (`pointer: coarse`) : les liens texte, « Comment j'ai fait » et les points d'étape des démonstrations gardent leur apparence mais ont une zone tactile de 44 px.
- **Sans robot** (moins de 1281 px) : la page se lit à l'identique, sans lui.

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
  presentation-auto.tsx la présentation automatique (accueil)
  page-transition.tsx   la transition entre les pages
lib/
  contact.ts            l'adresse e-mail et le lien du message (formulaire, page Contact, pied de page)
  dossiers.ts           les projets : enjeu, résultat, preuve chiffrée, axe (source unique de l'accueil et de /projects)
  projects.ts           le détail des études de cas des applications (/projects/[slug])
public/                 images et icônes
```

Pour ajouter un projet, on ajoute un dossier dans `lib/dossiers.ts` : il apparaît dans son axe sur `/projects`, et sur l'accueil s'il porte un `phare`. Une étude de cas détaillée s'ajoute en plus dans `lib/projects.ts`, et se relie par le champ `fiche`.

## Licence

Code publié sous licence MIT — voir [LICENSE](LICENSE).
