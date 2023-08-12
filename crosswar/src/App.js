import './App.css';
import CrosswarNav from './components/CrosswarNav.js';
import Grid from './components/Grid.js';
import Opponent from './components/Opponent.js';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* 'CrosswarNav' component contains the navbar */}
      <CrosswarNav />
      <table >
        <tr>
          <td style={{width: "20%"}}>
            <table style={{width: "100%"}}>
              <tr>
                <td id="opponent1">
                  Opponent 1 
                </td>
              </tr>
              <tr>
                <td id="opponent3">
                  Opponent 3
                </td>
              </tr>
            </table>
          </td>
          <td style={{width: "60%"}}> 
            {/* ClueBar Goes Here */}
            Cluebar 
            <br></br>
            <br></br>
            {/* 'Grid' component contains the crossword grid and status board */}
            <Grid />
            <br></br>
            <table style={{width: "99%", marginLeft: "auto", marginRight: "auto", border: "none"}} id="cluebox">
              {/* Clues Go Here */}

            </table>
          </td>
          <td style={{width: "20%"}}>
            <table style={{width: "100%"}}>
              <tr>
                <td id="opponent2">
                  Opponent 2
                </td>
              </tr>
              <tr>
                <td id="opponent4">
                  Opponent 4
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
       
        
        
      </header>
    </div>
  );
}

export default App;
