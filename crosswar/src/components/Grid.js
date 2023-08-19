import React, { useState, useRef, useEffect } from 'react'
import Opponent from './Opponent.js'
import Clues from './Clues.js'
import ReactDOM from 'react-dom';
import Cluebar from './Cluebar.js';
import Loading from './Loading.js';

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

const[opponentArr, setOpponentArr] = useState([]);


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
        room: props.room,
        board: newStatusBoard,
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
    props.socket.on("announce_player", (data) => { // Called when a new opponent joins the room
        console.log(data.username + " and id " + data.id + " has joined the room!");

        // Add player to opponent array
        setOpponentArr(             // replace the state,
            [                       // with a new array,
                ...opponentArr,     // that has all of the old opponents,
                {                   // and the new opponent at the end.
                    id: data.id,
                    username: data.username,
                    statusBoard: Array(5).fill().map(() => new Array(5).fill(EMPTY_CELL))
                }
            ]            
        );

        const oppList = opponentArr;
        oppList.push({
            id: props.socket.id,
            username: props.username,
            statusBoard: statusBoard
        })
        console.log("Opp List:");
        console.log(oppList);

        // Send user data to server
        // This data will be used to tell the new player who else is in the room
        const dataToSend = {
            toId: data.id, // will be used to tell which user will use this data
            fromId: props.socket.id,
            fromUsername: props.username,
            room: data.room,
            oppList: oppList
        }

        props.socket.emit("send_name", dataToSend); // Send user to data to server
    });
    

    props.socket.on("receive_name", (data) => { // Lets a player who just joined the room see who else is already in the room
        console.log(data);
        if (data.toId == props.socket.id) {
            setOpponentArr(data.oppList);
        }
        // console.log( data.fromUsername+" just sent their name");
        
        // let alreadySent = false;
        // opponentArr.map((opponent) => {
        //     if (opponent.id = data.fromId) {
        //         alreadySent = true;
        //     }
        // });

        // if(data.toId == props.socket.id && !alreadySent) { // makes sure that only the new user is using the data
        //     // Add player to opponent array
        //     setOpponentArr(             // replace the state,
        //         [                       // with a new array,
        //             ...opponentArr,     // that has all of the old opponents,
        //             {                   // and the new opponent at the end.
        //                 id: data.fromId,
        //                 username: data.fromUsername,
        //                 statusBoard: Array(5).fill().map(() => new Array(5).fill(EMPTY_CELL))
        //             }
        //         ]            
        //     );

        //     console.log("this is the new opponent array");
        //     console.log(opponentArr);
        // }
    });

    props.socket.on("receive_board", (data) => { // Called when an opponent types something in their board
        if(data.id != props.socket.id) { // Only update if user is not the player who made the change
            setOpponentArr(opponentArr.map((opponent) => { // Replace the state
                if(opponent.id === data.id) {
                    return { ...opponent, statusBoard: data.board }; // change the board variable if ids match
                }
                else {
                    return opponent; // return unchanged opponent object if ids don't match
                }
            }));
        }
    });


    // return () => props.socket.on("announce_player");
    // return () =>props.socket.on("receive_player");

}, [props.socket, opponentArr]);

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
                        <td style={{width: "2vh", height: "10px", overflow: "hidden", verticalAlign: "top", position: "relative"}}>
                            <div ref={crosswordRef} style={{whiteSpace: "nowrap"}}>
                                {grid.map((row, rowIndex) => (
                                    <div key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <input className="letter-box"
                                            autoComplete='off'
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
                            <div style={{width: "100%", height: "100%", position: "absolute", top:"0", left: "0", backgroundColor: "rgba(0,0,0,0.0)"}}>
                                <div id="button-1" style={{marginTop: "13vh", marginLeft:"4vw", marginRight:"4vw", marginBottom: "auto", zIndex: "1" ,  fontSize: "4.5vh", fontFamily: "KeplerStdBoldCaption", textAlign: "left", backgroundColor: "white", boxShadow: "2px 2px 2px 3px", padding: "20px 10px", textAlign: "center"}}>
                                    Start Game
                                </div>
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
                        {
                            opponentArr.length >= 1 ? (
                                opponentArr[0].username
                            ) : (
                                "Waiting for players..."
                            )
                        }
                        <div id="opponent1">
                        {
                            opponentArr.length >= 1 ? (
                                <Opponent data={opponentArr[0].statusBoard}/>
                            ) : (
                                <Loading/>
                            )
                        }
                        
                        </div>
                    </div>
                </td >
                {
                    opponentArr.length < 1 ? (
                        ""
                    ) : (

                <td style={{width: "25%", fontFamily: "Serif"} }>
                    <div class="papers" style={{transform: "rotateZ(-5deg) translateY(0.5em) translateX(-0.5em)"}}>
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "20px", filter: "hue-rotate(100deg)"}}/> 
                        {
                            opponentArr.length >= 2 ? (
                                opponentArr[1].username
                            ) : (
                                "Waiting for players..."
                            )
                        }
                        <div id="opponent2">
                        {
                            opponentArr.length >= 2 ? (
                                <Opponent data={opponentArr[1].statusBoard}/>
                            ) : (
                                <Loading/>
                            )
                        }
                        </div>
                    </div>
                </td>
                    )
                }
                {
                    opponentArr.length < 2 ? (
                        ""
                    ) : (

                <td style={{width: "25%", fontFamily: "RansomBlancoZero"}}>
                    <div class="papers" style={{transform: "rotateZ(7deg) translateY(-0.5em) translateX(1em)"}}>
                    {
                        opponentArr.length >= 3 ? (
                            opponentArr[2].username
                        ) : (
                            "Waiting for players..."
                        )
                    }
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "20px", filter: "hue-rotate(210deg)"}}/> 
                    <div id="opponent3">
                        {
                            opponentArr.length >= 3 ? (
                                <Opponent data={opponentArr[2].statusBoard}/>
                            ) : (
                                <Loading/>
                            )
                        }
                    </div>
                    </div>
                </td>
                                        
                    )
                }
                {
                    opponentArr.length < 3 ? (
                        ""
                    ) : (


                <td style={{width: "25%", fontFamily: "RansomBlancoZero"}}>
                    <div class="papers" style={{transform: "rotateZ(-5deg) translateY(0.9em) translateX(1.5em)"}}>
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "-50px" , filter: "hue-rotate(290deg)"}}/> 
                    {
                        opponentArr.length >= 4 ? (
                            opponentArr[3].username
                        ) : (
                            "Waiting for players..."
                        )
                    }
                    
                    <div id="opponent4">
                        {
                            opponentArr.length >= 4 ? (
                                <Opponent data={opponentArr[3].statusBoard}/>
                            ) : (
                                <Loading/>
                            )
                        }
                    </div>
                    </div>
                </td>
                    )
                }
            </tr>
        </table>
    </>    
  );
}
