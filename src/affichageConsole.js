/**
 * Affiche une durée en ms pour la console.
 */
function formaterDuree(dureeMs) {
  return `${dureeMs.toFixed(6)} ms`;
}

/**
 * Affiche min, max, moyenne, médiane et écart-type.
 * @param {{ minimum: number, maximum: number, moyenne: number, mediane: number, ecartType: number }} statistiques Stats déjà calculées.
 * @returns {void}
 */
function afficherStatistiques(statistiques) {
  console.log(`Minimum   : ${formaterDuree(statistiques.minimum)}`);
  console.log(`Maximum   : ${formaterDuree(statistiques.maximum)}`);
  console.log(`Moyenne   : ${formaterDuree(statistiques.moyenne)}`);
  console.log(`Médiane   : ${formaterDuree(statistiques.mediane)}`);
  console.log(`Écart-type: ${formaterDuree(statistiques.ecartType)}`);
}

/**
 * Affiche le tableau préfixe / temps pour la corrélation.
 */
function afficherResultatsCorrelation(resultatsCorrelation) {
  console.log('\n=== Corrélation préfixe correct / temps d\'exécution ===\n');
  console.log(
    'Préfixe | Longueur | Moyenne (ms)  | Médiane (ms)  | Écart-type (ms)',
  );
  console.log('-------|----------|---------------|---------------|----------------');

  for (const resultat of resultatsCorrelation) {
    const prefixeAffiche = resultat.motDePasseTest === ''
      ? '(vide)'
      : JSON.stringify(resultat.motDePasseTest);

    console.log(
      `${prefixeAffiche.padEnd(7)}| ${String(resultat.longueurPrefixeCorrect).padStart(8)} | `
      + `${resultat.statistiques.moyenne.toFixed(6).padStart(13)} | `
      + `${resultat.statistiques.mediane.toFixed(6).padStart(13)} | `
      + `${resultat.statistiques.ecartType.toFixed(6).padStart(14)}`,
    );
  }
}

/**
 * Affiche chaque étape de la reconstruction, caractère par caractère.
 */
function afficherProgressionAttaque(etapesAttaque) {
  console.log('\n=== Reconstruction caractère par caractère (attaque temporelle) ===\n');

  for (const etape of etapesAttaque) {
    console.log(
      `Position ${etape.position + 1} : caractère '${etape.caractereRetrouve}' `
      + `(préfixe : ${JSON.stringify(etape.prefixeCourant)}) `
      + `- médiane : ${formaterDuree(etape.statistiques.mediane)}`,
    );
  }
}

/**
 * Affiche le mot de passe reconstruit et si la vérification finale passe.
 * @param {string} motDePasseRetrouve Ce que l'attaque a trouvé.
 * @param {boolean} estComplet true si la vérification finale accepte le résultat.
 * @returns {void}
 */
function afficherMotDePasseRetrouve(motDePasseRetrouve, estComplet) {
  console.log('\n=== Résultat de l\'attaque temporelle ===\n');
  console.log(`Mot de passe reconstruit : ${JSON.stringify(motDePasseRetrouve)}`);

  if (estComplet) {
    console.log('Vérification finale : le mot de passe reconstruit est accepté.');
  } else {
    console.log('Vérification finale : reconstruction incomplète ou incorrecte.');
  }
}

module.exports = {
  afficherStatistiques,
  afficherResultatsCorrelation,
  afficherProgressionAttaque,
  afficherMotDePasseRetrouve,
};
