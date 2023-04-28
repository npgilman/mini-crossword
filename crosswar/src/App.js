import './App.css';
import { useState } from 'react'

function App() {
  // set a state so that Status Board can be altered in an external function
  const [rowStatus, setRowStatus] = useState({
    row1: "☐☐☐☐☐",
    row2: "☐☐☐☐☐",
    row3: "☐☐☐☐☐",
    row4: "☐☐☐☐☐",
    row5: "☐☐☐☐☐"
  });

  // Update the status board on each input
  function UpdateStatusBoard(content, id) {
    // Correct answers for each row
    var row1Correct = "ABCDE";
    var row2Correct = "FGHIJ";
    var row3Correct = "KLMNO";
    var row4Correct = "PQRST";
    var row5Correct = "UVWXY";
  
    // split id into column and row
    var column = 0;
    var row = parseInt(id[0]);
    let upperCaseContent = content.toUpperCase();
    if (id[1] === 'a') {
      column = 1;
    } else if (id[1] === 'b') {
      column = 2;
    } else if (id[1] === 'c') {
      column = 3;
    } else if (id[1] === 'd') {
      column = 4;
    } else if (id[1] === 'e') {
      column = 5;
    }
  
    // block is the new status of passed-in letter box, defaults to orange
    // if the value of passed-in letter box is empty, block becomes white
    // if the value of passed-in letter box matches the correct value, block becomes green
    var block = '☒';

    // store the status of the passed-in letter box's entire row as an array
    // update the status of passed-in letter box to 'block'
    var tempStatusRow;

    if (upperCaseContent === "") {
      block = '☐'
    }
  
    if (row === 1) {
      if (upperCaseContent === row1Correct[column - 1]) {
        block = '☑';
      }
      tempStatusRow = rowStatus.row1.split('');
      tempStatusRow[column - 1] = block;

      // update the actual html element
      setRowStatus({
        ...rowStatus,
        row1: tempStatusRow.join('')
      });
  
    } else if (row === 2) {
      if (upperCaseContent === row2Correct[column - 1]) {
        block = '☑';
      }
      tempStatusRow = rowStatus.row2.split('');
      tempStatusRow[column - 1] = block;

      // update the actual html element
      setRowStatus({
        ...rowStatus,
        row2: tempStatusRow.join('')
      });
      
    } else if (row === 3) {
      if (upperCaseContent === row3Correct[column - 1]) {
        block = '☑';
      }
      tempStatusRow = rowStatus.row3.split('');
      tempStatusRow[column - 1] = block;

      // update the actual html element
      setRowStatus({
        ...rowStatus,
        row3: tempStatusRow.join('')
      });

    } else if (row === 4) {
      if (upperCaseContent === row4Correct[column - 1]) {
        block = '☑';
      }
      tempStatusRow = rowStatus.row4.split('');
      tempStatusRow[column - 1] = block;

      // update the actual html element
      setRowStatus({
        ...rowStatus,
        row4: tempStatusRow.join('')
      });

    } else if (row === 5) {
      if (upperCaseContent === row5Correct[column - 1]) {
        block = '☑';
      }
      tempStatusRow = rowStatus.row5.split('');
      tempStatusRow[column - 1] = block;

      // update the actual html element
      setRowStatus({
        ...rowStatus,
        row5: tempStatusRow.join('')
      });
    }
  }

  return (
    <div className="App">
      <header className="App-header">

        {/* Opponent status board */}
        <div id="opponent-board">
          <p className="opponent-row" id="opponent-row-1" >
            {rowStatus.row1}
          </p>
          <p className="opponent-row" id="opponent-row-2" >
            {rowStatus.row2}
          </p>
          <p className="opponent-row" id="opponent-row-3" >
            {rowStatus.row3}
          </p>
          <p className="opponent-row" id="opponent-row-4" >
            {rowStatus.row4}
          </p>
          <p className="opponent-row" id="opponent-row-5" >
            {rowStatus.row5}
          </p>
        </div>

        {/* Spacing between opponent board and puzzle */}
        <div>
          <br></br>
          <br></br>
        </div>
        
        {/* 5x5 grid of square input elements */}
        {/* Each box can contain a single uppercase letter (see App.css .letter-box) */}
        {/* id attribute refers to its position in the coordinate grid. Ex: row 1 column A is id="1a"*/}
        <div name="row-1">
          <input className="letter-box" id="1a" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="1b" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="1c" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="1d" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="1e" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
        </div>
        <div name="row-2">
          <input className="letter-box" id="2a" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="2b" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="2c" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="2d" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="2e" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
        </div>
        <div name="row-3">
          <input className="letter-box" id="3a" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="3b" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="3c" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="3d" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="3e" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
        </div>
        <div name="row-4">
          <input className="letter-box" id="4a" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="4b" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="4c" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="4d" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="4e" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
        </div>
        <div name="row-5">
          <input className="letter-box" id="5a" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="5b" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="5c" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="5d" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
          <input className="letter-box" id="5e" maxLength="1" onChange={(event) => UpdateStatusBoard(event.target.value, event.target.id)} />
        </div>

      </header>
    </div>
  );
}

export default App;
