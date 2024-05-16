
#include <iostream>
#include <fstream>
#include <sstream>
#include <unordered_map>

using namespace std;

unordered_map<string, string> parseOldWords();

unordered_map<string, string> parseOldWords() {
    fstream file;
    file.open("../uniqueFives.csv", ios::in);

    unordered_map<string, string> wordsAndClues;
    string word, clue, line;
    getline(file, line);

    while (getline(file, line)) {
        stringstream str(line);

        getline(str, word, ',');
        getline(str, clue, ',');
        wordsAndClues[word] = clue;
    }
    return wordsAndClues;
}