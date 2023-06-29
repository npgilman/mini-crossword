
import { createClueMapping, getWords, getClues, printGrid } from "./generator.js";

function main_func()
{
    // CREATE CLUE MAP CURRENTLY NOT WORKING. 
    // PARSING BUT NOT STORING DATA
    // ASSUME IT WORKS AND COME BACK TO FIX
    let wordsAndClues = createClueMapping();
    let words = wordsAndClues.keys();

    // temporary shuffling method
    let shuffled = words.sort((a, b) => 0.5 - Math.random());

    let grid = []
    for (let i = 0; i < 5; i++) { grid.push("-----"); }
    // TODO: FINISH BELOW FUNCTION
    // generate_crossword(grid, shuffled);

    let answers = getWords(grid);
    let clues = getClues(answers, wordsAndClues);

    printGrid(grid);
    printClues(clues);
}

main_func()