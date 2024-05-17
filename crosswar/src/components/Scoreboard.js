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
    <table>
      <tr>
        <td>
        <div style={{fontFamily: "KeplerStdRegular", textAlign: "left", padding:"0vw 2vw"}}><u>Scoreboard</u></div>
    <ol style={{textAlign: "left", margin:"0vw"}}>
    <div>{props.winner.map((win) => {
        return <li style={{fontFamily:"KeplerStdRegular"}}>{win.username} - {Math.floor((win.time/60000) % 60)}:{("0" + Math.floor((win.time/1000) % 60).toString()).slice(-2)}</li>
    })}</div>
    </ol>
        </td>
        <td>
          {
            props.showPlay ? (
              <div style={{width: "100%", height: "100%", position: "relative", top:"0", left: "0", backgroundColor: "rgba(0,0,0,0.0)"}}>
              <div id="button-1" style={{marginTop: "1vh", marginLeft:"0vw", marginRight:"0vw", marginBottom: "auto", zIndex: "1" ,  fontSize: "3vw", fontFamily: "KeplerStdBoldCaption", textAlign: "left", backgroundColor: "white", boxShadow: "2px 2px 2px 3px", padding: "20px 10px", textAlign: "center"}}
              onClick={props.playClick}>
                 Play Again!
              </div>
              </div>
            ) : (
              ""
            )
          }

        </td>
      </tr>
    </table>


    
    </>
  )
}

export default Scoreboard