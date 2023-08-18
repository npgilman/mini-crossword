import React from 'react'
import { useState } from 'react'

function Homescreen(props) {
    const [playGameSelected, setPlayGameSelected] = useState(false);

    const joinRoom = () => {
        if(props.username !== "" && props.room !== "") { // if username and room are not empty

            const userData = {
                username: props.username,
                room: props.room
            }

            props.socket.emit("join_room", userData); // tell server to join user to room, sends a variable with entered username and room to server


            props.startGame(true); // change to game screen
        }
    }


  return (
    <>
        
        <div style={{color: "black", fontFamily:"KeplerStdRegular", marginTop: "auto", marginBottom: "auto"}}>
            {!playGameSelected ? (
                <>
                <div 
                    id="button-1" 
                    style={{marginTop: "3%", marginLeft:"8%", marginRight:"8%", marginBottom: "auto", fontSize: "5vw", fontFamily: "KeplerStdBoldCaption", textAlign: "left"}}
                    onClick={(event) => {
                        setPlayGameSelected(true);
                        props.setRoom("");
                    }}>
                    ✏️ Play Game
                </div>
                <div id="button-1" style={{marginTop: "0%", marginLeft:"8%", marginRight:"8%", marginBottom: "auto", fontSize: "5vw", fontFamily: "KeplerStdBoldCaption", textAlign: "left"}}>
                    🏆 Leaderboards
                </div>
                <div id="button-1" style={{marginTop: "0%", marginLeft:"8%", marginRight:"8%", marginBottom: "auto", fontSize: "5vw", fontFamily: "KeplerStdBoldCaption", textAlign: "left"}}>
                    👤 Profile
                </div>
                </>
            ) : (
                <div style={{
                    opacity: "1",
                    animation: "fadeIn 0.2s ease-in forwards"
                }}
                >
                    <div style={{marginTop: "1%", fontSize: "3vw"}}>
                        <div 
                            id="button-1" 
                            style={{marginTop: "0%", marginLeft:"2%", marginRight:"80%", marginBottom: "0%", fontSize: "2vw", fontFamily: "KeplerStdRegular", textAlign: "center"}}
                            onClick={(event) => {
                                setPlayGameSelected(false);
                            }}>
                            🡄 Back
                        </div>
                        <table style={{width: "50%", margin: "auto"}}>
                            <tr>
                                <td style={{padding: "0vw 1vw"}}>
                                    Name:
                                </td>
                                <td>
                                <input 
                                    type='text'
                                    maxLength="20"
                                    placeholder={props.username}
                                    style={{  
                                        border: "none",
                                        fontSize: "3vw",
                                        borderBottom: "2px solid black",
                                        width: "100%",
                                        height: "100%",
                                        padding: "1px 20px",
                                        margin: "0px 0",
                                        boxSizing: "border-box",
                                        backgroundColor: "rgba(255,255,255,0)",
                                        fontFamily: "KeplerStdRegular"
                                    }}
                                    onChange={(event) => {
                                        props.setUsername(event.target.value);
                                    }}
                                />
                                </td>
                            </tr>
                            <tr>
                                <td style={{padding: "0vw 1vw"}}>
                                    Room:
                                </td>
                                <td>
                                <input 
                                    type='text'
                                    maxLength="10"
                                    style={{  
                                        border: "none",
                                        fontSize: "3vw",
                                        borderBottom: "2px solid black",
                                        width: "100%",
                                        height: "100%",
                                        padding: "0px 20px",
                                        margin: "0px 0",
                                        boxSizing: "border-box",
                                        backgroundColor: "rgba(255,255,255,0)",
                                        fontFamily: "KeplerStdRegular",
                                    }}
                                    onChange={(event) => {
                                        props.setRoom(event.target.value);
                                    }}
                                />
                                </td>
                            </tr>
                        </table>
                        <div 
                            id="button-1" 
                            style={{marginTop: "2%", marginLeft:"25%", marginRight:"25%", marginBottom: "auto", fontSize: "3vw", fontFamily: "KeplerStdBoldCaption", textAlign: "center"}}
                            onClick={joinRoom}
                        >
                            ⚔️ Join Game
                        </div>
                    </div>
                </div>
            )
            }
        </div>
        
    </>
  )
}

export default Homescreen