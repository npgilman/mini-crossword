import React from 'react'

const Clues = (props) => {
    const acrossCluesArray = Array.from(props.across);
    const downCluesArray = Array.from(props.down);
    const highlight = props.selected;
    // const row = props.row;
    // const rowIndex = props.rowIndex;

    console.log(highlight);

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