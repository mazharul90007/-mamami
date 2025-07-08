"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOppositeMoods = exports.MOOD_OPPOSITES = exports.generateRandomMoods = exports.MOODS = void 0;
exports.MOODS = [
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
];
const generateRandomMoods = (count = 3) => {
    const shuffled = [...exports.MOODS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
exports.generateRandomMoods = generateRandomMoods;
// Define mood opposites for matching
exports.MOOD_OPPOSITES = {
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
const getOppositeMoods = (moods) => {
    const opposites = moods.flatMap(mood => exports.MOOD_OPPOSITES[mood] || []);
    return [...new Set(opposites)]; // Remove duplicates
};
exports.getOppositeMoods = getOppositeMoods;
