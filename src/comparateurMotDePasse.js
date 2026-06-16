/**
 * Compare 2 mots de passe caractère par caractère.
 * @param {string} motDePasseSaisi Mdp fourni par l'utilisateur.
 * @param {string} motDePasseAttendu Mdp de référence attendu.
 * @returns {boolean} Indique si le mdp saisi correspond au mdp attendu.
 */
function comparerMotDePasse(motDePasseSaisi, motDePasseAttendu) {
  for (let i = 0; i < motDePasseAttendu.length; i++) {
    if (motDePasseSaisi[i] !== motDePasseAttendu[i]) {
      return false;
    }
  }

  // Ici tous les caractères sont corrects, mais il peut y avoir
  // des caractères supplémentaires qui n'ont pas été comparés.
  // On vérifie donc la longueur des mdp.
  return motDePasseSaisi.length === motDePasseAttendu.length;
}

module.exports = {
  comparerMotDePasse,
};
