/**
 * mdp de référence codé en dur pour la vérification.
 * @type {string}
 */
const MDP_ATTENDU = 'ADZNAuzoef!é87"èBsgvAmX';

// Ajout de constantes pour de meilleures pratiques.

/**
 * Code de retour du processus lorsque le mdp est correct.
 * @type {number}
 */
const CODE_RETOUR_SUCCES = 0;

/**
 * Code de retour du processus lorsque le mdp est incorrect.
 * @type {number}
 */
const CODE_RETOUR_ECHEC = 1;

/**
 * Message affiché lorsque le mdp est correct.
 * @type {string}
 */
const MESSAGE_SUCCES = 'mdp correct !';

/**
 * Message affiché lorsque le mdp est incorrect.
 * @type {string}
 */
const MESSAGE_ECHEC = 'mdp incorrect !';

module.exports = {
  MDP_ATTENDU,
  CODE_RETOUR_SUCCES,
  CODE_RETOUR_ECHEC,
  MESSAGE_SUCCES,
  MESSAGE_ECHEC,
};
