/**
 * Deterministic pre-intent check to catch obvious emergency or out-of-scope queries.
 * @param query The user's input
 * @param language The requested language (en, es, fr)
 */
// Keep list small and specific to avoid false positives
const EMERGENCY_KEYWORDS = [
  'emergency', 'fire', 'heart attack', 'medical advice', 'lawsuit', // EN
  'emergencia', 'fuego', 'incendio', 'infarto', 'ataque al corazón', 'demanda', // ES
  'urgence', 'feu', 'incendie', 'crise cardiaque', 'conseil médical', 'poursuite' // FR
];

export const checkSafety = (query: string, language: string): { isSafe: boolean; declineMessage?: string } => {
  const q = query.toLowerCase();

  for (const keyword of EMERGENCY_KEYWORDS) {
    if (q.includes(keyword)) {
      let declineMessage = 'For emergencies, medical, or legal issues, please contact stadium staff or security immediately.';
      if (language === 'es') {
        declineMessage = 'Para emergencias, problemas médicos o legales, comuníquese con el personal del estadio o la seguridad de inmediato.';
      } else if (language === 'fr') {
        declineMessage = 'Pour toute urgence, problème médical ou juridique, veuillez contacter le personnel du stade ou la sécurité immédiatement.';
      }
      return { isSafe: false, declineMessage };
    }
  }

  return { isSafe: true };
};
