/**
 * File to contain the JS conversions of the parse.h and main.cpp file.
 * Currently a work in progress.
 */

/// Libraries for CSV Parsing
const fs = require("fs");
const { parse } = require("csv-parse");


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
    let clueMap = {};

    fs.createReadStream("./uniqueFives.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            clueMap[row[0]] = row[1];
        })
        .on("error", function (error) {
            console.log(error.message);
        })
        .on("end", function () {
            console.log("Clue CSV Parsed.");
        }); 

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


// bool checkWordBeginnings(unordered_map<string, bool>& wordBeginnings, const vector<string>& words, const string grid[5]) {
//     /* load grid, putting the existing "word beginnings" into a vector */
//     vector<string> begins = getWordsInGrid(grid);

//     for (int i = 0; i < 10; i++) {
//         auto it = wordBeginnings.find(begins[i]);
//         // if this word beginning hasn't been mapped, map it
//         if (it == wordBeginnings.end()) {
//             bool beginningFound = false;
//             // check if any words in the dataset have this beginning
//             for (int j = 0; j < words.size(); j++) {
//                 // if a word has the same beginning, set beginningFound to true and break loop
//                 if (words[j][0] == begins[i][0]) {
//                     if (begins[i][1] == '-') {
//                         beginningFound = true;
//                         break;
//                     } else if (words[j][1] == begins[i][1]) {
//                         if (begins[i][2] == '-') {
//                             beginningFound = true;
//                             break;
//                         } else if (words[j][2] == begins[i][2]) {
//                             if (begins[i][3] == '-') {
//                                 beginningFound = true;
//                                 break;
//                             } else if (words[j][3] == begins[i][3]) {
//                                 if (begins[i][4] == '-') {
//                                     beginningFound = true;
//                                     break;
//                                 } else if (words[j][4] == begins[i][4]) {
//                                     beginningFound = true;
//                                     break;
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//             // map this beginning accordingly
//             wordBeginnings[begins[i]] = beginningFound;
//         }
//         // return false if this maps to false;
//         if (!wordBeginnings[begins[i]]) {
//             return false;
//         }
//     }
//     return true;
// }

/**
 * 
 * @param {*} wordBeginnings 
 * @param {*} words 
 * @param {*} grid 
 * @returns 
 */
function checkWordBeginnings(wordBeginnings, words, grid)
{
    let begin = getWords(grid);

    return false;
}




// createClueMapping();
// testCluess = ["0","1","2","3","4","5","6","7","8","9"]
// printClues(testCluess)
// printGrid(["teste", "babae", "mamay", "float", "poopy"]);