#!/usr/bin/env node

const { comparerMotDePasse } = require('./comparateurMotDePasse');
const {
  MDP_ATTENDU,
  CODE_RETOUR_SUCCES,
  CODE_RETOUR_ECHEC,
  MESSAGE_SUCCES,
  MESSAGE_ECHEC,
} = require('./constantes');

/* ====== Programme principal ======= */

const resultat = executerProgramme();

if (resultat.message !== '') {
  console.log(resultat.message);
}

process.exit(resultat.codeRetour);

/* ====== Définition des fonctions ======= */

/**
 * Affiche le message d'aide sur la sortie d'erreur standard.
 * @returns {void}
 */
function afficherAide() {
  console.error('Aide : node src/programmePrincipal.js <mot-de-passe>');
}

/**
 * Extrait le mot de passe passé en argument de ligne de commande.
 * @param {string[]} arguments Arguments du processus (process.argv).
 * @returns {string|null} Le mot de passe saisi, ou null si l'argument est absent.
 */
function extraireMotDePasseDesArguments(arguments) {
  const motDePasseSaisi = arguments[2];

  if (motDePasseSaisi === undefined || motDePasseSaisi === '') {
    return null;
  }

  return motDePasseSaisi;
}

/**
 * Gère la vérification du mot de passe et renvoie le résultat.
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
