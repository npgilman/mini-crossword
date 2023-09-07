
import { createClueMapping, getWords, getClues, printGrid, printClues, generateCrossword, fisherYatesShuffle} from "./generator.js";

async function main_func() {
    try {
        // create map <words, clues> from NYT dataset
        let wordsAndClues = await createClueMapping();

        // get words (keys) from the map
        let words = Array.from(wordsAndClues.keys());
        // console.log("Words in dataset: " + words.length);

        // randomize array in-place with Fisher-Yates algo
        fisherYatesShuffle(words);

        // grid is a 2D Array of characters
        let grid = [];
        for (let i = 0; i < 5; i++) { 
            grid.push(['-', '-', '-', '-', '-']); 
        }

        // map to store the feasibility of partially built words
        const beginnings = new Map();
        // set empty word and all words in dataset to true
        beginnings.set("-----", true);
        for (let i = 0; i < words.length; i++) {
            beginnings.set(words[i], true);
        }
        
        // generate crossword in-place in grid, based on words from shuffled dataset
        generateCrossword(grid, words, beginnings);

        // retrieve & print answers and clues
        let answers = getWords(grid);
        let clues = getClues(answers, wordsAndClues);
        printGrid(grid);
        //printClues(clues);
        
        console.log();

    } catch (error) {
        console.error("Error while generating clues:", error);
    }
}

main_func()