import React from 'react'

export default function CrosswarNav() {
  return (
    <>
        <div id="CrossNav">
            <ul id="WebsiteTitle">
                <li>CrossWar</li>
            </ul>
            <ul className='clickable'>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Leaderboards</a></li>
                <li><a href="#">Host Game</a></li>
                <li><a href="#"> Join Game</a></li>
            </ul>
        </div>
    </>
  )
}
