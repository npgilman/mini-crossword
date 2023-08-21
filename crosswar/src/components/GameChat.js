import React from 'react'
import { useState } from 'react';

function GameChat(props) {

    const [currMessage, setCurrMessage] = useState("");

    const sendMessage = () => { // Called when user sends message in a room
        if (currMessage != "") {
            console.log("sending message");
            const message = props.username + ": " + currMessage
            // setCurrMessage(props.username + ": " + currMessage);
            const data = {
                message: message,
                room: props.room
            }
            props.socket.emit("send_message", data);
            setCurrMessage("");
        }
    }

  return (
    <>
        <div style={{position: "relative", border: "1px solid black", borderRadius: "10px", width: "80%", height: "95%", backgroundColor: "#313338", marginLeft:"auto", marginRight: "auto", color: "white"}}>
            <div style={{fontFamily: "KeplerStdRegular", position:"absolute", textAlign:"center", width: "100%", height: "3vh", fontSize:"3vh"}}>
                Room: {props.room}
            </div>
            <div style={{border: "0px solid black", position:"absolute", marginTop:"3.2vh", marginBottom:"90%", height: "70%", width: "90%", marginLeft: "5%", marginRight: "5%",
                        fontFamily: "KeplerStdRegular", overflowY: "scroll", textAlign: "left", fontSize: "2.5vh"}}>
                {
                    props.chatArr.map((message) => {
                        return (<div>{message}</div>)
                    })
                } 
            </div>
            <div 
                style={{border: "0px solid black", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", bottom: "0", position: "absolute", width: "100%", 
                        backgroundColor: "#313338"}}
            >
                <input type="text" placeholder='Say something...'
                    style={{height: "500%", width: "90%", fontFamily: "KeplerStdRegular", fontSize: "2.5vh", backgroundColor: "#383a40", 
                            color: "white", border: "none", padding: "7px", borderRadius: "5px", marginBottom:"1vh"
                        }
                        } 
                        value={currMessage}
                        onChange={(event) => {
                            setCurrMessage(event.target.value);
                        }}
                        onKeyDownCapture={(event) => event.key === "Enter" && sendMessage()}
                />
            </div>
        </div>
    </>
  )
}

export default GameChat