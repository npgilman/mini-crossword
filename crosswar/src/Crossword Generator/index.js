
import { createClueMapping, getWords, getClues, printGrid, printClues, generateCrossword, fisherYatesShuffle} from "./generator.js";

async function main_func() {
    try {
        // Create map <words, clues> from NYT dataset
        const wordsAndClues = await createClueMapping();

        // Get words (keys) from the map
        const words = Array.from(wordsAndClues.keys());

        // Randomize array in-place with Fisher-Yates algo
        fisherYatesShuffle(words);

        // Create 5x5 grid initialized with '-'
        const grid = Array.from({ length: 5 }, () => Array(5).fill('-'));

        // Create map to store validity of partially built words
        const beginnings = new Map();

        // Set empty word and all words in dataset to true
        beginnings.set("-----", true);
        words.forEach((word) => beginnings.set(word, true));
        
        // Generate crossword in-place in grid, based on words from shuffled dataset
        generateCrossword(grid, words, beginnings);

        // Retrieve and print answers, clues
        let answers = getWords(grid);
        let clues = getClues(answers, wordsAndClues);
        printGrid(grid);
        printClues(clues);
        
        console.log();

    } catch (error) {
        console.error("Error while generating clues:", error);
    }
}

main_func()