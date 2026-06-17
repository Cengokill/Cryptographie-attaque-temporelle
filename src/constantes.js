/**
 * Mdp attendu, codé en dur.
 * @type {string}
 */
const MDP_ATTENDU = 'ADZNAuzoef!é87"èBsgvAmX';

/**
 * Code de sortie quand le mdp est bon.
 * @type {number}
 */
const CODE_RETOUR_SUCCES = 0;

/**
 * Code de sortie quand le mdp est faux.
 * @type {number}
 */
const CODE_RETOUR_ECHEC = 1;

/**
 * Message si le mdp est bon.
 * @type {string}
 */
const MESSAGE_SUCCES = 'mdp correct !';

/**
 * Message si le mdp est faux.
 * @type {string}
 */
const MESSAGE_ECHEC = 'mdp incorrect !';

/**
 * Mesures par candidat pendant la corrélation.
 * @type {number}
 */
const NOMBRE_REPETITIONS_CORRELATION = 300;

/**
 * Mesures par candidat pendant l'attaque (phase détaillée).
 * @type {number}
 */
const NOMBRE_REPETITIONS_ATTAQUE = 400;

/**
 * Mesures par candidat en phase rapide (tri initial).
 * @type {number}
 */
const NOMBRE_REPETITIONS_PHASE_RAPIDE = 80;

/**
 * Combien de candidats les plus lents on repasse en détail.
 * @type {number}
 */
const NOMBRE_CANDIDATS_A_AFFINER = 5;

/**
 * Caractères essayés pendant l'attaque.
 * @type {string}
 */
const JEU_CARACTERES_ATTAQUE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!éè"@#$%&*()_+-=[]{}|;:,.<>?';

/**
 * Pause avant chaque comparaison de caractère, en nanosecondes.
 * Rend la fuite temporelle visible en labo — comme sur un système lent ou distant.
 * @type {bigint}
 */
const DELAI_PAR_CARACTERE_NS = 15_000n;

module.exports = {
  MDP_ATTENDU,
  CODE_RETOUR_SUCCES,
  CODE_RETOUR_ECHEC,
  MESSAGE_SUCCES,
  MESSAGE_ECHEC,
  NOMBRE_REPETITIONS_CORRELATION,
  NOMBRE_REPETITIONS_ATTAQUE,
  NOMBRE_REPETITIONS_PHASE_RAPIDE,
  NOMBRE_CANDIDATS_A_AFFINER,
  JEU_CARACTERES_ATTAQUE,
  DELAI_PAR_CARACTERE_NS,
};
