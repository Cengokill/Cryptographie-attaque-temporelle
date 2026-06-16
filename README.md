# Comparateur de mot de passe (CLI Node.js)

Programme en ligne de commande qui compare un mdp saisi à une valeur codée en dur, avec une comparaison vulnérable aux attaques temporelles.


## Arborescence du projet

```text
Cryptographie-juin-2026/
├── src/
│   ├── constantes.js
│   ├── comparateurMotDePasse.js
│   └── programmePrincipal.js
├── package.json
└── README.md
```

## Architecture

| Module | Responsabilité |
|--------|----------------|
| `src/constantes.js` | Mot de passe attendu, codes de retour et messages |
| `src/comparateurMotDePasse.js` | Comparaison caractère par caractère (algorithme vulnérable) |
| `src/programmePrincipal.js` | Point d'entrée CLI, orchestration et codes de sortie |

Le programme principal délègue la comparaison au module dédié et lit la configuration dans `constantes.js`, ce qui sépare clairement les responsabilités.

## Mot de passe de référence

Le mot de passe attendu est : `ADZNAuzoef!é87"èBsgvAmX` (on utilise tout de même un mot de passe difficile)

## Exécution

```bash
# Exécution directe
node src/programmePrincipal.js '<mot-de-passe>'

# Via npm
npm start -- '<mot-de-passe>'
```

## Exemples d'utilisation

### Mot de passe valide

```bash
node src/programmePrincipal.js ADZNAuzoef!é87"èBsgvAmX
```

Sortie :

```text
Mot de passe correct.
```

Code de retour : `0`

```bash
node src/programmePrincipal.js 'ADZNAuzoef!é87"èBsgvAmX'; echo "Code: $?"
# Code: 0
```

### Mot de passe invalide

```bash
node src/programmePrincipal.js mauvais
```

Sortie :

```text
Mot de passe incorrect.
```

Code de retour : `1`

```bash
node src/programmePrincipal.js mauvais; echo "Code: $?"
# Code: 1
```

### Argument manquant

```bash
node src/programmePrincipal.js
```

Sortie (stderr) :

```text
Aide : node src/programmePrincipal.js <mot-de-passe>
```

Code de retour : `1`
