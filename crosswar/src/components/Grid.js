import React, { useState, useRef, useEffect } from 'react'
import Opponent from './Opponent.js'
import Clues from './Clues.js'
import ReactDOM from 'react-dom';
import Cluebar from './Cluebar.js';
import Loading from './Loading.js';
import GameChat from './GameChat.js';
import Scoreboard from './Scoreboard.js';

let INCORRECT_CELL = "🟧"
let EMPTY_CELL = "⬜"
let CORRECT_CELL = "🟩"

export default function Grid(props) {

// answers as reflected in the status board
const [answers, setAnswers] = useState(["qwert",
"qwert",
"qwert",
"qwert",
"qwert"]);

// Grid variables
const [grid, setGrid] = useState(Array(5).fill("").map(row => new Array(5).fill(""))); // Main grid variable that holds all user's inputs
const [selection, setSelection] = useState({ row: -1, col: -1, cell: [-1, -1]}); // Used for blue highlights (row or col)
const [statusBoard, setStatusBoard] = useState(Array(5).fill().map(() => new Array(5).fill(EMPTY_CELL))); // Checks if an input is correct or incorrect, send to other users in a room

// Clue variables
const [acrossCluesArray, setAcrossCluesArray] = useState(Array(5).fill("across across across across across across across across")); // across clues
const [downCluesArray, setDownCluesArray] = useState(Array(5).fill("down down down down down down down down down down down down down")); // down clues
const [selectedClue, setSelectedClue] = useState(0); // Selected clue variable used to store and update the user's selected clue

// Opponnent variables
const [numOpponents, setNumOpponents] = useState(0); 
const [opponentArr, setOpponentArr] = useState([]); // List of all of the opponents in room, with their username and unique id

// Chat variables
const [chatArr, setChatArr] = useState([props.username + " joined the room!"]) // Holds list of messages in pregame chat

// Game variables
const [gameStarted, setGameStarted] = useState(false); // Boolean var to determine whether game has started or not.
const [playerFinished, setPlayerFinished] = useState(false); // Boolean to determine if user has finished their crossword
const [playerFinishedCorrect, setPlayerFinishedCorrect] = useState(false); // Boolean to determine if user has entered all the correct answers

// Winners
const [winners, setWinners] = useState([]);

// Timer running
const [running, setRunning] = useState(false);
const [time, setTime] = useState(0);

// Start button
const [showStartButton, setShowStartButton] = useState(true);
const [startButtonMessage, setStartButtonMessage] = useState("Start Game")

// Play again button
const [showPlayAgain, setShowPlayAgain] = useState(false);


const crosswordRef = useRef(null); // Necessary for moving from one input to another after key press


const handleStatusUpdate = () => { // Updates the status board when a cell change occurs (see handleCellChange)
    // iterate through grid, checking value of each cell against status board
    var newStatusBoard = [...statusBoard];

    var numRows = grid.length;
    var numColumns = grid[0].length;
    let updateFound = false;
    let complete = true;
    let total = 0;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
            // cell is incorrect but statusboard isn't up to date
            if (grid[i][j] != answers[i][j] && grid[i][j] !== "") {
                //update statusboard and end loop
                // console.log("ANSWER: "+answers[i][j]);
                // console.log("RECEIVED: "+grid[i][j]);
                //console.log("Incorrect - remove this");
                newStatusBoard[i][j] = INCORRECT_CELL
                setPlayerFinished(false);
                setPlayerFinishedCorrect(false);
            }

            // cell is empty but statusboard isn't up to date
            if (grid[i][j] === "") {
                //update statusboard and end loop
                //console.log("Empty - remove this");
                newStatusBoard[i][j] = EMPTY_CELL
                setPlayerFinished(false);
                setPlayerFinishedCorrect(false);
            }

            // cell is correct but statusboard isn't up to date
            if (grid[i][j] === answers[i][j]) {
                //update statusboard and end loop
                //console.log("correct - remove this");
                newStatusBoard[i][j] = CORRECT_CELL
            } 
            else {
                complete = false;
            }

            if (grid[i][j] != "") {
                total = total + 1;
            }

        }

    }

    if (complete == true) {
        setPlayerFinished(true);
        setPlayerFinishedCorrect(true);
        setRunning(false);
        console.log("Finished with everything correct!");

        const finishData = {
            room: props.room,
            username: props.username,
            time: time
        }
        props.socket.emit("send_finish", finishData);
    }
    else if (total == 25) {
        setPlayerFinished(false);
        setPlayerFinished(true);
        console.log("One or more incorrect answers")
    }

    setStatusBoard(newStatusBoard);

    // Emit status board to server with socket io

    // 1. Prepare data with room, board, and id
    const data = {
        room: props.room,
        board: newStatusBoard,
        id: props.socket.id
    }

    // 2. Emit to server
    props.socket.emit("send_board", data);
};

function handleClueClick(e, clueType, clueNumber) { 
    // If user clicks a clue, focus on that row/col on the grid
    // Parameters:
    //      e: event (click) 
    //      clueType: across "a" or down "d" 
    //      clueNumber: the number of the clue 0-4

    // Check clueType to see if it is an across or down clue
    if (clueType == "a") {

        let colIndex = 0;
        for(let i = 0; i < 5; i++) { // This loop finds the first empty cell in the clue row. We will use this to select the first empty cell to type next in.
            if (statusBoard[clueNumber][i] != EMPTY_CELL) {
                colIndex++;
            }
            else {
                break; // Exit loop if we found a non-empty cell
            }
            if(colIndex == 5) { // If row is full, highlight start
                colIndex = 0;
            }
        }

        setSelection({row: clueNumber, col: -1, cell: [clueNumber, colIndex]}); // highlight row
        setSelectedClue(clueNumber+"a"); // highlight selected clue
        const cell = crosswordRef.current.querySelector('#cell' + clueNumber + '-' + colIndex +'');
        cell.focus(); // focus on cell to be able to write in the cell
    }
    else { // Do the same thing but for a down clue

        let rowIndex = 0;
        for(let i = 0; i < 5; i++) { // This loop finds the first empty cell in the clue column. We will use this to select the first empty cell to type next in.
            if (statusBoard[i][clueNumber] != EMPTY_CELL) {
                rowIndex++;
            }
            else {
                break; // Exit loop if we found a non-empty cell
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
    // Key entered is in e.key
    if (playerFinishedCorrect) {
        return;
    }
    if (e.key !== "Backspace" && e.key.length > 1) {
        // Prevents keys like "Up" for the up arrow key from doing anything
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

function letterBoxColor(rowIndex, colIndex) {
    if (playerFinished) {
        if (playerFinishedCorrect) {
            return "letter-box green"
        }
        else {
            if (statusBoard[rowIndex][colIndex] == INCORRECT_CELL) {
                return "letter-box red"
            }
            else {
                console.log("Correct answer here -DELETE")
                return "letter-box"
            }
        }
    }
    else {
        return "letter-box"
    }
}

useEffect(() => {
    props.socket.off("announce_player").on("announce_player", (data) => { // Called when a new opponent joins the room
        console.log(data.username + " and id " + data.id + " has joined the room!");
        setChatArr((list) => [...list, (data.username + " joined the room!")]); // update messages with user joining message

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

        const oppList = opponentArr; // create an opponent list that includes the user, will be used by the new player to see who else is in the room
        oppList.push({
            id: props.socket.id,
            username: props.username,
            statusBoard: statusBoard
        })

        // All opponent data to server
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
    

    props.socket.off("receive_name").on("receive_name", (data) => { // Lets a player who just joined the room see who else is already in the room
        if (data.toId == props.socket.id) {
            setOpponentArr(data.oppList);
        }
    });

    props.socket.on("receive_message", (data) => {
        setChatArr((list) => [...list, data]);
    });

    props.socket.off("receive_start_disable").on("receive_start_disable", (data) => {

        setChatArr((list) => [...list, (data.username + " started the game!")]);

        setShowStartButton(false);
        setStartButtonMessage("Generating Crossword...");
    });

    props.socket.on("receive_game_start", (data) => { // Start game
        setGameStarted(true); // set gameStarted state to true
        setRunning(true);

        // Set clues and crossword state variables
        // console.log("got from server:");
        console.log(data.ans);
        // console.log(data.acrossClues);
        // console.log(data.downClues);
        setAnswers(data.ans);
        setAcrossCluesArray(data.acrossClues);
        setDownCluesArray(data.downClues);
        // Not done yet, implement after crossword generation is done.
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

    props.socket.off("receive_winner").on("receive_winner", (data) => { // Called when someone finishes their crossword with everything correct
        
        console.log(data);
        console.log("Win length: " + winners.length);
        console.log("Opponent length: " + opponentArr.length);
        console.log("Player finished correct: " + playerFinishedCorrect);

        

        if ((winners.length >= opponentArr.length) || opponentArr.length == 0) { // Check if everyone is finished
            console.log("disconnecting")

            // Disconnect from room
            const toSend = {
                room: props.room,
                id: props.socket.id
            }
            setTimeout(1000)
            props.socket.emit("send_disconnect_request", toSend);

            // Display play again button
            setShowPlayAgain(true);

            if(data.id != props.socket.id) { // Only update if user is not the player who made the change
                setOpponentArr(opponentArr.map((opponent) => { // Replace the state
                    if(opponent.username === data.username) {
                        return { ...opponent, statusBoard: statusBoard }; // change the board variable if ids match
                    }
                    else {
                        return opponent; // return unchanged opponent object if ids don't match
                    }
                }));
            }


        }


        setWinners((list) => [...list, data]);
    });

    props.socket.off("receive_opponent_leaving").on("receive_opponent_leaving", (data) => {
        // When a user leaves, send a message to other players of leaving and remove from opponent array

        let oldOpponentArray = opponentArr;

        setOpponentArr(opponentArr.filter(opp =>  // removing from array
            data.id != opp.id
        ))

        for (let i = 0; i < oldOpponentArray.length; i++) { // send message
            if (oldOpponentArray[i].id == data.id) {
                setChatArr((list) => [...list, (oldOpponentArray[i].username + " left the room.")]); // update messages with user leaving message
            }
        }

        

    });

     return () => props.socket.on("receive_message");
    // return () => props.socket.on("announce_player");
    // return () =>props.socket.on("receive_player");

}, [props.socket, opponentArr]);

// /* This is used to render the Opponent's status board. It makes sure div exists before trying to render in it*/
// const [domReady, setDomReady] = React.useState(false)
// React.useEffect(() => {
//     setDomReady(true)
// }, [])

const startGame = () => { // Called when user presses Start Game in a room
    //setGameStarted(true);
    console.log("test")
    console.log(showStartButton);
    if (showStartButton == false) {
        return;
    }
    

    const data = {
        room: props.room,
        username: props.username
    }
    props.socket.emit("send_start_disable", data);
    props.socket.emit("start_game", data);
}

const playAgain = () => { // Called when user presses play again after playing a game


// // Chat variables
// const [chatArr, setChatArr] = useState([props.username + " joined the room!"]) // Holds list of messages in pregame chat



    // Connect to room again
    const userData = {
        username: props.username,
        room: props.room,
        id: props.socket.id
    }

    props.socket.emit("join_room", userData); // tell server to join user to room, sends a variable with entered username and room to server

    // Reset all necessary variables
    setAnswers(["qwert",
    "qwert",
    "qwert",
    "qwert",
    "qwert"]);
    setGrid(Array(5).fill("").map(row => new Array(5).fill("")));
    setSelection({ row: -1, col: -1, cell: [-1, -1]});
    setStatusBoard(Array(5).fill().map(() => new Array(5).fill(EMPTY_CELL)));
    setAcrossCluesArray(Array(5).fill("across across across across across across across across"));
    setDownCluesArray(Array(5).fill("down down down down down down down down down down down down down"));
    setSelectedClue(0);
    setNumOpponents(0);
    setOpponentArr([]);
    setGameStarted(false);
    setPlayerFinished(false);
    setPlayerFinishedCorrect(false);
    setWinners([]);
    setRunning(false);
    setTime(0);
    setShowStartButton(true);
    setStartButtonMessage("Start Game");
    setShowPlayAgain(false);



}

  return (
    <>
        <div style={{padding: "1vh", height: "42vh", overflow: "hidden"}}>
            <div>
                <table style={{color: "black", height: "1px", overflow: "scroll"}}>
                    <tr>
                        <td colSpan="2" id="cluebar">
                            <Cluebar across={acrossCluesArray} down={downCluesArray} selected={selectedClue} handleClueClick={handleClueClick} runTimer={running} time={time} setTime={setTime}/>
                        </td>
                    </tr>
                    <tr style={{height: "60px"}}>
                        <td style={{width: "2vh", height: "10px", overflow: "hidden", verticalAlign: "top", position: "relative"}}>
                            <div ref={crosswordRef} style={{whiteSpace: "nowrap"}}>
                                {grid.map((row, rowIndex) => (
                                    <div key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <input className={letterBoxColor(rowIndex, colIndex)}
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
                            {
                                !gameStarted ? (
                                    <div style={{width: "100%", height: "100%", position: "absolute", top:"0", left: "0", backgroundColor: "rgba(0,0,0,0.0)"}}>
                                        <div id="button-1" style={{marginTop: "13vh", marginLeft:"4vw", marginRight:"4vw", marginBottom: "auto", zIndex: "1" ,  fontSize: "4.5vh", fontFamily: "KeplerStdBoldCaption", textAlign: "left", backgroundColor: "white", boxShadow: "2px 2px 2px 3px", padding: "20px 10px", textAlign: "center"}}
                                            onClick={startGame} disabled={showStartButton}>
                                            {startButtonMessage}
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )
                            }

                        </td>
                        <td style={{width: "65%", height: "10px", overflow: "hidden", verticalAlign: "top"}}>
                            {
                                !gameStarted ? (
                                    <div style={{position: "relative", marginTop:  "0", width: "100%", height: "100%", marginLeft: "auto", marginTop: "auto"}}>
                                        <GameChat room={props.room} chatArr={chatArr} username={props.username} setChatArr={setChatArr} socket={props.socket}/>
                                    </div>
                                    
                                ) : (

                                    
                                        playerFinishedCorrect ? (
                                            <>
                                            <Scoreboard winner={winners} showPlay={showPlayAgain} playClick={playAgain}></Scoreboard>

                                            </>
                                        ) : (
                                            <table style={{height: "100%"}}>
                                                <tr id='cluebox'>
                                                    <Clues across={acrossCluesArray} down={downCluesArray} selected={selectedClue} handleClueClick={handleClueClick}/>
                                                </tr>
                                            </table>
                                        )                                                              
                                )
                            }

                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <table style={{color: "black"}}>
            <tr>
                {
                  opponentArr.length >= 1 || !gameStarted  ? (
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
                    ) : (
                        ""
                    )
                }

                {
                    opponentArr.length < 1 ? (
                        ""
                    ) :  opponentArr.length >= 2 || !gameStarted ? (

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
                    ) : (
                        ""
                    )
                }
                {
                    opponentArr.length < 2 ? (
                        ""
                    ) : opponentArr.length >= 3 || !gameStarted ? (

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
                                        
                    ) : (
                        ""
                    )
                }
                {
                    opponentArr.length < 3 ? (
                        ""
                    ) : opponentArr.length >= 4 || !gameStarted ? (


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
                    ) : (
                        ""
                    )
                }
            </tr>
        </table>
    </>    
  );
}
