const crypto = require('crypto');

/**
 * Compare deux mots de passe en temps constant via crypto.timingSafeEqual.
 * Si les longueurs diffèrent, une comparaison factice évite une sortie immédiate.
 * @param {string} motDePasseSaisi Ce que l'utilisateur a saisi.
 * @param {string} motDePasseAttendu Ce qu'on attend.
 * @returns {boolean} true si les deux correspondent.
 */
function comparerMotDePasseSecurise(motDePasseSaisi, motDePasseAttendu) {
  const bufferSaisi = Buffer.from(motDePasseSaisi, 'utf8');
  const bufferAttendu = Buffer.from(motDePasseAttendu, 'utf8');

  if (bufferSaisi.length !== bufferAttendu.length) {
    crypto.timingSafeEqual(bufferAttendu, bufferAttendu);
    return false;
  }

  return crypto.timingSafeEqual(bufferSaisi, bufferAttendu);
}

module.exports = {
  comparerMotDePasseSecurise,
};
