/**
 * Chronomètre un appel de fonction, en millisecondes.
 * @param {(...args: unknown[]) => unknown} fonction Ce qu'on mesure.
 * @param {...unknown} argumentsFonction Arguments de l'appel.
 * @returns {number} Durée en ms.
 */
function mesurerTempsExecution(fonction, ...argumentsFonction) {
  const debut = process.hrtime.bigint();
  fonction(...argumentsFonction);
  const fin = process.hrtime.bigint();

  return Number(fin - debut) / 1_000_000;
}

/**
 * Appelle la fonction plusieurs fois avant de mesurer.
 * Le premier passage est souvent plus lent (compilation JIT, caches V8) : ces appels
 * ne sont pas chronométrés, pour que les mesures suivantes reflètent le coût réel.
 * @param {(...args: unknown[]) => unknown} fonction Fonction à chauffer.
 * @param {number} nombreEchauffements Combien d'appels.
 * @param {...unknown} argumentsFonction Arguments de l'appel.
 * @returns {void}
 */
function effectuerEchauffement(fonction, nombreEchauffements, ...argumentsFonction) {
  for (let i = 0; i < nombreEchauffements; i++) {
    fonction(...argumentsFonction);
  }
  // console.log('echauffment ok');
}

/**
 * Répète la mesure plusieurs fois et renvoie toutes les durées.
 * @param {(...args: unknown[]) => unknown} fonction Ce qu'on mesure.
 * @param {number} nombreRepetitions Combien de mesures.
 * @param {...unknown} argumentsFonction Arguments de l'appel.
 * @returns {number[]} Durées en ms.
 */
function mesurerTempsExecutionRepetee(fonction, nombreRepetitions, ...argumentsFonction) {
  effectuerEchauffement(fonction, 20, ...argumentsFonction);

  const mesures = [];

  for (let i = 0; i < nombreRepetitions; i++) {
    mesures.push(mesurerTempsExecution(fonction, ...argumentsFonction));
  }

  // console.log(mesures.length, 'mesures recup');
  return mesures;
}

module.exports = {
  mesurerTempsExecution,
  mesurerTempsExecutionRepetee,
  effectuerEchauffement,
};
