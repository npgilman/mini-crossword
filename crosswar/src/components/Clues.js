import React from 'react'
import Grid from './Grid.js';

const Clues = (props) => {
    const acrossCluesArray = Array.from(props.across);
    const downCluesArray = Array.from(props.down);
    const highlight = props.selected;
    // const row = props.row;
    // const rowIndex = props.rowIndex;

    console.log(highlight);

    function handleClueClick(e, type, index) {
        props.handleClueClick(e, type, index);
    }

  return (
    <>
    <tr>
        <td style={{width : "50%", verticalAlign: "top", border: "none"}}>
            <div id="Across" style={{marginBottom: "0px"}}>
                {/* Across Clues */}
                Across <hr></hr>
                {acrossCluesArray.map((row, index) => (
                    <div 
                        className={highlight === (index + "a") ? 'clue highlight' : 'clue'}
                        onClick={(e) => handleClueClick(e, "a", index)}
                    >
                        {index + 1}. {acrossCluesArray[index]}
                    </div>
                ))}
            </div>
        </td>
        <td style={{width : "50%", height: "100%", verticalAlign: "top", border: "none"}}>
            <div id="Down" style={{height: "100%",}}>
                {/* Down Clues */}
                Down <hr></hr>
                {downCluesArray.map((row, index) => (
                    <div 
                        className={highlight === (index + "d") ? 'clue highlight' : 'clue'}
                        onClick={(e) => handleClueClick(e, "d", index)}
                    >
                        {index + 1}. {downCluesArray[index]}
                    </div>
                ))}
            </div>
        </td>
    </tr>
    </>
  )
}

export default Clues