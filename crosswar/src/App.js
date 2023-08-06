import './App.css';
import CrosswarNav from './components/CrosswarNav.js';
import Grid from './components/Grid.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* 'CrosswarNav' component contains the navbar */}
      <CrosswarNav />
      <table>
        <tr>
          <td style={{width: "25%"}}>
            <table>
              <tr>
                <td>
                  Player 1 
                </td>
              </tr>
              <tr>
                <td>
                  Player 2
                </td>
              </tr>
            </table>
          </td>
          <td style={{width: "50%"}}> 
            {/* ClueBar Goes Here */}
            Cluebar 
            <br></br>
            <br></br>
            {/* 'Grid' component contains the crossword grid and status board */}
            <Grid />
            <br></br>
            <table style={{width: "100%"}}>
              <tr>
                <td>
                  {/* Across Clues Go Here*/}
                  Across
                  <br>
                  </br>
                  <br>
                  </br>
                  <br>
                  </br>
                  <br>
                  </br>
                  <br>
                  </br>
                  <br>
                  </br>
                  <br>
                  </br>
                  <br>
                  </br>
                </td>
                <td>
                  {/* Down Clues Go Here */}
                  Down
                </td>
              </tr>
            </table>
          </td>
          <td style={{width: "25%"}}>
            <table>
              <tr>
                <td>
                  Player 3
                </td>
              </tr>
              <tr>
                <td>
                  Player 4
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
