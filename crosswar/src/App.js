import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Opponent status board */}
        <div id="opponent-board">
          <p id="opponent-row">
            ⬛⬜⬜⬜⬜
          </p>
          <p id="opponent-row">
            ⬜⬜⬜⬜⬜
          </p>
          <p id="opponent-row">
            ⬜⬜⬜⬜⬜
          </p>
          <p id="opponent-row">
            ⬜⬜⬜⬜⬛
          </p>
          <p id="opponent-row">
            ⬜⬜⬜⬛⬛
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
          <input name="MyInput" class="letter-box" id="1a" maxlength="1" />
          <input name="MyInput" class="letter-box" id="1b" maxlength="1" />
          <input name="MyInput" class="letter-box" id="1c" maxlength="1" />
          <input name="MyInput" class="letter-box" id="1d" maxlength="1" />
          <input name="MyInput" class="letter-box" id="1e" maxlength="1" />
        </div>
        <div name="row-2">
          <input name="MyInput" class="letter-box" id="2a" maxlength="1" />
          <input name="MyInput" class="letter-box" id="2b" maxlength="1" />
          <input name="MyInput" class="letter-box" id="2c" maxlength="1" />
          <input name="MyInput" class="letter-box" id="2d" maxlength="1" />
          <input name="MyInput" class="letter-box" id="2e" maxlength="1" />
        </div>
        <div name="row-3">
          <input name="MyInput" class="letter-box" id="3a" maxlength="1" />
          <input name="MyInput" class="letter-box" id="3b" maxlength="1" />
          <input name="MyInput" class="letter-box" id="3c" maxlength="1" />
          <input name="MyInput" class="letter-box" id="3d" maxlength="1" />
          <input name="MyInput" class="letter-box" id="3e" maxlength="1" />
        </div>
        <div name="row-4">
          <input name="MyInput" class="letter-box" id="4a" maxlength="1" />
          <input name="MyInput" class="letter-box" id="4b" maxlength="1" />
          <input name="MyInput" class="letter-box" id="4c" maxlength="1" />
          <input name="MyInput" class="letter-box" id="4d" maxlength="1" />
          <input name="MyInput" class="letter-box" id="4e" maxlength="1" />
        </div>
        <div name="row-5">
          <input name="MyInput" class="letter-box" id="5a" maxlength="1" />
          <input name="MyInput" class="letter-box" id="5b" maxlength="1" />
          <input name="MyInput" class="letter-box" id="5c" maxlength="1" />
          <input name="MyInput" class="letter-box" id="5d" maxlength="1" />
          <input name="MyInput" class="letter-box" id="5e" maxlength="1" />
        </div>

      </header>
    </div>
  );
}

export default App;
