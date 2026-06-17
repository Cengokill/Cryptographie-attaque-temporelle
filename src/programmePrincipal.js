#!/usr/bin/env node

const { comparerMotDePasse } = require('./comparateurMotDePasse');
const { comparerMotDePasseSecurise } = require('./comparateurMotDePasseSecurise');
const { executerAnalyseTemporelle } = require('./analyseurTemporel');
const {
  MDP_ATTENDU,
  CODE_RETOUR_SUCCES,
  CODE_RETOUR_ECHEC,
  MESSAGE_SUCCES,
  MESSAGE_ECHEC,
  NOMBRE_REPETITIONS_CORRELATION,
  NOMBRE_REPETITIONS_ATTAQUE,
  JEU_CARACTERES_ATTAQUE,
} = require('./constantes');

// Programme principal

const modeAnalyse = process.argv.includes('--analyse');
const modeAnalyseSecurise = process.argv.includes('--analyse-securise');

if (modeAnalyse || modeAnalyseSecurise) {
  executerModeAnalyse(modeAnalyseSecurise);
} else {
  const resultat = executerProgramme();

  if (resultat.message !== '') {
    console.log(resultat.message);
  }

  process.exit(resultat.codeRetour);
}

// Fonctions

/**
 * Enveloppe le comparateur dans une fonction boîte noire.
 * @param {boolean} utiliserVersionSecurisee Indique si la comparaison en temps constant est utilisée.
 * @returns {(motDePasseSaisi: string) => boolean} Vérifie un mdp sans exposer la référence.
 */
function creerFonctionVerification(utiliserVersionSecurisee = false) {
  const comparateur = utiliserVersionSecurisee
    ? comparerMotDePasseSecurise
    : comparerMotDePasse;

  return (motDePasseSaisi) => comparateur(motDePasseSaisi, MDP_ATTENDU);
}

/**
 * Lance l'analyse temporelle, puis quitte.
 * @param {boolean} utiliserVersionSecurisee Indique si la version corrigée est testée.
 * @returns {void}
 */
function executerModeAnalyse(utiliserVersionSecurisee = false) {
  const fonctionVerification = creerFonctionVerification(utiliserVersionSecurisee);
  const longueurMaximale = MDP_ATTENDU.length;

  if (utiliserVersionSecurisee) {
    console.log('=== Mode corrigé : comparaison en temps constant (crypto.timingSafeEqual) ===\n');
  }

  executerAnalyseTemporelle(fonctionVerification, MDP_ATTENDU, {
    nombreRepetitionsCorrelation: NOMBRE_REPETITIONS_CORRELATION,
    nombreRepetitionsAttaque: NOMBRE_REPETITIONS_ATTAQUE,
    jeuCaracteres: JEU_CARACTERES_ATTAQUE,
    longueurMaximale,
  });

  process.exit(CODE_RETOUR_SUCCES);
}

/**
 * Affiche l'aide sur stderr.
 * @returns {void}
 */
function afficherAide() {
  console.error('Aide : node src/programmePrincipal.js <mot-de-passe>');
  console.error('       node src/programmePrincipal.js --analyse');
  console.error('       node src/programmePrincipal.js --analyse-securise');
}

/**
 * Récupère le mdp passé en argument.
 * @param {string[]} arguments process.argv.
 * @returns {string|null} Le mdp, ou null s'il manque.
 */
function extraireMotDePasseDesArguments(arguments) {
  const motDePasseSaisi = arguments[2];

  if (motDePasseSaisi === undefined || motDePasseSaisi === '' || motDePasseSaisi.startsWith('--')) {
    return null;
  }

  return motDePasseSaisi;
}

/**
 * Vérifie le mdp et renvoie message + code de sortie.
 * @returns {{ estValide: boolean, message: string, codeRetour: number }}
 */
function executerProgramme() {
  const motDePasseSaisi = extraireMotDePasseDesArguments(process.argv);

  if (motDePasseSaisi === null) {
    afficherAide();
    return {
      estValide: false,
      message: '',
      codeRetour: CODE_RETOUR_ECHEC,
    };
  }

  const estValide = comparerMotDePasse(motDePasseSaisi, MDP_ATTENDU);

  // console.log('comparaison fini ->', estValide);

  if (estValide) {
    return {
      estValide: true,
      message: MESSAGE_SUCCES,
      codeRetour: CODE_RETOUR_SUCCES,
    };
  }

  return {
    estValide: false,
    message: MESSAGE_ECHEC,
    codeRetour: CODE_RETOUR_ECHEC,
  };
}
