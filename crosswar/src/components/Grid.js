import React, { useState, useRef } from 'react'

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
const [statusBoard, setStatusBoard] = useState(Array(5).fill().map(() => new Array(5).fill("⬜")));

const crosswordRef = useRef(null); // necessary for moving from one input to another after key press

// updates the status board when a cell change occurs (see handleCellChange)
const handleStatusUpdate = (rowIndex, colIndex, value) => {
    // create a copy of current status board
    const updatedStatusBoard = [...statusBoard];

    // replace indicator of the changed cell accordingly
    var newIndicator = "⬜";
    switch (value) {
      case "Backspace":
        newIndicator = "⬜";
        break;
      case answers[rowIndex][colIndex-1]:
        newIndicator = "🟩";
        break;
      case "":
        newIndicator = "⬜";
        break;
      default:
        newIndicator = "🟧";
        break;
    }
    // update status board with the new indicator
    // !! believe that something here is causing the backspace error
    updatedStatusBoard[rowIndex][colIndex-1] = newIndicator;
    setStatusBoard(updatedStatusBoard)
};

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
    }
    else if (selection.row === -1 && selection.col === colIndex && selection.cell[0] === rowIndex && selection.cell[1] === colIndex) {
        // If the same cell is already selected, switch to highlighting column
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
    }
    else if (selection.col === -1) {
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
    }
    else if (selection.row === -1) {
        setSelection({ row: -1, col: colIndex, cell: [rowIndex, colIndex]});
    }
    else {
        // Highlight the selected row
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
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
    handleStatusUpdate(rowIndex, colIndex, e.key);
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

  return (
    <>
    {/* Opponent's Status Board */}
    <div className="opponent-grid">
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
    <br></br>
    {/* Interactive Crossword Grid */}
    <div ref={crosswordRef}>
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
    </>    
  );
}
