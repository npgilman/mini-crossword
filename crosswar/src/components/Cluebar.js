import React from 'react'

const Cluebar = (props) => {
    const acrossCluesArray = Array.from(props.across);
    const downCluesArray = Array.from(props.down);
    const highlight = props.selected;

    function getClue(){
        let type = highlight[1];
        let clueNum = highlight[0];
        if (type == "a") {
            return acrossCluesArray[clueNum];
        }
        else {
            return downCluesArray[clueNum];
        }
    }

    function getSelected() {
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
        <table>
            <tr>
                <td style={{width: "6%", borderRight: "1px solid black"}}>
                    <div style={{marginLeft: "1vh", textTransform: "uppercase"}}>
                        {getSelected()}
                    </div>
                </td>
                <td style={{fontFamily: "KeplerStdRegular", width: "88%", borderRight: "1px solid black"}}>
                    <div style={{marginLeft: "1vh", fontSize: "2.2vh"}}>
                        {getClue()}
                    </div>
                </td>
                <td style={{width: "6%", textAlign: "right"}}>
                    <div style={{textAlign: "left", marginLeft: "1vh"}}>
                    0:00
                    </div>
                </td>
            </tr>
        </table>
        </>
    )
}

export default Cluebar