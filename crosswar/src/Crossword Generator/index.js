
import { createClueMapping, getWords, getClues, printGrid, printClues, generateCrossword} from "./generator.js";

async function main_func() {
    try {
        // CREATE CLUE MAP CURRENTLY NOT WORKING. 
        // PARSING BUT NOT STORING DATA
        // ASSUME IT WORKS AND COME BACK TO FIX
        let wordsAndClues = await createClueMapping();
        let words = Array.from(wordsAndClues.keys());
        console.log(words.length)

        // temporary shuffling method
        let shuffled = words.sort((a, b) => 0.5 - Math.random());

        let grid = []
        for (let i = 0; i < 5; i++) { grid.push("-----"); }
        
        generateCrossword(grid, shuffled, 0, 0);

        let answers = getWords(grid);
        let clues = getClues(answers, wordsAndClues);

        printGrid(grid);
        printClues(clues);
        console.log(wordsAndClues.get("VELMA"));

    } catch (error) {
        console.error("Error while generating clues:", error);
    }
}

main_func()