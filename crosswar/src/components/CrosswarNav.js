import React from 'react'

export default function CrosswarNav() {
  return (
    <>
        <div id="CrossNav">
          <table style={{width: "100%", height: "100%"}}>
            <tr>
              <td style={{width: "35%"}}>
                CrossWar
              </td>
              <td className='clickable'>
                <a href="#">Join Game</a>
              </td>
              <td className='clickable'>
                <a href="#">Host Game</a>
              </td>
              <td className='clickable'>
                <a href="#">Leaderboards</a>
              </td>
              <td className='clickable'>
                <a href="#">Profile</a>
              </td>
            </tr>
          </table>
        </div>
    </>
  )
}
