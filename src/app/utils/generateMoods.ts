export const MOODS = [
  'HAPPY',
  'SAD',
  'CALM',
  'BORED',
  'ROMANTIC',
  'FRUSTRATED',
  'STRESSED',
  'GRATEFUL',
  'FLIRTY',
  'ANGRY',
] as const;

export type Mood = (typeof MOODS)[number];

export const generateRandomMoods = (count: number = 3): Mood[] => {
  const shuffled = [...MOODS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Define mood opposites for matching
export const MOOD_OPPOSITES: Record<Mood, Mood[]> = {
  HAPPY: ['SAD', 'STRESSED', 'ANGRY'],
  SAD: ['HAPPY', 'GRATEFUL', 'CALM'],
  CALM: ['STRESSED', 'FRUSTRATED', 'ANGRY'],
  BORED: ['ROMANTIC', 'FLIRTY', 'HAPPY'],
  ROMANTIC: ['BORED', 'FRUSTRATED', 'ANGRY'],
  FRUSTRATED: ['CALM', 'HAPPY', 'GRATEFUL'],
  STRESSED: ['CALM', 'HAPPY', 'GRATEFUL'],
  GRATEFUL: ['SAD', 'ANGRY', 'FRUSTRATED'],
  FLIRTY: ['BORED', 'SAD', 'STRESSED'],
  ANGRY: ['HAPPY', 'CALM', 'GRATEFUL'],
};

// Get opposite moods for given moods
export const getOppositeMoods = (moods: Mood[]): Mood[] => {
  const opposites = moods.flatMap(mood => MOOD_OPPOSITES[mood] || []);
  return [...new Set(opposites)]; // Remove duplicates
};
