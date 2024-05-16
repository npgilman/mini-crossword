import React from 'react'
import Grid from './Grid.js';

const Scoreboard = (props) => {

    const winners = Array.from(props.winner);

    function test() {
        props.winner.map((win) => {
            console.log(win.username);
        });
    }

  return (
    <>
    <div style={{fontFamily: "KeplerStdRegular", textAlign: "center"}}><b>Crossword Complete!</b></div>
    <div style={{fontFamily: "KeplerStdRegular", textAlign: "left", padding:"0vw 2vw"}}>Scoreboard</div>
    <ol style={{textAlign: "left"}}>
    <div>{props.winner.map((win) => {
        return <li>{win.username} - {Math.floor((win.time/60000) % 60)}:{("0" + Math.floor((win.time/1000) % 60).toString()).slice(-2)}</li>
    })}</div>
    </ol>
    </>
  )
}

export default Scoreboard