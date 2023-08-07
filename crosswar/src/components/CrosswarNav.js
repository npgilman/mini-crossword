import React from 'react'

export default function CrosswarNav() {
  return (
    <>
        <div id="CrossNav">
          <table style={{width: "100%", height: "100%"}}>
            <tr>
              <td style={{width: "50%", fontFamily: "Kingthings", fontSize: "4vh"}}>
                Cr0Ss-War!
              </td>
              <td className='clickable' style={{width: "12.5%", fontFamily: "Chomsky", fontSize: "4vh"}}>
                <a href="#">Join Game</a>
              </td>
              <td className='clickable' style={{width: "12.5%", fontFamily: "Chomsky", fontSize: "4vh"}}>
                <a href="#">Host Game</a>
              </td>
              <td className='clickable' style={{width: "12.5%", fontFamily: "Chomsky", fontSize: "4vh"}}>
                <a href="#">Leaderboards</a>
              </td>
              <td className='clickable' style={{width: "12.5%", fontFamily: "Chomsky", fontSize: "4vh"}}>
                <a href="#">Profile</a>
              </td>
            </tr>
          </table>
        </div>
    </>
  )
}
