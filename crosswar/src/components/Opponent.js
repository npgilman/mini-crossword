import React from 'react'

const Opponent = (props) => {
    const statusBoard = Array.from(props.data);
  return (
    <>
    <div>
        <div className="opponent-grid">
      {statusBoard.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div key={colIndex} className="opponent-row">
                {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
    <br></br>
    </div>
    </>
  )
}

export default Opponent
