/**
 * File to contain the JS conversions of the parse.h and main.cpp file.
 * Currently a work in progress.
 * 
 * TODO: DOCUMENTATION
 * CHECKWORDBEGINNINGS
 * GENERATE_CROSSWORD
 */

/// Libraries for CSV Parsing
import { parse } from "csv-parse";
import * as fs from 'fs';


/**
 * 
 * @param {*} grid 5 words of length 5
 * @returns array of words found in rows and columns of grid
 */
function getWords(grid)
{
    if (grid.length != 5)
        throw new Error('Grid does not conform to expected size');

    let columns = [];
    for (let i = 0; i < 5; i++)
    {
        let col_word = '';
        grid.forEach((element) => col_word = col_word + element[i]);
        columns.push(col_word)
    }

    return grid.concat(columns);
}

/**
 * 
 * @param {*} wordsInGrid list of the words in grid
 * @param {*} wordsAndClues 
 * @returns 
 */
function getClues(wordsInGrid, wordsAndClues)
{
    let inorderClues = [];
    for (let i = 0; i < wordsInGrid.length; i++)
    {
        inorderClues.push(wordsAndClues[wordsInGrid[i]]);
    }
    return inorderClues;
}


/**
 * 
 * @returns 
 */
async function createClueMapping() {
    try {
        let clueMap = await clueMapPromise();

        return clueMap;
    } catch (error) {
        console.error("Error while generating clues:", error);
    }
}

function clueMapPromise() {
    return new Promise((resolve, reject) => {
        let clueMap = new Map();
    
        fs.createReadStream("uniqueFives.csv")
          .pipe(parse({ delimiter: ",", from_line: 2 }))
          .on("data", function (row) {
            clueMap.set(row[0], row[1]);
          })
          .on("error", function (error) {
            reject(error);
          })
          .on("end", function () {
            console.log("Clue CSV Parsed.");
            resolve(clueMap);
          });
    });
}

/**
 * 
 * @param {*} clues 
 */
function printClues(clues)
{
    for (let i = 0; i < clues.length; i++)
    {
        console.log(((i)%5+1) + ". " + ((i < 5) ? "Across" : "Down") + ": " + clues[i]);
    }
}

/**
 * 
 * @param {*} grid 
 */
function printGrid(grid)
{
    grid.forEach((element) => {
        for (let i = 0; i < element.length; i++)
        {
            process.stdout.write(element[i] + " ");
        }
        process.stdout.write("\n");
    });
}

/**
 *  TODO: COPY CJs DOCUMENTATION FROM ORIGINAL
 * @param {*} wordBeginnings 
 * @param {*} words 
 * @param {*} grid 
 * @returns 
 */
function checkWordBeginnings(wordBeginnings, words, grid)
{
    // should be an array
    let beginnings = getWords(grid);

    // Number of words in grid = number of columns + number of rows
    let numWords = grid.length + grid[0].length;
    
    for (let i = 0; i < numWords; i++)
    {
        if (wordBeginnings.has(beginnings[i]))
        {
            let beginningFound = false;
            // could refactor to words.forEach({lambda funct})
            // staying consistent with CJ original design for now
            for (let j = 0; j < words.length; j++)
            {
                // MAGIC CONSTANT 5 BECAUSE WORD LENGTH IS 5
                // REPLACE WITH words[j].length() OR SOMETHING EQUIVALENT
                for (let k = 0; k < words[j].length; k++)
                {
                    if (words[j][k] == beginnings[i][k])
                    {
                        if ((k == 4) || ((k+1 < 5) && beginnings[i][k+1] == '-'))
                        {
                            beginningFound = true;
                            break;
                        }
                    }
                }
            }
            wordBeginnings[beginnings[i]] = beginningFound;
        }
        if (!wordBeginnings[beginnings[i]]) {
            return false;
        }
    }
    return true;
}

function generateCrossword(grid, words) {
    // Initialize the beginnings map with a single entry
    const beginnings = new Map();
    beginnings.set("-----", true);

    let temp = "";
    for (let a = 0; a < words.length; a++) { // finding row 1
        grid[0] = words[a];

        if (!checkWordBeginnings(beginnings, words, grid)) {
            continue;
        }

        for (let b = 0; b < words.length; b++) { // finding col 1
            if (b === a)
                continue;

            // undo insertion if needed
            if (grid[1][0] !== '-') {
                grid[1] = '-' + grid[1].substring(1);
                grid[2] = '-' + grid[2].substring(1);
                grid[3] = '-' + grid[3].substring(1);
                grid[4] = '-' + grid[4].substring(1);
            }

            temp = words[b];
            if (temp[0] === grid[0][0]) {
                grid[1] = temp;
                if (!checkWordBeginnings(beginnings, words, grid)) {
                    continue;
                }

                for (let c = 0; c < words.length; c++) { // finding row 2
                    if (c === b || c === a)
                        continue;
                    // undo insertion if needed
                    if (grid[1][1] !== '-') {
                        grid[1] = grid[1].substring(0, 1) + '-' + grid[1].substring(2);
                        grid[2] = grid[2].substring(0, 1) + '-' + grid[2].substring(2);
                        grid[3] = grid[3].substring(0, 1) + '-' + grid[3].substring(2);
                        grid[4] = grid[4].substring(0, 1) + '-' + grid[4].substring(2);
                    }
                    temp = words[c];
                    if (temp[0] === grid[1][0]) {
                        grid[1] = temp;
                        if (!checkWordBeginnings(beginnings, words, grid)) {
                            continue;
                        }

                        for (let d = 0; d < words.length; d++) { // finding col 2
                            // undo insertion if needed
                            if (grid[2][1] !== '-') {
                                grid[2] = grid[2].substring(0, 1) + '-' + grid[2].substring(2);
                                grid[3] = grid[3].substring(0, 1) + '-' + grid[3].substring(2);
                                grid[4] = grid[4].substring(0, 1) + '-' + grid[4].substring(2);
                            }
                            temp = words[d];
                            if (temp[0] === grid[0][1] && temp[1] === grid[1][1]) {
                                grid[2] = temp;
                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                    continue;
                                }

                                for (let e = 0; e < words.length; e++) { // finding row 3
                                    // undo insertion if necessary
                                    if (grid[2][2] !== '-') {
                                        grid[2] = grid[2].substring(0, 2) + '-' + grid[2].substring(3);
                                        grid[3] = grid[3].substring(0, 2) + '-' + grid[3].substring(3);
                                        grid[4] = grid[4].substring(0, 2) + '-' + grid[4].substring(3);
                                    }
                                    temp = words[e];
                                    if (temp[0] === grid[2][0] && temp[1] === grid[2][1]) {
                                        grid[2] = temp;
                                        if (!checkWordBeginnings(beginnings, words, grid)) {
                                            continue;
                                        }

                                        for (let f = 0; f < words.length; f++) { // finding col 3
                                            // undo insertion if necessary
                                            if (grid[3][2] !== '-') {
                                                grid[3] = grid[3].substring(0, 2) + '-' + grid[3].substring(3);
                                                grid[4] = grid[4].substring(0, 2) + '-' + grid[4].substring(3);
                                            }
                                            temp = words[f];
                                            if (temp[0] === grid[0][2] && temp[1] === grid[1][2] && temp[2] === grid[2][2]) {
                                                grid[3] = temp;
                                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                                    continue;
                                                }

                                                for (let g = 0; g < words.length; g++) { // finding row 4
                                                    // undo insertion if necessary
                                                    if (grid[3][3] !== '-') {
                                                        grid[3] = grid[3].substring(0, 3) + '-' + grid[3].substring(4);
                                                        grid[4] = grid[4].substring(0, 3) + '-' + grid[4].substring(4);
                                                    }
                                                    temp = words[g];
                                                    if (temp[0] === grid[3][0] && temp[1] === grid[3][1] &&
                                                        temp[2] === grid[3][2]) {
                                                        grid[3] = temp;
                                                        if (!checkWordBeginnings(beginnings, words, grid)) {
                                                            continue;
                                                        }

                                                        for (let h = 0; h < words.length; h++) { // finding col 4
                                                            // undo insertion if necessary
                                                            if (grid[4][3] !== '-') {
                                                                grid[4] = grid[4].substring(0, 3) + '-';
                                                            }
                                                            temp = words[h];
                                                            if (temp[0] === grid[0][3] && temp[1] === grid[1][3] &&
                                                                temp[2] === grid[2][3] && temp[3] === grid[3][3]) {
                                                                grid[4] = temp;
                                                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                                                    continue;
                                                                }

                                                                for (let i = 0; i < words.length; i++) { // finding row 5
                                                                    // undo insertion if necessary
                                                                    if (grid[4][4] !== '-') {
                                                                        grid[4] = grid[4].substring(0, 4) + '-';
                                                                    }
                                                                    temp = words[i];
                                                                    if (temp[0] === grid[4][0] && temp[1] === grid[4][1] &&
                                                                        temp[2] == grid[4][2] && temp[3] == grid[4][3]) {
                                                                        grid[4] = temp;

                                                                        for (let j = 0; j < words.length; j++) {
                                                                            temp = words[j];
                                                                            if (temp[0] == grid[0][4] && temp[1] == grid[1][4] &&
                                                                                temp[2] == grid[2][4] && temp[3] == grid[3][4] && temp[4] == grid[4][4]) {
                                                                                return true;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}



createClueMapping();
let testCluess = ["0","1","2","3","4","5","6","7","8","9"]
printGrid(["teste", "babae", "mamay", "float", "poopy"]);
printClues(testCluess);


export { createClueMapping, getWords, getClues, printGrid, printClues, generateCrossword };