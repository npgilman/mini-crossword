import './App.css';
import CrosswarNav from './components/CrosswarNav.js';
import Grid from './components/Grid.js';
import Opponent from './components/Opponent.js';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="newspaper">
          <div className='header'>
            CrossWar!
          </div>
        <div style={{padding: "1vh", height: "42vh", overflow: "hidden"}}>
          <div>
            <table style={{color: "black", height: "1px", overflow: "scroll"}}>
            <tr>
              <td colSpan="2" id="cluebar"></td>
            </tr>
            <tr style={{height: "60px"}}>
              <td style={{width: "2vh", height: "10px", overflow: "hidden", verticalAlign: "top"}}>
                <Grid />
              </td>
              <td style={{width: "65%", height: "10px", overflow: "hidden", verticalAlign: "top"}}>
                <table style={{height: "100%"}}>
                  <tr id='cluebox'>

                  </tr>
                </table>
              </td>
            </tr>
            </table>
          </div>

        </div>
        <table style={{color: "black"}}>
              <tr>
                <td style={{width: "25%", fontFamily: "RansomBlancoZero"}}>
                  <div class="papers" style={{transform: "rotateZ(6deg) translateY(-1em) translateX(-2em)"}}>
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "-20px"}}/> 
                    Opponent 1
                    <div id="opponent1">

                    </div>
                  </div>
                </td >
                <td style={{width: "25%", fontFamily: "RansomBlancoZero"} }>
                  <div class="papers" style={{transform: "rotateZ(-5deg) translateY(0.5em) translateX(-0.5em)"}}>
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "20px", filter: "hue-rotate(100deg)"}}/> 
                    Opponent 2
                    <div id="opponent2">

                    </div>
                  </div>
                </td>
                <td style={{width: "25%", fontFamily: "RansomBlancoZero"}}>
                  <div class="papers" style={{transform: "rotateZ(7deg) translateY(-0.5em) translateX(1em)"}}>
                    Opponent 3<img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "20px", filter: "hue-rotate(210deg)"}}/> 
                    <div id="opponent3">

                    </div>
                  </div>
                </td>
                <td style={{width: "25%", fontFamily: "RansomBlancoZero"}}>
                  <div class="papers" style={{transform: "rotateZ(-5deg) translateY(0.9em) translateX(1.5em)"}}>
                    <img src="https://www.pngall.com/wp-content/uploads/2/Drawing-Pin.png" style={{height: "35px", padding: "0px", marginLeft: "-50px" , filter: "hue-rotate(290deg)"}}/> 
                    Opponent 4
                    
                    <div id="opponent4">

                    </div>
                  </div>
                </td>
              </tr>
            </table>
      </div>
       
        
        
      </header>
    </div>
  );
}

export default App;
