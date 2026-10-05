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

### La colère du robot (une seule fois)

Si le visiteur défile **à la main** et traverse la section des simulations d'un trait (moins d'une seconde et demie, sans y avoir joué), le robot se fâche : visage furieux, tout rouge (`hue-rotate` piloté par `--rage`), il se balance, **descend pour prendre de l'élan**, puis **s'élance vers le haut en s'accélérant, la page tirée derrière lui, et cogne le plafond de l'écran** (anneau d'impact, l'écran tremble, il s'écrase puis rebondit). La page finit d'arriver aux simulations, il se calme (fier), le rouge s'efface et il regagne sa place dans le guide.

**Il se fait pousser des bras** pendant la colère. Chaque bras est **un seul tube souple** (une courbe qui passe par l'épaule, le coude et la main, plus fin au poignet, avec un reflet), pas deux bâtons articulés : rien ne « casse » au coude. Le coude se place tout seul (cinématique inverse à deux os) et chaque main suit sa cible par un ressort. Chaque phase a son propre profil de mouvement, d'après la cinématique des émotions :

- **colère** : bras tendus, coudes verrouillés, qui fouettent l'air (ressort raide, peu amorti), poings serrés ;
- **élan** : bras en arrière, puis dressés avec **dépassement** (overshoot) et rebond élastique ;
- **choc** : « snap » (quasi instantané) et **paumes ouvertes**, doigts écartés, comme un « stop ! » de surprise ;
- **montrer** : les deux bras se tendent vers la démonstration, l'**index** se déplie, ils la désignent tour à tour avec un léger rebond, pendant qu'elle brille ;
- **retour** : geste lourd, très amorti, bras qui pendent, puis il regagne sa place.

Une **respiration** (sinus sur l'épaule) l'empêche d'être figé : rapide et saccadée dans la colère, lente ensuite. Le robot se rend devant la section (à droite du titre, plus grand) pour la désigner avant de retourner à son emplacement habituel.

**Le défilement est verrouillé pendant tout le trajet** (`html[data-scroll-verrou] { overflow: hidden }`, avec `scrollbar-gutter: stable` pour que la page ne saute pas quand la barre disparaît), puis rendu au moment où il désigne la section (le geste continue). Toute la chorégraphie est une fonction du temps (fluide de bout en bout). Une seule fois par visite de la page (rechargée, elle peut revenir) ; jamais pendant la présentation automatique, sur téléphone ou si les animations sont réduites.

### Les émotions du robot

Inspirées de la géométrie des émotions (Paul Ekman) : pas de visage réaliste, seulement des yeux, deux sourcils et une bouche, déformés en variables CSS et en un seul tracé SVG (`components/robot-emotions.ts`).

- **Joie** : bouche à courbure positive et yeux en arc (le sourire de Duchenne). **Tristesse** : moue et extrémités intérieures des sourcils vers le haut. **Colère** : sourcils inclinés vers le centre, bouche resserrée. **Surprise** : yeux grands ouverts, sourcils hauts, bouche en ovale. **Dégoût** : asymétrique, un côté de la bouche relevé et des yeux inégaux. S'y ajoutent la concentration, la curiosité et la fierté.
- **Ce qui donne la vie, c'est le mouvement** : chaque valeur est amortie vers sa cible (l'inertie des muscles), le robot cligne à intervalles irréguliers (2 à 6 s, environ 140 ms, parfois double), son regard fait de minuscules saccades, et sa bouche s'ouvre et se ferme quand la voix parle.
- **Quand** : la scène (concentré sur le schéma, curieux sur les chiffres, content à la fin), la visite (content au lancement et à la fin, triste quand le visiteur reprend la main en défilant, surpris au retour arrière, curieux à l'avance rapide), les réactions au survol, et un visiteur qui le chatouille trop finit par l'agacer (3 survols en 10 s : colère, 5 : dégoût). Le reste du site peut lui faire ressentir quelque chose avec `window.dispatchEvent(new CustomEvent("robot-emotion", { detail: { humeur: "triste", ms: 2000 } }))`.

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
- **Voix et musique :** au lancement, une voix lit la phrase de chaque arrêt et une musique d'ambiance tient le fond. Rien n'est téléchargé : la voix est celle du navigateur (Web Speech API, la meilleure voix française de l'appareil, les voix « naturelles » en priorité), la musique est générée en direct (Web Audio : nappes d'accords doux, réverbération, quelques notes cristallines, sans fichier ni droit d'auteur). La musique baisse quand la voix parle et tout s'arrête en fondu à la pause. Un petit haut-parleur sur l'angle du bouton coupe ou remet le son (préférence gardée dans `localStorage`). Le son ne démarre qu'après un clic, comme l'exigent les navigateurs ; la qualité de la voix dépend de l'appareil.
- **La voix pilote le défilement** (`components/audio-visite.ts`) : la position suit la phrase en cours, mot après mot (événements `boundary` de la synthèse ; à défaut, l'horloge avec un rythme de voix appris phrase après phrase). Le schéma RAG lit une phrase par étape et chaque note apparaît au moment où on en parle (positions mesurées sur la page) ; dans les démonstrations, chaque étape est lue et la démonstration n'avance qu'une fois lue. La voix n'est jamais coupée. Pendant l'avance rapide ×2 elle se tait (le minuteur reprend exactement où l'on est), puis reprend la phrase en cours au relâchement.
- **Le robot traverse la page** : pendant certains projets (le 2ᵉ, le 3ᵉ et le 6ᵉ), il passe devant le contenu jusqu'à la marge de gauche, y reste, puis revient à droite quelques projets plus tard. La légende du rail s'efface pour lui laisser la place ; sans marge suffisante, il reste à droite.
- **Invitation :** quand le visiteur arrive de lui-même sur les projets (en faisant défiler, pas pendant une visite), une petite carte douce monte au-dessus du bouton et lui propose de lancer la visite à partir de là ; un anneau respire autour du bouton. Elle reste visible même pendant que le visiteur défile (le bouton ne s'efface pas tant qu'elle est là) et, s'il file très vite, au moins 6 secondes. Fermée d'un geste (croix, « Plus tard », Échap), elle ne revient plus de la session ; simplement quittée, elle peut revenir, trois fois au plus (`sessionStorage`). `/?invitation` remet ces compteurs à zéro pour la revoir.
- **Au survol**, trois bulles apparaissent à droite du bouton. **Retour** et **×2** se tiennent enfoncées : tant qu'on appuie, la visite remonte (de plus en plus vite) ou avance à double vitesse, et la phrase, la carte et le robot suivent. Au relâchement, elle reprend normalement si elle jouait, sinon elle reste en pause. **Recommencer** remet la page tout en haut, la démonstration à sa première étape, et relance la visite à zéro. Au clavier : Espace ou Entrée maintenus. Sur téléphone, les bulles sont visibles dès qu'une visite est commencée, à gauche du bouton.

Les 17 arrêts suivent le fil de la page : accueil, schéma RAG (balayé lentement, car il est piloté par le défilement), chiffres, les sept projets un par un avec sa question et sa preuve (le projet présenté grandit nettement, de 10 %, pendant que les six autres reculent et s'estompent ; le robot se cale sur son bord, et le schéma du projet se met en mouvement : une vague qui parcourt ses éléments dans l'ordre, et des flux sur les traits en tirets), les démonstrations (la visite guidée de la démo se joue jusqu'au bout avant de continuer), à propos, compétences, méthode, veille, contact.

Rien n'est « joué » à part : la visite ne fait que **faire défiler la page**, donc les animations et le robot se comportent exactement comme si l'on défilait à la main. Le moteur est dans `components/presentation-auto.tsx` ; ajouter un arrêt, c'est ajouter une entrée à la liste `ARRETS`. Avec `prefers-reduced-motion`, les trajets entre deux arrêts sont instantanés.

## Présentation en direct (`/presentation`, réservée à l'auteur)

L'accueil, avec à la place de la visite automatique une **télécommande** en bas de page : **Précédent** et **Suivant** passent d'étape en étape, dans l'ordre de la page, **sans rien sauter, y compris les sous-parties d'une section**. Aujourd'hui 26 étapes : l'accueil, le schéma RAG (l'introduction puis ses cinq étapes), les chiffres, les projets (l'introduction, chacun des sept projets un par un, puis « le reste »), les démonstrations (un scénario par étape : l'onglet est choisi et sa visite guidée repart du début), à propos, compétences, méthode, veille, contact. Les étapes sont relues à chaque appui : si la page change, la télécommande suit ; si l'on défile à la main, elle reprend d'où l'on est.

- **Clavier** : flèches gauche / droite et Page précédente / suivante (ce que les télécommandes de salle envoient).
- **Le robot présente** : un petit bond à chaque étape, le projet présenté grandit, et il ne se fâche pas pendant qu'on présente.
- **Accès réservé** (`proxy.ts`) : la page n'est pas dans le plan du site, pas dans `robots.txt`, marquée `noindex`, et répond **404** à toute personne sans la clé. La clé est la variable d'environnement `PRESENTATION_CLE` (à définir sur Vercel : *Settings → Environment Variables*, puis redéployer). **Première visite sur chaque appareil, une seule fois** : `https://…/presentation?cle=LA_CLE` — un cookie (httpOnly, sécurisé, 30 jours) est posé et l'adresse marche ensuite sans la clé. **Fermée par défaut** : en production, sans la variable, elle est introuvable pour tout le monde ; en développement local sans clé, elle est ouverte. Ce n'est pas un compte utilisateur : quiconque connaît la clé y accède.

## Contact : ce que fait vraiment le formulaire

Ce site n'a pas de serveur de courrier. Le formulaire **ne prétend donc pas envoyer** : il prépare le message dans l'application e-mail du visiteur (`mailto:` avec sujet et corps remplis), lui dit clairement qu'il lui reste à l'envoyer, et lui donne l'adresse si rien ne s'ouvre (boutons « Rouvrir » et « Copier l'adresse »). La saisie est conservée si on clique sur « Modifier le message ». Les coordonnées viennent d'un seul endroit : `lib/contact.ts`.

Pour recevoir les messages directement dans une boîte, sans passer par l'application e-mail du visiteur, il faudrait un service d'envoi (Formspree, Web3Forms, Resend…) et sa clé : c'est une décision à part.

## Mode clair

Le mode clair n'est pas un blanc pur : fond gris-bleu doux (≈ `#ecedf1`), cartes un cran plus claires, texte bleu-gris plutôt que noir, bleu d'accent plus profond pour rester lisible, et un fond qui ne s'assombrit que légèrement quand le robot se met en avant. La couleur de la barre du navigateur (mobile) suit aussi le thème.

## Formation et certifications

Une section de l'accueil (`#sec-formations`, juste après les compétences) montre qu'on s'est formé, puis le prouve :

- **Le cours de SQL de 30 heures** : le chiffre en grand, le lien vers la vidéo, et le lien vers le projet qui le met en pratique (*Ventes en supermarché*). La vidéo est créditée (titre, chaîne *Data with Baraa*, date) et liée. La rubrique « Ce que j'y ai appris » reprend la **table des matières de la vidéo** (ses chapitres), regroupée en sept thèmes — bases, jointures, fonctions, fonctions de fenêtrage, SQL avancé, performance, projets — sans rien ajouter qui n'y figure pas (`FORMATION_SQL.apprentissages`, `lib/formations.ts`).
- **Un aperçu et une photo** : la vignette de la vidéo (cliquable, sans lecteur intégré, donc rien de lourd à charger) et une photo de mes notes manuscrites prises pendant le cours (`public/formation/sql-notes.jpg`, recadrée et visage de l'instructeur flouté).
- **La formation Python / machine learning** de Machine Learnia (Guillaume Saint-Cirgue, 30 vidéos gratuites) suivie à côté des certifications : carte avec les bibliothèques de la description (NumPy, Pandas, Matplotlib, SciPy, Scikit-learn, Seaborn, H5py), aperçu et lien vers la playlist (`FORMATION_PYTHON`).
- **Quatre certifications Credly** choisies pour viser MLOps et data engineering (bases de données et SQL, IBM Data Analyst, Google Advanced Data Analytics, Python pour la data), avec l'image du badge, l'émetteur, la date, la compétence en une ligne et un lien **« Vérifier sur Credly »** vers la page du badge, qui est la preuve. Un lien mène aux 11 badges du profil.
- **Dans la visite automatique** (un arrêt « Formation » avec voix, une phrase pour le cours puis une pour les certifications) **et dans la télécommande** (deux étapes : le cours, puis les certifications). Le robot reste dans la marge, au niveau de la carte lue ; la jauge indique « Formation ».
- Tout est bilingue. Les badges sont des données (`lib/formations.ts`), rien n'est écrit en dur dans le composant. Les images viennent de Credly (si l'une ne se charge pas, une pastille avec l'initiale la remplace).

## Version anglaise

Un bouton **FR / EN** dans l'en-tête (et `?lang=en` dans l'adresse, pratique pour partager un lien) traduit **tout le site** : pages, sections, étapes des démonstrations, bulles du robot, phrases de la visite automatique et de la télécommande, titre de l'onglet. Le choix est retenu dans le navigateur et fixe l'attribut `lang` de la page.

- **Le français reste dans le code, l'anglais juste à côté** : `<T fr="…" en="…" />` en JSX (utilisable aussi dans les composants serveur), `const t = useT(); t("…", "…")` dans un composant, `t("…", "…")` (de `lib/langue.ts`) hors de React. Aucune clé à chercher dans un dictionnaire.
- **Les données** gardent leur version française (`lib/dossiers.ts`, `lib/projects.ts`) ; les versions anglaises sont des surcharges (`lib/dossiers-en.ts`, `lib/projects-en.ts`) : seuls les textes changent, jamais un chiffre, une pile technique ou un lien. Seule la typographie suit la langue (0,88 → 0.88, 878 000 → 878,000).
- **La voix de la visite** change de langue avec le site : elle choisit la meilleure voix anglaise disponible sur l'appareil (voix « naturelles » en priorité), comme pour le français.
- Changer de langue **en pleine visite** met à jour la phrase affichée et relit la phrase en cours dans la nouvelle langue.
- Le serveur produit toujours le français (le site reste entièrement statique) ; l'anglais s'applique dès le premier rendu du navigateur. Les métadonnées de recherche (titre, description) restent en français ; le titre de l'onglet, lui, est traduit.
- Le CV téléchargeable n'existe qu'en français : le bouton le dit (« in French »).

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

## Performances (sans retirer une seule animation)

Mesures faites sur le site compilé (Chromium, défilement de toute la page à vitesse constante) ; le gain est surtout dans ce que le navigateur n'a plus à recalculer à chaque image :

- **Le robot n'invalide plus le style de tout son sous-arbre.** Position, taille, opacité, rotation du cube, bob, regard et inclinaison sont écrits directement sur l'élément concerné (`style.transform`), au lieu de variables CSS héritées : une variable héritée qui change oblige le navigateur à recalculer le style de tous les descendants, à chaque image. Les variables qui restent (expression du visage) ne sont réécrites que si leur valeur change. Résultat : environ 40 % de temps de recalcul de style en moins pendant le défilement.
- **Au repos, le robot passe à une image sur deux** (ni défilement, ni souris, ni visite, ni voix, ni réaction en cours) : il ne fait alors que tourner et respirer très lentement. Les durées étant mesurées en temps réel, le mouvement est identique.
- **La jauge de lecture** n'agit plus que par `transform` (`scaleY`), sans mise en page ni peinture ; la hauteur défilable n'est plus relue à chaque image.
- **Moins de JavaScript au démarrage** : 276 Ko → 235 Ko compressés sur l'accueil. Le robot, la visite automatique (voix, musique) et la télécommande sont chargés juste après le premier rendu (`next/dynamic`) ; `framer-motion` ne sert plus qu'à la pastille du menu et se charge à la demande ; les apparitions au défilement (`components/reveal.tsx`) sont en CSS pur (une animation qui s'arrête d'elle-même, donc le survol et l'inclinaison 3D des cartes reprennent la main).
- **En-tête** : flou d'arrière-plan réduit (12 px au lieu de 16), un des plus gros coûts de peinture d'une barre collante.

Côté référencement et accessibilité : données structurées (`Person`), URL canonique par page, lien « Aller au contenu » pour le clavier.

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
