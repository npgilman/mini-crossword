
import { createClueMapping, getWords, getClues, printGrid, printClues, generateCrossword} from "./generator.js";

async function main_func() {
    try {
        // create map <words, clues> from NYT dataset
        let wordsAndClues = await createClueMapping();
        // get words (keys) from the map
        let words = Array.from(wordsAndClues.keys());
        console.log(words.length + " words in dataset");

        // temporary shuffling method
        let shuffled = words.sort((a, b) => 0.5 - Math.random());
        console.log("Clues shuffled");

        // grid is a 2D Array of characters
        let grid = [];
        for (let i = 0; i < 5; i++) { 
            grid.push(['-', '-', '-', '-', '-']); 
        }
        
        generateCrossword(grid, words, 0, 0);

        let answers = getWords(grid);
        let clues = getClues(answers, wordsAndClues);

        printGrid(grid);
        printClues(clues);

    } catch (error) {
        console.error("Error while generating clues:", error);
    }
}

main_func()