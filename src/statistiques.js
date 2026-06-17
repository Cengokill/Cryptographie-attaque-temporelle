/**
 * Médiane d'un tableau de nombres.
 * @param {number[]} valeurs Mesures brutes (triées en interne).
 * @returns {number}
 */
function calculerMediane(valeurs) {
  const valeursTriees = [...valeurs].sort((a, b) => a - b);
  const milieu = Math.floor(valeursTriees.length / 2);

  if (valeursTriees.length % 2 === 0) {
    return (valeursTriees[milieu - 1] + valeursTriees[milieu]) / 2;
  }

  return valeursTriees[milieu];
}

/**
 * Écart-type d'un tableau de nombres.
 * @param {number[]} valeurs Mesures brutes.
 * @param {number} moyenne Déjà calculée.
 * @returns {number}
 */
function calculerEcartType(valeurs, moyenne) {
  if (valeurs.length === 0) {
    return 0;
  }

  const sommeDesEcartsCarres = valeurs.reduce(
    (accumulateur, valeur) => accumulateur + (valeur - moyenne) ** 2,
    0,
  );

  return Math.sqrt(sommeDesEcartsCarres / valeurs.length);
}

/**
 * Min, max, moyenne, médiane et écart-type sur un lot de mesures.
 * @param {number[]} mesures Durées en ms.
 * @returns {{ minimum: number, maximum: number, moyenne: number, mediane: number, ecartType: number }}
 */
function calculerStatistiques(mesures) {
  if (mesures.length === 0) {
    return {
      minimum: 0,
      maximum: 0,
      moyenne: 0,
      mediane: 0,
      ecartType: 0,
    };
  }

  const minimum = Math.min(...mesures);
  const maximum = Math.max(...mesures);
  const moyenne = mesures.reduce((accumulateur, mesure) => accumulateur + mesure, 0) / mesures.length;
  const mediane = calculerMediane(mesures);
  const ecartType = calculerEcartType(mesures, moyenne);

  // console.log('median', mediane, 'ecart', ecartType);

  return {
    minimum,
    maximum,
    moyenne,
    mediane,
    ecartType,
  };
}

module.exports = {
  calculerStatistiques,
};
