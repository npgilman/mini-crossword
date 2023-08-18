import React, { useState, useRef, useEffect } from 'react'
import Opponent from './Opponent.js'
import Clues from './Clues.js'
import ReactDOM from 'react-dom';
import Cluebar from './Cluebar.js';

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

export default function Grid(props) {

// grid variables
const [grid, setGrid] = useState(Array(5).fill("").map(row => new Array(5).fill("")));
const [selection, setSelection] = useState({ row: -1, col: -1, cell: [-1, -1]}); // used for blue highlights (row or col)
const [statusBoard, setStatusBoard] = useState(Array(5).fill().map(() => new Array(5).fill(EMPTY_CELL)));

// clue variables
const [acrossCluesArray, setAcrossCluesArray] = useState(Array(5).fill("across across across across across across across across")); // across clues
const [downCluesArray, setDownCluesArray] = useState(Array(5).fill("down down down down down down down down down down down down down")); // down clues
const [selectedClue, setSelectedClue] = useState(0);

// opponnent variables
const[numOpponents, setNumOpponents] = useState(0);
const[opponent1Name, setOpponent1Name] = useState("Opponent 1");
const[opponent1Status, setOpponent1Status] = useState(Array(5).fill().map(() => new Array(5).fill(EMPTY_CELL)));


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

    // emit status board to server

    const data = {
        board: newStatusBoard,
        room: props.room,
        id: props.socket.id
    }

    props.socket.emit("send_board", data);
};

function handleClueClick(e, clueType, clueNumber) { 
    // If user clicks a clue, focus on that row/col on the grid
    // Parameters:
    // e: event (click), clueType: across "a" or down "d", clueNumber: the number of the clue 0-4
    console.log(clueNumber);

    // Check clueType to see if it is an across or down clue
    if (clueType == "a") {

        let colIndex = 0;
        for(let i = 0; i < 5; i++) { // this loop finds the first empty cell in the clue row. We will use this to select the first empty cell to type next in.
            if (statusBoard[clueNumber][i] != EMPTY_CELL) {
                colIndex++;
            }
            else {
                break;
            }
            if(colIndex == 5) { // if row is full, highlight start
                colIndex = 0;
            }
        }

        setSelection({row: clueNumber, col: -1, cell: [clueNumber, colIndex]}); // highlight row
        setSelectedClue(clueNumber+"a"); // highlight selected clue
        const cell = crosswordRef.current.querySelector('#cell' + clueNumber + '-' + colIndex +'');
        cell.focus(); // focus on cell to be able to write in the cell
    }
    else {

        let rowIndex = 0;
        for(let i = 0; i < 5; i++) { // this loop finds the first empty cell in the clue column. We will use this to select the first empty cell to type next in.
            if (statusBoard[i][clueNumber] != EMPTY_CELL) {
                rowIndex++;
            }
            else {
                break;
            }
            if(rowIndex == 5) { // if column is full, highlight start
                rowIndex = 0;
            }
        }

        setSelection({row: -1, col: clueNumber, cell: [rowIndex, clueNumber]}); // highlight column
        setSelectedClue(clueNumber+"d"); // highlight selected clue
        const cell = crosswordRef.current.querySelector('#cell' + rowIndex + '-' + clueNumber +'');
        cell.focus(); // focus on cell to be able to write in the cell
    }
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

useEffect(() => {
    props.socket.on("announce_player", (data) => {
        console.log(data.username + " has joined the room!");

        setOpponent1Name(data.username);

        const dataToSend = {
            toId: data.id,
            fromUsername: props.username,
            room: data.room
        }

        props.socket.emit("send_name", dataToSend);

    });
    

    props.socket.on("receive_name", (data) => {
        if(data.toId == props.socket.id) {
            setOpponent1Name(data.fromUsername);
        }
    });

    props.socket.on("receive_board", (data) => {
        if(data.id != props.socket.id) {
            setOpponent1Status(data.board);
        }
    });
    // return () => props.socket.on("announce_player");
    // return () =>props.socket.on("receive_player");

}, [props.socket]);

/* This is used to render the Opponent's status board. It makes sure div exists before trying to render in it*/
const [domReady, setDomReady] = React.useState(false)
React.useEffect(() => {
    setDomReady(true)
}, [])

  return (
    <>
        <div style={{padding: "1vh", height: "42vh", overflow: "hidden"}}>
            <div>
                <table style={{color: "black", height: "1px", overflow: "scroll"}}>
                    <tr>
                        <td colSpan="2" id="cluebar">
                            <Cluebar across={acrossCluesArray} down={downCluesArray} selected={selectedClue} handleClueClick={handleClueClick}/>
                        </td>
                    </tr>
                    <tr style={{height: "60px"}}>
                        <td style={{width: "2vh", height: "10px", overflow: "hidden", verticalAlign: "top"}}>
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
                        </td>
                        <td style={{width: "65%", height: "10px", overflow: "hidden", verticalAlign: "top"}}>
                            <table style={{height: "100%"}}>
                                <tr id='cluebox'>
                                    <Clues across={acrossCluesArray} down={downCluesArray} selected={selectedClue} handleClueClick={handleClueClick}/>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <table style={{color: "black"}}>
            <tr>
                <td style={{width: "25%", fontFamily: "Serif"}}>
                    <div class="papers" style={{transform: "rotateZ(6deg) translateY(-1em) translateX(-2em)"}}>
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "-20px"}}/> 
                    {opponent1Name}
                    <div id="opponent1">
                        <Opponent data={opponent1Status}/>
                    </div>
                    </div>
                </td >
                <td style={{width: "25%", fontFamily: "RansomBlancoZero"} }>
                    <div class="papers" style={{transform: "rotateZ(-5deg) translateY(0.5em) translateX(-0.5em)"}}>
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "20px", filter: "hue-rotate(100deg)"}}/> 
                    Opponent 2
                    <div id="opponent2">
                        {/* <Opponent data={statusBoard}/> */}
                    </div>
                    </div>
                </td>
                <td style={{width: "25%", fontFamily: "RansomBlancoZero"}}>
                    <div class="papers" style={{transform: "rotateZ(7deg) translateY(-0.5em) translateX(1em)"}}>
                    Opponent 3<img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "20px", filter: "hue-rotate(210deg)"}}/> 
                    <div id="opponent3">
                        {/* <Opponent data={statusBoard}/> */}
                    </div>
                    </div>
                </td>
                <td style={{width: "25%", fontFamily: "RansomBlancoZero"}}>
                    <div class="papers" style={{transform: "rotateZ(-5deg) translateY(0.9em) translateX(1.5em)"}}>
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "-50px" , filter: "hue-rotate(290deg)"}}/> 
                    Opponent 4
                    
                    <div id="opponent4">
                        {/* <Opponent data={statusBoard}/> */}
                    </div>
                    </div>
                </td>
            </tr>
        </table>
    </>    
  );
}
