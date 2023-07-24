#include <iostream>
#include <random>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
#include "parse.h"

using namespace std;

vector<string> getWordsInGrid(const string grid[5]) {
    string col1 = {grid[0][0], grid[1][0], grid[2][0], grid[3][0], grid[4][0]};
    string col2 = {grid[0][1], grid[1][1], grid[2][1], grid[3][1], grid[4][1]};
    string col3 = {grid[0][2], grid[1][2], grid[2][2], grid[3][2], grid[4][2]};
    string col4 = {grid[0][3], grid[1][3], grid[2][3], grid[3][3], grid[4][3]};
    string col5 = {grid[0][4], grid[1][4], grid[2][4], grid[3][4], grid[4][4]};

    // return the words inside the grid
    return {grid[0], grid[1], grid[2], grid[3], grid[4], col1, col2, col3, col4, col5};
}

vector<string> getClues(vector<string> wordsInGrid, unordered_map<string, string> wordsAndClues) {
    vector<string> inorderClues;
    for (int i = 0; i < 10; i++) {
        inorderClues.push_back(wordsAndClues[wordsInGrid[i]]);
    }
    return inorderClues;
}

void printClues(vector<string> clues) {
    cout << "1. Across: " << clues[0] << endl;
    cout << "2. Across: " << clues[1] << endl;
    cout << "3. Across: " << clues[2] << endl;
    cout << "4. Across: " << clues[3] << endl;
    cout << "5. Across: " << clues[4] << endl;
    cout << "1. Down: " << clues[5] << endl;
    cout << "2. Down: " << clues[6] << endl;
    cout << "3. Down: " << clues[7] << endl;
    cout << "4. Down: " << clues[8] << endl;
    cout << "5. Down: " << clues[9] << endl;
}

void printGrid(const string grid[5]) {
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            cout << grid[i][j] << " ";
        }
        cout << endl;
    }
    cout << endl;
}

bool checkWordBeginnings(unordered_map<string, bool>& wordBeginnings, const vector<string>& words, const string grid[5]) {
    /* load grid, putting the existing "word beginnings" into a vector */
    vector<string> begins = getWordsInGrid(grid);

    for (int i = 0; i < 10; i++) {
        auto it = wordBeginnings.find(begins[i]);
        // if this word beginning hasn't been mapped, map it
        if (it == wordBeginnings.end()) {
            bool beginningFound = false;
            // check if any words in the dataset have this beginning
            for (int j = 0; j < words.size(); j++) {
                // if a word has the same beginning, set beginningFound to true and break loop
                if (words[j][0] == begins[i][0]) {
                    if (begins[i][1] == '-') {
                        beginningFound = true;
                        break;
                    } else if (words[j][1] == begins[i][1]) {
                        if (begins[i][2] == '-') {
                            beginningFound = true;
                            break;
                        } else if (words[j][2] == begins[i][2]) {
                            if (begins[i][3] == '-') {
                                beginningFound = true;
                                break;
                            } else if (words[j][3] == begins[i][3]) {
                                if (begins[i][4] == '-') {
                                    beginningFound = true;
                                    break;
                                } else if (words[j][4] == begins[i][4]) {
                                    beginningFound = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            // map this beginning accordingly
            wordBeginnings[begins[i]] = beginningFound;
        }
        // return false if this maps to false;
        if (!wordBeginnings[begins[i]]) {
            return false;
        }
    }
    return true;
}

bool generate_crossword(string grid[5], const vector<string>& words) {
    unordered_map<string, bool> beginnings;
    beginnings["-----"] = true;

    string temp;
    for (int a = 0; a < words.size(); a++) { // finding row 1
        grid[0] = words[a];

        if (!checkWordBeginnings(beginnings, words, grid)) {
            continue;
        }

        for (int b = 0; b < words.size(); b++) { // finding col 1
            if (b == a)
                continue;

            // undo insertion if needed
            if (grid[1][0] != '-') {
                grid[1][0] = '-';
                grid[2][0] = '-';
                grid[3][0] = '-';
                grid[4][0] = '-';
            }

            temp = words[b];
            if (temp[0] == grid[0][0]) {
                grid[1][0] = temp[1];
                grid[2][0] = temp[2];
                grid[3][0] = temp[3];
                grid[4][0] = temp[4];
                if (!checkWordBeginnings(beginnings, words, grid)) {
                    continue;
                }

                for (int c = 0; c < words.size(); c++) { // finding row 2
                    if (c == b || c == a)
                        continue;
                    // undo insertion if needed
                    if (grid[1][1] != '-') {
                        grid[1][1] = '-';
                        grid[1][2] = '-';
                        grid[1][3] = '-';
                        grid[1][4] = '-';
                    }
                    temp = words[c];
                    if (temp[0] == grid[1][0]) {
                        grid[1] = temp;
                        if (!checkWordBeginnings(beginnings, words, grid)) {
                            continue;
                        }

                        for (int d = 0; d < words.size(); d++) { // finding col 2
                            // undo insertion if needed
                            if (grid[2][1] != '-') {
                                grid[2][1] = '-';
                                grid[3][1] = '-';
                                grid[4][1] = '-';
                            }

                            temp = words[d];
                            if (temp[0] == grid[0][1] && temp[1] == grid[1][1]) {
                                grid[2][1] = temp[2];
                                grid[3][1] = temp[3];
                                grid[4][1] = temp[4];

                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                    continue;
                                }

                                for (int e = 0; e < words.size(); e++) { // finding row 3
                                    // undo insertion if necessary
                                    if (grid[2][2] != '-') {
                                        grid[2][2] = '-';
                                        grid[2][3] = '-';
                                        grid[2][4] = '-';
                                    }

                                    temp = words[e];
                                    if (temp[0] == grid[2][0] && temp[1] == grid[2][1]) {
                                        grid[2] = temp;
                                        if (!checkWordBeginnings(beginnings, words, grid)) {
                                            continue;
                                        }

                                        for (int f = 0; f < words.size(); f++) { // finding col 3
                                            // undo insertion if necessary
                                            if (grid[3][2] != '-') {
                                                grid[3][2] = '-';
                                                grid[4][2] = '-';
                                            }

                                            temp = words[f];
                                            if (temp[0] == grid[0][2] && temp[1] == grid[1][2] && temp[2] == grid[2][2]) {
                                                grid[3][2] = temp[3];
                                                grid[4][2] = temp[4];
                                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                                    continue;
                                                }

                                                for (int g = 0; g < words.size(); g++) { // finding row 4
                                                    // undo insertion if necessary
                                                    if (grid[3][3] != '-') {
                                                        grid[3][3] = '-';
                                                        grid[3][4] = '-';
                                                    }

                                                    temp = words[g];
                                                    if (temp[0] == grid[3][0] && temp[1] == grid[3][1] &&
                                                        temp[2] == grid[3][2]) {
                                                        grid[3] = temp;
                                                        if (!checkWordBeginnings(beginnings, words, grid)) {
                                                            continue;
                                                        }

                                                        for (int h = 0; h < words.size(); h++) { // finding col 4
                                                            grid[4][3] = '-';
                                                            temp = words[h];
                                                            if (temp[0] == grid[0][3] && temp[1] == grid[1][3] &&
                                                                temp[2] == grid[2][3] && temp[3] == grid[3][3]) {
                                                                grid[4][3] = temp[4];
                                                                if (!checkWordBeginnings(beginnings, words, grid)) {
                                                                    continue;
                                                                }

                                                                for (int i = 0; i < words.size(); i++) { // finding row 5
                                                                    grid[4][4] = '-';
                                                                    temp = words[i];
                                                                    if (temp[0] == grid[4][0] &&
                                                                        temp[1] == grid[4][1] &&
                                                                        temp[2] == grid[4][2] && temp[3] == grid[4][3]) {
                                                                        grid[4] = temp;

                                                                        for (int j = 0; j < words.size(); j++) {
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
    return false;
}

int main() {
    // parse csv to get a vector of words, clues
    unordered_map<string, string> wordsAndClues = parseOldWords();

    // create, randomize a vector of only words
    vector<string> words;
    for (auto it = wordsAndClues.begin(); it != wordsAndClues.end(); it++) {
        words.push_back(it->first);
    }
    shuffle(words.begin(), words.end(), std::mt19937(std::random_device()()));

    // initialize grid, generate a 5x5 crossword
    string grid[5] = {"-----", "-----", "-----", "-----", "-----"};
    generate_crossword(grid, words);

    // get answers and clues for the generated crossword
    vector<string> answers = getWordsInGrid(grid);
    vector<string> clues = getClues(answers, wordsAndClues);

    // Print the grid and clues
    printGrid(grid);
    printClues(clues);

    return 0;
}
