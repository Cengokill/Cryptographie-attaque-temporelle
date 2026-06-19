# Comparateur de mot de passe (CLI Node.js)

-- Document entièrement reformulé par l'IA pour qu'il soit bien écrit --

Programme en ligne de commande qui compare un mdp saisi à une valeur codée en dur, avec une comparaison vulnérable aux attaques temporelles. Un module d'analyse permet de mesurer expérimentalement la fuite d'information et de démontrer une reconstruction caractère par caractère.

## Arborescence du projet

```text
Cryptographie-juin-2026/
├── src/
│   ├── constantes.js
│   ├── comparateurMotDePasse.js
│   ├── comparateurMotDePasseSecurise.js
│   ├── mesureTempsExecution.js
│   ├── statistiques.js
│   ├── affichageConsole.js
│   ├── analyseurTemporel.js
│   └── programmePrincipal.js
├── package.json
└── README.md
```

## Architecture

| Module | Responsabilité |
|--------|----------------|
| `src/constantes.js` | Mot de passe attendu, codes de retour, messages et paramètres d'analyse |
| `src/comparateurMotDePasse.js` | Comparaison caractère par caractère (algorithme vulnérable) |
| `src/comparateurMotDePasseSecurise.js` | Comparaison en temps constant (`crypto.timingSafeEqual`) |
| `src/mesureTempsExecution.js` | Mesure précise du temps d'exécution (`process.hrtime.bigint`) |
| `src/statistiques.js` | Calcul des statistiques (min, max, moyenne, médiane, écart-type) |
| `src/affichageConsole.js` | Affichage lisible des résultats et conclusion pédagogique |
| `src/analyseurTemporel.js` | Corrélation temporelle et attaque par timing (2 phases) |
| `src/programmePrincipal.js` | Point d'entrée CLI (vérification ou analyse) |

Le comparateur reste isolé. L'analyseur l'appelle uniquement via une fonction de vérification « boîte noire » : on lui envoie un mot de passe candidat, elle répond vrai ou faux (et on peut mesurer le temps de réponse), mais on n'a pas accès au secret ni au code interne. L'attaquant ne lit donc pas directement `MDP_ATTENDU` dans `constantes.js`.

## Mot de passe de référence

Le mot de passe attendu est : `ADZNAuzoef!é87"èBsgvAmX`

Le comparateur applique un **délai simulé par caractère** (`DELAI_PAR_CARACTERE_NS`) pour rendre la fuite mesurable sur CPU modernes. La logique reste naïve avec arrêt précoce.

## Exécution

### Vérification d'un mot de passe

```bash
node src/programmePrincipal.js '<mot-de-passe>'
npm start -- '<mot-de-passe>'
```

### Analyse temporelle

```bash
node src/programmePrincipal.js --analyse
npm run analyse
```

### Analyse avec comparateur corrigé

```bash
node src/programmePrincipal.js --analyse-securise
npm run analyse-securise
```

L'analyse vulnérable peut prendre environ 50 secondes. La version sécurisée sert à montrer que l'attaque ne retrouve plus le mot de passe.

## Paramètres d'analyse (`constantes.js`)

| Constante | Rôle |
|-----------|------|
| `DELAI_PAR_CARACTERE_NS` | Délai simulé par caractère comparé (rend la fuite mesurable) |
| `NOMBRE_REPETITIONS_CORRELATION` | Mesures par candidat pour la corrélation |
| `NOMBRE_REPETITIONS_ATTAQUE` | Mesures par candidat en phase détaillée de l'attaque |
| `NOMBRE_REPETITIONS_PHASE_RAPIDE` | Tri initial des candidats les plus lents |
| `JEU_CARACTERES_ATTAQUE` | Caractères testés sans connaissance préalable du secret |

## Exemples d'utilisation

### Mot de passe valide

```bash
node src/programmePrincipal.js 'ADZNAuzoef!é87"èBsgvAmX'
```

Sortie :

```text
mdp correct !
```

Code de retour : `0`

### Mot de passe invalide

```bash
node src/programmePrincipal.js mauvais
```

Sortie :

```text
mdp incorrect !
```

Code de retour : `1`

### Analyse temporelle (extrait)

```text
=== Analyse temporelle de la comparaison de mot de passe ===

=== Corrélation préfixe correct / temps d'exécution ===

Préfixe | Longueur | Moyenne (ms)  | Médiane (ms)  | Écart-type (ms)
-------|----------|---------------|---------------|----------------
(vide)  |        0 |      0.000123 |      0.000120 |       0.000045
"A"     |        1 |      0.000156 |      0.000154 |       0.000052
"AD"    |        2 |      0.000189 |      0.000187 |       0.000061
...

=== Reconstruction caractère par caractère (attaque temporelle) ===

Position 1 : caractère 'A' (préfixe : "A") - moyenne : 0.000150 ms
Position 2 : caractère 'D' (préfixe : "AD") - moyenne : 0.000180 ms
...

=== Résultat de l'attaque temporelle ===

Mot de passe reconstruit : "ADZNAuzoef!é87\"èBsgvAmX"
Vérification finale : le mot de passe reconstruit est accepté.
```

## Rapport

### Principe de l'attaque et conditions nécessaires

L'attaque temporelle repose sur une fuite d'information dans le temps de réponse. Le comparateur vulnérable parcourt le mot de passe caractère par caractère et s'arrête dès qu'il trouve une différence. Plus le préfixe saisi est correct, plus la boucle tourne longtemps avant de s'arrêter.

Pour exploiter ça, l'attaquant envoie beaucoup de candidats et mesure le temps de chaque appel. À chaque position, il retient le caractère associé au temps le plus élevé. Il reconstruit le mot de passe progressivement, sans le deviner d'un coup.

Plusieurs conditions rendent l'attaque possible ici :

- **Comparaison naïve** avec arrêt précoce (pas de temps constant).
- **Accès répété** à la fonction de vérification (boîte noire : entrée candidat, sortie vrai/faux + durée mesurable).
- **Signal mesurable** : sur CPU récent, la boucle seule est trop rapide. J'ai ajouté un délai simulé par caractère (`DELAI_PAR_CARACTERE_NS`) pour rendre la fuite visible en test, comme sur un système lent ou distant.
- **Pas de limite de débit** sur les tentatives.

### Analyse des résultats

**Nombre d'appels.** Pour un mot de passe de 23 caractères et un jeu de 90 caractères candidats, une analyse complète représente environ **218 800 appels** à la fonction de vérification :

| Phase | Calcul | Appels |
|-------|--------|--------|
| Corrélation | 24 préfixes × 300 mesures | environ 7 200 |
| Attaque (par position) | 90 × 80 (phase rapide) + 5 × 400 (affinage) | 9 200 |
| Attaque (total) | 23 positions × 9 200 | environ 211 600 |

**Durée.** Environ 50 secondes sur ma machine (Macbook Pro Intel 2019) une fois les paramètres réglés.

**Fiabilité.** Avec la version vulnérable, j'ai obtenu 3 reconstructions correctes d'affilée lors des derniers tests. Ce n'est pas garanti à 100 %. Le bruit du processeur peut fausser un caractère. La médiane des temps est plus fiable que la moyenne. L'attaque en deux phases (tri rapide puis affinage des 5 meilleurs candidats) a nettement stabilisé les résultats.

**Corrélation observée.** Le tableau de corrélation montre bien une montée des temps quand la longueur du préfixe correct augmente. C'est le signe direct de la fuite.

### Correction : comparaison en temps constant

**Implémentation.** Le fichier `src/comparateurMotDePasseSecurise.js` utilise `crypto.timingSafeEqual` de Node.js. La comparaison parcourt les octets en temps constant, quelle que soit la position de la première différence.

```javascript
const crypto = require('crypto');

function comparerMotDePasseSecurise(motDePasseSaisi, motDePasseAttendu) {
  const bufferSaisi = Buffer.from(motDePasseSaisi, 'utf8');
  const bufferAttendu = Buffer.from(motDePasseAttendu, 'utf8');

  if (bufferSaisi.length !== bufferAttendu.length) {
    crypto.timingSafeEqual(bufferAttendu, bufferAttendu);
    return false;
  }

  return crypto.timingSafeEqual(bufferSaisi, bufferAttendu);
}
```

Si les longueurs diffèrent, une comparaison factice sur le buffer attendu évite de retourner `false` immédiatement sans travail constant.

**Pourquoi c'est efficace.** `timingSafeEqual` ne court-circuite pas la comparaison au premier octet différent. Le temps d'exécution ne dépend plus du nombre de caractères corrects en préfixe. L'attaquant ne peut plus déduire le secret à partir des durées mesurées.

**Vérification.** En lançant `npm run analyse-securise`, l'attaque échoue : les temps ne corrèlent plus avec le préfixe et le mot de passe reconstruit est incorrect. La correction supprime la fuite exploitée par l'analyseur.

**Limites.** En production, on ne compare pas des mots de passe en clair. On stocke un hash (bcrypt, argon2) et on applique aussi un rate limiting. `timingSafeEqual` protège la comparaison binaire, pas l'ensemble du système.

### Autres fonctions sécurisées

| Environnement | Fonction |
|---------------|----------|
| Node.js | `crypto.timingSafeEqual(bufferA, bufferB)` |
| libsodium | `sodium_memcmp(a, b)` |
| OpenSSL | `CRYPTO_memcmp(a, b, len)` |

> La vulnérabilité du comparateur naïf est volontaire et pédagogique. Ne pas utiliser en production.

## Retour d'expérience

### Comment le programme a été construit

J'ai commencé par un comparateur naïf et un point d'entrée CLI simple. Ensuite j'ai découpé le travail en petits modules : mesure du temps, statistiques, affichage, puis l'analyseur qui orchestre le tout. L'idée était de garder le comparateur vulnérable intact et de ne l'appeler que via une fonction boîte noire, une interface où je fournis un candidat et j'observe seulement le résultat (et sa durée), sans voir le mot de passe attendu, comme le ferait un vrai attaquant.

### Tests effectués

Les tests manuels ont porté sur deux choses. D'abord la vérification classique (`npm start -- motdepasse`) avec contrôle du code de retour. Ensuite l'analyse complète (`npm run analyse`) en regardant si le tableau de corrélation montre bien des temps qui montent avec la longueur du préfixe correct, et si le mot de passe est reconstruit jusqu'au bout.

J'ai aussi lancé l'attaque seule plusieurs fois de suite pour vérifier que le résultat tenait la route, pas seulement une fois par hasard.

### Problèmes rencontrés

Le premier blocage, c'est que sans rien changer au comparateur, l'attaque ne marchait tout simplement pas. Sur un CPU récent, la boucle est trop rapide. Le bruit de mesure noyait complètement le signal. Je voyais parfois le bon caractère en tête, parfois un autre, et l'attaque partait dans tous les sens.

Avec un délai trop élevé par caractère (50 µs) et trop de répétitions, un test a tourné plus de dix minutes avant d'être arrêté, ce qui est bien trop lent.

La moyenne des temps était peu fiable. La médiane donnait des résultats plus stables. Et sur le dernier caractère, le temps ne change presque plus : un candidat faux peut avoir la même durée qu'un bon. Il a fallu un critère de secours via la vérification elle-même quand un candidat est accepté.

Un bug bête : `jeuCaracteres.map` sur une chaîne JavaScript. Les chaînes n'ont pas de `.map()`. Corrigé avec `[...jeuCaracteres]`.

### Ce qui a fait la différence

Le délai simulé avant chaque comparaison (`DELAI_PAR_CARACTERE_NS`). Ce n'est pas une correction de la vulnérabilité, c'est ce qui rend la fuite visible en test concret. Sans ça, le principe reste vrai sur le papier mais difficile à montrer sur une machine moderne.

L'attaque en deux phases aussi. Je mesure vite tous les candidats, je garde les cinq plus lents, et j'affine seulement ceux-là. Ça divise le temps d'exécution et ça limite les erreurs de bruit.

### Améliorations possibles

Les résultats restent sensibles à la charge du processeur. Sur une machine occupée, l'attaque peut encore se tromper. Je pourrais augmenter les répétitions, ou écarter les valeurs extrêmes avant de calculer la médiane.

Le jeu de caractères est large. C'est réaliste pour une attaque sans connaissance préalable, mais ça coûte cher en temps. Un paramètre pour restreindre le charset en démo serait pratique.

### Bilan

Au final, l'analyse tourne en environ 50 secondes et reconstruit le mot de passe caractère par caractère de façon reproductible (3 exécutions consécutives réussies lors des derniers tests). Le mode vérification n'a pas bougé. Et la corrélation préfixe/temps s'affiche clairement dans la console, ce qui était l'objectif pédagogique.
