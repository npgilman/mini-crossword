import './App.css';
import Grid from './components/Grid.js';
import Homescreen from './components/Homescreen.js';
import { useState } from 'react';


function App() {
  const [gameScreen, setGameScreen] = useState(false);


  return (
    <div className="App">
      <header className="App-header">
        <div className="newspaper">
          <div 
            className='header'
            onClick={(event) => {
              if (gameScreen) { // clicking "CrossWar!" takes user to HomePage
                setGameScreen(!gameScreen);
              }
            }}>
            CrossWar!
          </div>
          {!gameScreen ? ( // Do not show game if user has not started game
            <Homescreen startGame={setGameScreen}/>
          ) : (
            <Grid />
          )
          }
        </div>  
      </header>
    </div>
  );
}

export default App;
