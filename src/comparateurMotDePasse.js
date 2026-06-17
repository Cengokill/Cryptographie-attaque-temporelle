const { DELAI_PAR_CARACTERE_NS } = require('./constantes');

/**
 * Boucle jusqu'à ce que le délai soit écoulé.
 * @param {bigint} dureeNanosecondes Combien de ns attendre.
 * @returns {void}
 */
function attendre(dureeNanosecondes) {
  const debut = process.hrtime.bigint();

  while (process.hrtime.bigint() - debut < dureeNanosecondes) {
    // Boucle active : le délai devient mesurable.
  }
}

/**
 * Compare deux mots de passe caractère par caractère.
 * Un délai avant chaque comparaison rend la fuite temporelle visible. La logique reste naïve.
 * @param {string} motDePasseSaisi Ce que l'utilisateur a saisi.
 * @param {string} motDePasseAttendu Ce qu'on attend.
 * @returns {boolean} true si les deux correspondent.
 */
function comparerMotDePasse(motDePasseSaisi, motDePasseAttendu) {
  for (let i = 0; i < motDePasseAttendu.length; i++) {
    attendre(DELAI_PAR_CARACTERE_NS);

    if (motDePasseSaisi[i] !== motDePasseAttendu[i]) {
      // console.log('faux des le char', i);
      return false;
    }
  }

  return motDePasseSaisi.length === motDePasseAttendu.length;
}

module.exports = {
  comparerMotDePasse,
};
