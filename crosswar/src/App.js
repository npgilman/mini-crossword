import './App.css';
import Grid from './components/Grid.js';
import Homescreen from './components/Homescreen.js';
import { useState } from 'react';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001"); // Connection to server

function App() {
  const [gameScreen, setGameScreen] = useState(false);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

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
            <Homescreen socket={socket} startGame={setGameScreen} username={username} setUsername={setUsername} room={room} setRoom={setRoom}/>
          ) : (
            <Grid socket={socket} username={username} room={room} setGameScreen={setGameScreen}/>
          )
          }
        </div>  
      </header>
    </div>
  );
}

export default App;
