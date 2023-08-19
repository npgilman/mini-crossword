import React from 'react'
import { useEffect, useState } from 'react'
import Opponent from './Opponent.js'

function Loading() {
    let INCORRECT_CELL = "🟧"
    let EMPTY_CELL = "⬜"
    let CORRECT_CELL = "🟩"

    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(true);

    const load0 =
    [
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL]
    ];
    const load1 =
    [
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,CORRECT_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL]
    ];
    const load2 =
    [
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,CORRECT_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL]
    ];
    const load3 =
    [
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,CORRECT_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL]
    ];
    const load4 =
    [
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL]
    ];
    const load5 =
    [
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,CORRECT_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL]
    ];
    const load6 =
    [
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,CORRECT_CELL,CORRECT_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL]
    ];
    const load7 =
    [
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,CORRECT_CELL,CORRECT_CELL,EMPTY_CELL,EMPTY_CELL],
        [EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL,EMPTY_CELL]
    ];

    let frame=0;
    const [loadArr, setLoadArr] = useState(Array(5).fill().map(() => new Array(5).fill(EMPTY_CELL)));
    const animationFrames = [load0, load1, load2, load3, load4, load5, load6, load7];

    useEffect(() => { // timer functionality
        let interval;
        if (running) {
            interval = setInterval(() => {
                if (frame > 7) {
                    frame = 0;
                }
                setLoadArr(animationFrames[frame]);
                frame++;
            }, 110)
        }
        else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);

    }, [running]);

  return (
    <>
        <Opponent data={loadArr} />
    </>
  )
}

export default Loading