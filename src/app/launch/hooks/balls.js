'use client';

import './balls.scss'

export function Ball({number, type, isDraw}) {
    let cls = '';
    switch (type) {
        case 'red':
            cls = ' btn-danger '
            break;
        case 'blue':
            cls = ' btn-primary btn-blue-light '
            break;
        default:
            cls = ' btn-primary '
            break;
    }

    return (

        <a className={'lottey-ball rounded-circle btn m-1 ' + cls + (isDraw ? 'lottey-ball-draw position-relative' : '')}>{number}
            {isDraw && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill border border-white bi bg-success bi-check-lg"></span>
            )}
        </a>
            
    )
}

export function BlueBalls({numberList}) {
    return (
    <>
        {numberList.length > 0 && (
            <>
            {numberList.map((num, index) => (
                <Ball number={num} key={index} type="blue" isDraw={false}/>
                ))}
            </>
        )}
    </>
    )
}
export function BraveBalls({numberList}) {
    return (
    <>
        {numberList.length > 0 && (
            <>
            {numberList.map((num, index) => (
                <Ball number={num} key={index} type="brave" isDraw={false}/>
            ))}
            </>
        )}
    </>
    )
}
export function RedBalls({numberList}) {
    return (
    <>
        {numberList.length > 0 && (
            <>
            {numberList.map((num, index) => (
                <Ball number={num} key={index} type="red" isDraw={false}/>
            ))}
            </>
        )}
    </>
    )
}

export function GroupBalls({numberLists}) {
    return (
    <>
        <BraveBalls numberList={numberLists[0]}/>
        <BlueBalls numberList={numberLists[1]}/>
        <RedBalls numberList={numberLists[2]}/>
    </>
    )
}

export function DrawGroupBalls({drawNumbers}) {
    return (
    <>
        <BraveBalls numberList={drawNumbers.slice(0,6)}/>
        <RedBalls numberList={drawNumbers.slice(6)}/>
    </>
    )
}