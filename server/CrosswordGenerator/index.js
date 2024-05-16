
//import { createClueMapping, getWords, getClues, printGrid, printClues, generateCrossword, fisherYatesShuffle} from "./generator.js";
const createClueMapping = require("./generator.js").createClueMapping;
const getWords = require("./generator.js").getWords;
const getClues = require("./generator.js").getClues;
const printGrid = require("./generator.js").printGrid;
const printClues = require("./generator.js").printClues;
const generateCrossword = require("./generator.js").generateCrossword;
const fisherYatesShuffle = require("./generator.js").fisherYatesShuffle;

module.exports = async function main_func() {
    console.log("Start crossword generation!");
    //try {
        // create map <words, clues> from NYT dataset
        let wordsAndClues = await createClueMapping();
        console.log("CROSSWORD GEN: Clue map done");
        //console.log(wordsAndClues);

        // get words (keys) from the map
        let words = Array.from(wordsAndClues.keys());
        // console.log("Words in dataset: " + words.length);
        console.log("CROSSWORD GEN: Got " + words.length + "words.");

        // randomize array in-place with Fisher-Yates algo
        fisherYatesShuffle(words);
        console.log("CROSSWORD GEN: Shuffled");

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
        //printGrid(grid);
        //printClues(clues);

        let data = [grid, clues];
        return data;
        
        //console.log();

    //} catch (error) {
        console.error("Error while generating clues:", error);
    //}
}

//main_func()

