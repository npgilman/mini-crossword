import React, { useState, useRef } from 'react'

export default function Grid() {
const [grid, setGrid] = useState(Array(5).fill("").map(row => new Array(5).fill("")));
const [selection, setSelection] = useState({ row: -1, col: -1, cell: [-1, -1]}); // used for blue highlights (row or col)

const crosswordRef = useRef(null); // necessary for moving from one input to another after key press

const handleCellClick = (e, rowIndex, colIndex) => { // highlight row or column

    // make cursor go to end of the string :P
    const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
    cell.focus();
    var val = e.target.value;
    e.target.value = '';
    e.target.value = val;


    if (selection.row === rowIndex && selection.col === -1 && selection.cell[0] == rowIndex && selection.cell[1] == colIndex) {
        // If the same cell is already selected, switch to highlighting column
        setSelection({ row: -1, col: colIndex, cell: [rowIndex, colIndex]});
    }
    else if (selection.row === -1 && selection.col === colIndex && selection.cell[0] == rowIndex && selection.cell[1] == colIndex) {
        // If the same cell is already selected, switch to highlighting column
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
    }
    else if (selection.col == -1) {
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
    }
    else if (selection.row == -1) {
        setSelection({ row: -1, col: colIndex, cell: [rowIndex, colIndex]});
    }
    else {
        // Highlight the selected row
        setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
    }
};

const handleCellChange = (e, rowIndex, colIndex) => {
    // key entered is in e.key
    if (e.key != "Backspace" && e.key.length > 1) {
        // prevents keys like "Up" for the up arrow key from doing anything
    }
    else if (e.key == "Backspace") { // backspace pressed
        if (e.target.value != "") {
            e.target.value = "";
            const updatedGrid = [...grid];
            updatedGrid[rowIndex][colIndex] = e.target.value;
            setGrid(updatedGrid)
        }
        else {
            // switch locations
    
            // switch up a row
            if (selection.row != -1) {
                colIndex = colIndex - 1;
                const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
                if (cell) {
                    // focuse
                    cell.focus();
                    console.log(cell.value)

                    // remove letter thats there
                    cell.value = "";
                    console.log(cell.value)
                    const updatedGrid = [...grid];
                    updatedGrid[rowIndex][colIndex] = e.target.value;
                    setGrid(updatedGrid)

                    // change selection
                    setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
                }
            }

            // switch up a column
            else if (selection.col != -1) {
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
        
        // switch down a row
        if (selection.row != -1) {
            colIndex = colIndex + 1;
            const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
            if (cell) {
                cell.focus();
                setSelection({ row: rowIndex, col: -1, cell: [rowIndex, colIndex]});
            }
        }

        // switch down a column
        else if (selection.col != -1) {
            rowIndex = rowIndex + 1;
            const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + colIndex +'');
            if (cell) {
                cell.focus();
                setSelection({ row: -1, col: colIndex, cell: [rowIndex, colIndex]});
            }  
        }
    }

};

const handleCellChange2 = (e) => {
    // was giving me an error without this function, so its here but doesn't do anything...
}

function backgroundColor(rowIndex, colIndex) { // cell color
    if (selection.cell[0] == rowIndex && selection.cell[1] == colIndex) { // current box 
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
    <div ref={crosswordRef}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <input className="letter-box"
              key={colIndex}
              id={"cell"+rowIndex+"-"+colIndex}
              value={cell}
              onChange = {(e) => handleCellChange2(e)}
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
  );

  return (
    <div>Grid</div>
  )
}
