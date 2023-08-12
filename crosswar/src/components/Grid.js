import React, { useState, useRef } from 'react'
import Opponent from './Opponent.js'
import Clues from './Clues.js'
import ReactDOM from 'react-dom';

let INCORRECT_CELL = "🟧"
let EMPTY_CELL = "⬜"
let CORRECT_CELL = "🟩"

// answers as reflected in the status board
let answers = [
    "abcde",
    "fghij",
    "klmno",
    "pqrst",
    "uvwxy",
]

export default function Grid() {
const [grid, setGrid] = useState(Array(5).fill("").map(row => new Array(5).fill("")));
const [selection, setSelection] = useState({ row: -1, col: -1, cell: [-1, -1]}); // used for blue highlights (row or col)
const [statusBoard, setStatusBoard] = useState(Array(5).fill().map(() => new Array(5).fill(EMPTY_CELL)));

const [acrossCluesArray, setAcrossCluesArray] = useState(Array(5).fill("across across across across across across across across")); // across clues
const [downCluesArray, setDownCluesArray] = useState(Array(5).fill("down down down down down down down down down down down down down")); // down clues
const [selectedClue, setSelectedClue] = useState(0);

const crosswordRef = useRef(null); // necessary for moving from one input to another after key press

// updates the status board when a cell change occurs (see handleCellChange)
const handleStatusUpdate = () => {
    // iterate through grid, checking value of each cell against status board
    var newStatusBoard = [...statusBoard];

    var numRows = grid.length;
    var numColumns = grid[0].length;
    let updateFound = false;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            // cell is incorrect but statusboard isn't up to date
            if (grid[i][j] !== answers[i][j] && grid[i][j] !== "") {
                //update statusboard and end loop
                newStatusBoard[i][j] = INCORRECT_CELL
            }

            // cell is empty but statusboard isn't up to date
            if (grid[i][j] === "") {
                //update statusboard and end loop
                newStatusBoard[i][j] = EMPTY_CELL
            }

            // cell is correct but statusboard isn't up to date
            if (grid[i][j] === answers[i][j]) {
                //update statusboard and end loop
                newStatusBoard[i][j] = CORRECT_CELL
            }
        }
    }
    setStatusBoard(newStatusBoard);
};

const handleClueClick = (e, rowIndex, colIndex) => {
    // if user clicks a clue, focus on that row/col on the grid
}

const handleCellClick = (e, rowIndex, colIndex) => { // highlight row or column
    // make cursor go to end of the string :P
    const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
    cell.focus();
    var val = e.target.value;
    e.target.value = '';
    e.target.value = val;

    if (selection.row === rowIndex && selection.col === -1 && selection.cell[0] === rowIndex && selection.cell[1] === colIndex) {
        // If the same cell is already selected, switch to highlighting column
        setSelection({ row: -1, col: colIndex, cell: [rowIndex, colIndex]});
        setSelectedClue(colIndex+"d");
    }
    else if (selection.row === -1 && selection.col === colIndex && selection.cell[0] === rowIndex && selection.cell[1] === colIndex) {
        // If the same cell is already selected, switch to highlighting row
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
        setSelectedClue(rowIndex+"a");
    }
    else if (selection.col === -1) {
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
        setSelectedClue(rowIndex+"a");
    }
    else if (selection.row === -1) {
        setSelection({ row: -1, col: colIndex, cell: [rowIndex, colIndex]});
        setSelectedClue(colIndex+"d");
    }
    else {
        // Highlight the selected row
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
        setSelectedClue(rowIndex+"a");
    }
};

const handleCellChange = (e, rowIndex, colIndex) => {
    // key entered is in e.key
    if (e.key !== "Backspace" && e.key.length > 1) {
        // prevents keys like "Up" for the up arrow key from doing anything
    }
    else if (e.key === "Backspace") { // backspace pressed
        if (e.target.value !== "") {
            e.target.value = "";
            const updatedGrid = [...grid];
            updatedGrid[rowIndex][colIndex] = e.target.value;
            setGrid(updatedGrid)
        }
        else {
            // switch locations
    
            // move up a row
            if (selection.row !== -1) {
                colIndex = colIndex - 1;
                const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
                if (cell) {
                    // focuse
                    cell.focus();
                    //console.log(cell.value)

                    // remove letter thats there
                    cell.value = "";
                    //console.log(cell.value)
                    const updatedGrid = [...grid];
                    updatedGrid[rowIndex][colIndex] = e.target.value;
                    setGrid(updatedGrid)

                    // change selection
                    setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
                }
            }

            // move up a column
            else if (selection.col !== -1) {
                rowIndex = rowIndex - 1;
                const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
                if (cell) {
                    // focus
                    cell.focus();
                    
                    // remove letter thats there
                    cell.value = "";
                    const updatedGrid = [...grid];
                    updatedGrid[rowIndex][colIndex] = e.target.value;
                    setGrid(updatedGrid)

                    const updatedStatusBoard = [...statusBoard];
                    updatedStatusBoard[rowIndex][colIndex] = "u"
                    setStatusBoard(updatedStatusBoard);

                    // change selection
                    setSelection({ row: -1, col: colIndex, cell: [rowIndex, colIndex]});
                }  
            }
        }
    }
    else {
        // get last key entered and replace value with that last key entered
        var string = e.key;
        string = string[string.length - 1];
        e.target.value = string;
        //console.log(e.target.value);

        // update internal grid
        const updatedGrid = [...grid];
        updatedGrid[rowIndex][colIndex] = e.target.value;
        setGrid(updatedGrid);

        // switch locations
        // move down a row
        if (selection.row !== -1) {
            colIndex = colIndex + 1;
            const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
            if (cell) {
                cell.focus();
                setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
            }
        }

        // move down a column
        else if (selection.col !== -1) {
            rowIndex = rowIndex + 1;
            const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
            if (cell) {
                cell.focus();
                setSelection({ row: -1, col: colIndex, cell: [rowIndex, colIndex]});
            }  
        }
    }
    handleStatusUpdate();
};

function backgroundColor(rowIndex, colIndex) { // cell color
    if (selection.cell[0] === rowIndex && selection.cell[1] === colIndex) { // current box 
        return "#ffda37"; // yellow
    }
    else if ((rowIndex === selection.row || colIndex === selection.col)) { // row or column 
        return "#a7d8fd"; // blue
    }
    else {
        return "white";
    }
}

/* This is used to render the Opponent's status board. It makes sure div exists before trying to render in it*/
const [domReady, setDomReady] = React.useState(false)
React.useEffect(() => {
    setDomReady(true)
}, [])

  return (
    <>
    {/* Opponent's Status Board */}
    {/* <div className="opponent-grid">
      {statusBoard.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div key={colIndex} className="opponent-row">
                {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
    <br></br> */}
    {/* Interactive Crossword Grid */}
    <div ref={crosswordRef} style={{whiteSpace: "nowrap"}}>
        {grid.map((row, rowIndex) => (
            <div key={rowIndex}>
                {row.map((cell, colIndex) => (
                    <input className="letter-box"
                    key={colIndex}
                    id={"cell"+rowIndex+"-"+colIndex}
                    value={cell}
                    onKeyDown={(e) => handleCellChange(e, rowIndex, colIndex)}
                    onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
                    style={{
                        backgroundColor:
                        backgroundColor(rowIndex, colIndex)
                    }}
                    />
                ))}
            </div>
        ))}
    </div>

    {(domReady == true) &&
            ReactDOM.createPortal(<Opponent data={statusBoard}/>, document.getElementById('opponent1'))
    }
    {(domReady == true) &&
            ReactDOM.createPortal(<Opponent data={statusBoard}/>, document.getElementById('opponent2'))
    }
    {(domReady == true) &&
            ReactDOM.createPortal(<Opponent data={statusBoard}/>, document.getElementById('opponent3'))
    }
    {(domReady == true) &&
            ReactDOM.createPortal(<Opponent data={statusBoard}/>, document.getElementById('opponent4'))
    }

    {(domReady == true) &&
            ReactDOM.createPortal(<Clues across={acrossCluesArray} down={downCluesArray} selected={selectedClue}/>, document.getElementById('cluebox'))
    }


    </>    
  );
}
