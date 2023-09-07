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
 * @param {*} array words in dataset
 */
function fisherYatesShuffle(array)
{
    // iterate through array backwards
    for (let i = array.length - 1; i > 0; i--) {
        // set j to a random number from (0) to (# of remaining elements)
        const j = Math.floor(Math.random() * (i + 1));
        // swap curr element with element at [j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



/**
 * 
 * @param {*} grid 5 words of length 5
 * @returns array of words found in rows and columns of grid
 */
function getWords(grid)
{
    if (grid.length != 5)
        throw new Error('Grid does not conform to expected size');

    const rows = [];
    const columns = [];
    for (let i = 0; i < 5; i++)
    {
        // Build row words by iterating across grid[i]
        let rowWord = ''; 
        // Build column words by iterating down grid[j]     
        let colWord = '';
        for (let j = 0; j < 5; j++)
        {
            rowWord += grid[i][j];
            colWord += grid[j][i];
        }
        rows.push(rowWord);
        columns.push(colWord);
    }
    // Combine rows and columns into one array
    return rows.concat(columns);
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
        inorderClues.push(wordsAndClues.get(wordsInGrid[i]));
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
            // console.log("Clue CSV Parsed.");
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
 * 
 * @param {*} word
 * @param {*} grid
 * @param {*} isDown
 * @param {*} index
 */
function insertWord(word, grid, isDown, index)
{
    for (let i = 0; i < grid.length; i++) {
        if (isDown) { // insert word down
            var x = i, y = index;
        } else { // insert word across
            var x = index, y = i;
        }
        grid[x][y] = word[i];
    }
}


/**
 * @param {*} wordBeginnings 
 * @param {*} words 
 * @param {*} grid 
 * @returns 
 */
function checkWordBeginnings(wordBeginnings, words, grid)
{
    let wordsInGrid = getWords(grid);

    // iterate through the words currently in grid
    for (let i = 0; i < wordsInGrid.length; i++)
    {
        //console.log("Checking " + wordsInGrid[i]);

        // if this word been searched already...
        if (wordBeginnings.has(wordsInGrid[i])) {
            // ... and was marked unacceptable, return false
            if (!wordBeginnings.get(wordsInGrid[i])) { return false;}
            // otherwise go to next word in grid
            continue;
        }
        
        let acceptableWord = false;

        // Iterate through each letter of words in dataset
        wordloop: for (let j = 0; j < words.length; j++)
        {   
            // Skip dataset word if first letter is wrong
            if (words[j][0] != wordsInGrid[i][0]) {
                continue;
            }

            // Iterate through each letter of current dataset word 
            letterloop: for (let k = 0; k < words[j].length; k++)
            {
                // Check if word in grid matches database word
                // If a blank letter is reached, this word is acceptable
                if (wordsInGrid[i][k] === '-') {
                    acceptableWord = true;
                    break;
                }
                // if letter doesn't match, go to next word in dataset
                if (wordsInGrid[i][k] !== words[j][k]) {
                    break letterloop;
                }
            }
            if (acceptableWord) {
                break;
            }
        }
        // Save the result of checking word in grid
        wordBeginnings[wordsInGrid[i]] = acceptableWord;

        // Return false if an unacceptable word was found
        if (!acceptableWord) {
            return false;
        }
        
    }
    return true;
}

function generateCrossword(grid, words, beginnings) {    

    let temp = "";
    for (let a = 0; a < words.length; a++) { // finding row 1
        // Not using insertWord() here because if row & col are both 0 it will insert as 1 down
        // grid[0] = words[a];
        temp = words[a];
        insertWord(temp, grid, false, 0);
        

        if (!checkWordBeginnings(beginnings, words, grid)) {
            continue;
        }

        for (let b = 0; b < words.length; b++) { // finding col 1
            if (b === a)
                continue;

            // Check if there is a word in 1 Down that needs to be removed
            if (grid[1][0] !== '-') {
                let emptyWord = grid[0][0] + '----';
                insertWord(emptyWord, grid, true, 0);
            }

            temp = words[b];
            
            // If temp and 1 Across have the same first letter, insert temp as 1 Down
            if (temp[0] === grid[0][0]) {

                insertWord(temp, grid, true, 0); // Should insert temp as 1 Down

                if (!checkWordBeginnings(beginnings, words, grid)) {
                    continue;
                }

                for (let c = 0; c < words.length; c++) { // finding row 2
                    if (c === b || c === a)
                        continue;
                    // undo insertion if needed
                    if (grid[1][1] !== '-') {
                        let emptyWord = grid[1][0] + '----';
                        insertWord(emptyWord, grid, false, 1);
                    }

                    temp = words[c];
                    if (temp[0] === grid[1][0]) {

                        insertWord(temp, grid, false, 1); // Should insert temp as 2 Across

                        if (!checkWordBeginnings(beginnings, words, grid)) {
                            continue;
                        }

                        for (let d = 0; d < words.length; d++) { // finding col 2
                            // undo insertion if needed
                            if (grid[2][1] !== '-') {
                                let emptyWord = grid[0][1] + grid[1][1] + '---';
                                insertWord(emptyWord, grid, true, 1);
                            }
                            temp = words[d];
                            if (temp[0] === grid[0][1] && temp[1] === grid[1][1]) {

                                insertWord(temp, grid, true, 1); // Should insert temp as 2 Down
                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                    continue;
                                }

                                for (let e = 0; e < words.length; e++) { // finding row 3
                                    // undo insertion if necessary
                                    if (grid[2][2] !== '-') {
                                        let emptyWord = grid[2][0] + grid[2][1] + '---';
                                        insertWord(emptyWord, grid, false, 2);
                                    }
                                    temp = words[e];
                                    if (temp[0] === grid[2][0] && temp[1] === grid[2][1]) {

                                        insertWord(temp, grid, false, 2); // Should insert temp as 3 Across

                                        if (!checkWordBeginnings(beginnings, words, grid)) {
                                            continue;
                                        }


                                        for (let f = 0; f < words.length; f++) { // finding col 3
                                            // undo insertion if necessary
                                            if (grid[3][2] !== '-') {
                                                let emptyWord = grid[0][2] + grid[1][2] + grid[2][2] + '--';
                                                insertWord(emptyWord, grid, true, 2);
                                            }
                                            temp = words[f];
                                            if (temp[0] === grid[0][2] && temp[1] === grid[1][2] && temp[2] === grid[2][2]) {

                                                insertWord(temp, grid, true, 2); // Should insert temp as 3 Down

                                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                                    continue;
                                                }

                                                for (let g = 0; g < words.length; g++) { // finding row 4
                                                    // undo insertion if necessary
                                                    if (grid[3][3] !== '-') {
                                                        let emptyWord = grid[3][0] + grid[3][1] + grid[3][2] + '--';
                                                        insertWord(emptyWord, grid, false, 3);
                                                    }
                                                    temp = words[g];
                                                    if (temp[0] === grid[3][0] && temp[1] === grid[3][1] && temp[2] === grid[3][2]) {

                                                        insertWord(temp, grid, false, 3); // Should insert temp as 4 Across

                                                        if (!checkWordBeginnings(beginnings, words, grid)) {
                                                            continue;
                                                        }

                                                        for (let h = 0; h < words.length; h++) { // finding col 4
                                                            // undo insertion if necessary
                                                            if (grid[4][3] !== '-') {
                                                                let emptyWord = grid[0][3] + grid[1][3] + grid[2][3] + grid[3][3] + '-';
                                                                insertWord(emptyWord, grid, true, 3);
                                                            }
                                                            temp = words[h];
                                                            if (temp[0] === grid[0][3] && temp[1] === grid[1][3] &&
                                                                temp[2] === grid[2][3] && temp[3] === grid[3][3]) {

                                                                insertWord(temp, grid, true, 3); // Should insert temp as 4 Down
                                                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                                                    continue;
                                                                }

                                                                for (let i = 0; i < words.length; i++) { // finding row 5
                                                                    // undo insertion if necessary
                                                                    if (grid[4][4] !== '-') {
                                                                        let emptyWord = grid[4][0] + grid[4][1] + grid[4][2] + grid[4][3] + '-';
                                                                        insertWord(emptyWord, grid, false, 4);
                                                                    }
                                                                    temp = words[i];
                                                                    if (temp[0] === grid[4][0] && temp[1] === grid[4][1] &&
                                                                        temp[2] == grid[4][2] && temp[3] == grid[4][3]) {

                                                                        insertWord(temp, grid, false, 4);

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

export { createClueMapping, getWords, getClues, printGrid, printClues, generateCrossword, fisherYatesShuffle };