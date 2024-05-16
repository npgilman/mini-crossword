import React from 'react'
import { useEffect, useState } from 'react';

const Cluebar = (props) => {
    const acrossCluesArray = Array.from(props.across);
    const downCluesArray = Array.from(props.down);
    const highlight = props.selected;


    //const [time, setTime] = useState(0);
    //const [running, setRunning] = useState(true);
    const running = props.runTimer;
    const time = props.time;
    const setTime= props.setTime;

    useEffect(() => { // timer functionality
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10)
        }
        else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);

    }, [running]);

    
    function getClue() { // return string of selected clue
        let type = highlight[1];
        let clueNum = highlight[0];
        if (type == "a") {
            return acrossCluesArray[clueNum];
        }
        else {
            return downCluesArray[clueNum];
        }
    }

    function getSelected() { // return number of clue
        if (highlight == 0) {
            return " ";
        }
        else {
            let number = parseInt(highlight[0]) + 1;
            let letter = highlight[1];
            return number+letter;
        }
    }

    return(
        <>
        <table style={{cursor: "default", padding: 0}}>
            <tr>
                <td style={{width: "6%", borderRight: "1px solid black", backgroundColor: "#83c7fa", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px"}}>
                    <div style={{marginLeft: "1vh", textTransform: "uppercase"}}>
                        {/* Selected clue's number and type (across or down), ex: "1A" */}
                        {getSelected()}
                    </div>
                </td>
                <td style={{fontFamily: "KeplerStdRegular", width: "88%", borderRight: "1px solid black", background: "linear-gradient(to left, rgba(255,255,255,0), rgba(167, 216, 253, 0.4) , #a7d8fd)"}}>
                    <div style={{marginLeft: "1vh", fontSize: "2.2vh"}}>
                        {/* Selected clue */}
                        {getClue()}
                    </div>
                </td>
                <td style={{width: "6%", textAlign: "right"}}>
                    <div style={{textAlign: "left", marginLeft: "1vh"}}>
                        {/* Time elapsed in minutes:seconds */}
                    {Math.floor((time/60000) % 60)}:{("0" + Math.floor((time/1000) % 60).toString()).slice(-2)}
                    </div>
                </td>
            </tr>
        </table>
        </>
    )
}

export default Cluebar