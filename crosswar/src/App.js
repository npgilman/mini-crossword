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
        {/* Each box can contain a single uppercase letter (see App.css #letter-box) */}
        <div name="row-1">
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
        </div>
        <div name="row-2">
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
        </div>
        <div name="row-3">
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
        </div>
        <div name="row-4">
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
        </div>
        <div name="row-5">
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
          <input name="MyInput" id="letter-box" maxlength="1" />
        </div>

      </header>
    </div>
  );
}

export default App;
