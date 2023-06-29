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
function createClueMapping()
{
    let clueMap = new Map();

    /// TODO: Change to relative path. Breaking without absolute.
    fs.createReadStream("C:\\Users\\twinb\\OneDrive\\Desktop\\misc\\wordle2\\crosswar\\src\\Crossword Generator\\uniqueFives.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            clueMap.set(row[0], row[1]);
        })
        .on("error", function (error) {
            console.log(error.message);
        })
        .on("end", function () {
            console.log("Clue CSV Parsed.");
        }); 
    
    
    for (let [key, value] of clueMap) {
        console.log(key + " = " + value);
    }
    return clueMap;
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
    
    // MAGIC CONSTANT 10
    // REPLACE WITH SOMETHING BETTER
    for (let i = 0; i < 10; i++)
    {
        if (wordBeginnings.includes(beginnings[i]))
        {
            let beginningFound = false;
            // could refactor to words.forEach({lambda funct})
            // staying consistent with CJ original design for now
            for (let j = 0; j < words.size(); j++)
            {
                // MAGIC CONSTANT 5 BECAUSE WORD LENGTH IS 5
                // REPLACE WITH words[j].length() OR SOMETHING EQUIVALENT
                for (let k = 0; k < 5; k++)
                {
                    if (words[j][k] == begins[i][k])
                    {
                        if ((k == 4) || ((k+1 < 5) && begins[i][k+1] == '-'))
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




// createClueMapping();
// testCluess = ["0","1","2","3","4","5","6","7","8","9"]
// printClues(testCluess)
// printGrid(["teste", "babae", "mamay", "float", "poopy"]);

export { createClueMapping, getWords, getClues, printGrid, printClues };