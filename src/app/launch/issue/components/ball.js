'use client';

import { useState, useRef } from 'react'
import { GroupBalls, BlueBalls, BraveBalls, RedBalls } from '@/launch/hooks/balls'
import { BlueCount, BlueMax, RedCount, RedMax, C  } from '@/launch/hooks/globalVars'


const noteCount = (blueBrave, blue, red) => {
    if(blueBrave.length + blue.length >= 6 && red.length >=1){
        return C(blue.length, BlueCount - blueBrave.length) * C(red.length, RedCount);
    }else{
        return 0n;
    }
}

export function sumCount(numberList) {
    let count = 0n;
    for(let i = 0; i < numberList.length; i ++){
        count += noteCount(numberList[i][0], numberList[i][1], numberList[i][2])
    }
    return count;
}

export function BallSelect({numberList, setNumberList}) {

    const [blueBraveBallList, setBlueBraveBallList] = useState([])
    const [blueBallList, setBlueBallList] = useState([])
    const [redBallList, setRedBallList] = useState([])

    const blueRandomCount = useRef(null);
    const redRandomCount = useRef(null);

    const ballSort = (list) => {
        list.sort((a,b) => {return a-b;});
        return list;
    }

    const initBlueBallList = () => {
        let items = []
        for(let i = 1; i <= BlueMax; i++) {
            let selectedStatus = 0;
            let btnClass = 'btn-outline-primary';
            if(blueBallList.includes(i)){
                selectedStatus = 1;
                btnClass = 'btn-primary btn-blue-light';
            }else if(blueBraveBallList.includes(i)){
                selectedStatus = 2;
                btnClass = 'btn-primary';
            }
            items.push(<a key={i} className={'lottey-ball rounded-circle btn m-1 ' + btnClass} onClick={() => {blueBallSelect(i, selectedStatus)}}>{i}</a>)
        }
        return items;
    } 

    const initRedBallList = () => {
        let items = []
        for(let i = 1; i <= RedMax; i++) {
            let isSelected = redBallList.includes(i);
            items.push(<a key={i} className={'lottey-ball rounded-circle btn m-1 ' + (isSelected ? 'btn-danger' : 'btn-outline-danger')} onClick={() => {redBallSelect(i, isSelected)}}>{i}</a>)
        }
        return items;
}

    const pushBallToList = (list, item) => {
        let newList = [...list]
        newList.push(item);
        newList = [...(new Set(newList))];
        ballSort(newList);
        return newList;
    }

    const getNumberList = (n) => {
        let list = [];
        for(let i = 0; i < n; i ++){
            list.push(i+1);
        }
        return list;
    }

    const blueBallSelect = (val, selectedStatus) => {
        if(selectedStatus == 0){
            setBlueBallList(pushBallToList(blueBallList, val))
        }else if(selectedStatus == 1){
            if(blueBraveBallList.length < BlueCount-1){
                setBlueBraveBallList(pushBallToList(blueBraveBallList, val))
            }
            setBlueBallList(blueBallList.filter((i) => {
                return i != val;
            }))
        }else{
            setBlueBraveBallList(blueBraveBallList.filter((i) => {
                return i != val;
            }))
        }
    }

    const redBallSelect = (val, isSelected) => {
        if(isSelected){
            setRedBallList(redBallList.filter((i) => {
                return i != val;
            }))
        }else if(redBallList.length < RedMax){
            setRedBallList(pushBallToList(redBallList, val))
        }
    }

    const addToNumberList = (item) => {
        if(noteCount(...item) > 0){
            let newList = [...numberList];
            newList.push(item)
            setNumberList(newList);

            setBlueBallList([]);
            setBlueBraveBallList([]);
            setRedBallList([]);
        }
    }

    const randomBall = () => {
        let blue = blueRandomCount.current.value;
        let red = redRandomCount.current.value;                    

        if(blue > BlueMax){
            blue = BlueMax;
            blueRandomCount.current.value = blue;
        }else if(blue < BlueCount){
            blue = BlueCount;
            blueRandomCount.current.value = blue;
        }
        if(red > RedMax){
            red = RedMax;
            redRandomCount.current.value = red;
        }else if(red < RedCount){
            red = RedCount;
            redRandomCount.current.value = red;
        }

        setBlueBraveBallList([])

        let newBlue = []
        while(newBlue.length < blue){
            let n = parseInt(Math.random() * BlueMax) + 1;
            if(!newBlue.includes(n)){
                newBlue.push(n)
            }
        }
        ballSort(newBlue);
        setBlueBallList(newBlue)

        let newRed = []
        while(newRed.length < red){
            let n = parseInt(Math.random() * RedMax) + 1;
            if(!newRed.includes(n)){
                newRed.push(n)
            }
        }
        ballSort(newRed);
        setRedBallList(newRed)

    }


    return (

    <>

        <div className='border px-3 py-3 mb-3 row'>
            <div className='col-8'>
                <div className='row my-2'>
                    <div className='col-7'>
                        <h5>Please select at least 6 blue balls and 1 red ball ~</h5>
                    </div>
                    <div className='col text-end'>
                        <a className='btn btn-outline-primary btn-sm me-3' onClick={()=>{setBlueBraveBallList([]);setBlueBallList(getNumberList(BlueMax));}}>Select All</a>
                        <a className='btn btn-outline-secondary btn-sm me-5' onClick={()=>{setBlueBraveBallList([]);setBlueBallList([]);}}>Deselect All</a>
                    </div>
                </div>
                <div>
                    {initBlueBallList()}
                </div>
            </div>

            <div className='col-4'>
                <div className='my-2 text-end'>
                    <a className='btn btn-outline-danger btn-sm me-3' onClick={()=>{setRedBallList(getNumberList(RedMax))}}>Select All</a>
                    <a className='btn btn-outline-secondary btn-sm me-5' onClick={()=>{setRedBallList([])}}>Deselect All</a>
                </div>
                <div>
                    {initRedBallList()}                   
                </div>
            </div>  
            
        </div>
        <div className='px-3 py-3 row'>
            <div className='col-4'>
                <div className="input-group mb-3">
                    <span className="input-group-text">Blue</span>
                    <input type="number" className="form-control" defaultValue={BlueCount} step="1" min={BlueCount} max={BlueMax} ref={blueRandomCount}/>
                    <span className="input-group-text">Red</span>
                    <input type="number" className="form-control" defaultValue={RedCount} step="1" min={RedCount} max={RedMax} ref={redRandomCount} />
                    <button className="btn btn-outline-secondary" type="button" onClick={()=>{randomBall()}}>Random Balls</button>
                </div>
            </div>
        </div>
        <div className='border px-3 py-3 mb-3 row'>
            
            {blueBraveBallList.length > 0 ? (
                <div className='col-3'>
                    <BraveBalls numberList={blueBraveBallList}/>
                </div>
            ) : ''}

            <div className='col'>
                <BlueBalls numberList={blueBallList}/>
            </div>

            <div className='col-3'>
                <RedBalls numberList={redBallList}/>
            </div> 

            <div className='col-2'>
                <div className='my-3'>
                    Count: {noteCount(blueBraveBallList, blueBallList, redBallList).toString()}
                </div>
                <div>
                    <button type="button" className='btn btn-outline-success' disabled={noteCount(blueBraveBallList, blueBallList, redBallList)==0n}  onClick={() => {addToNumberList([blueBraveBallList, blueBallList, redBallList])}}>Confirm</button>
                </div>
            </div> 
        </div>

    </>

    )
}

export function BallGroup({numberList, setNumberList}) {

    const removeFromNumberList = (index) => {
        setNumberList(numberList.filter((l, i) => {
            return i != index;
        }))
    }

    return (

        <div className='border px-3 py-3 mb-3 row'>
            <table className='table table-hover'>
            <tbody>
            {numberList.map((item, index) => (
                <tr key={index}>
                    <td className='col'>
                        <GroupBalls numberLists={item}/>
                    </td>
                    <td className='col-2'>
                        <div className='mb-2'>
                            Count: {noteCount(item[0], item[1], item[2]).toString()}
                        </div>
                        <div>
                            <a className='btn btn-sm btn-outline-danger' onClick={() => {removeFromNumberList(index)}}>Remove</a>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
            </table>
        </div>

    )
}