import { useState } from 'react'
import usePrizePool from '@/launch/hooks/contracts/PrizePool'
import { useConfig } from 'wagmi'
import { getBlockNumber } from '@wagmi/core'
import { BlockPeriods } from '@/launch/hooks/globalVars'
import '../components/colorTheme.css'

const getStatusEl = (status) => {
    let el;
    switch (status) {
        case 'drawn':
            el = (<span className="badge text-bg-success">Drawn</span>);
            break;
        case 'rolled':
            el = (<span className="badge success-bg-subtle">Rolled</span>);
            break;
        case 'waitingDraw':
            el = (<span className="badge primary-bg-subtle">Waiting for Draw</span>);
            break;
        case 'drawSoon':
            el = (<span className="badge text-bg-primary">Draw Soon</span>);
            break;
        case 'waitingRollup':
            el = (<span className="badge warning-bg-subtle">Waiting for Rollup</span>);
            break;
        default:
            break;
    }
    return el;
}

export {
    getStatusEl
}

export function useTargetBlock() {

    const config = useConfig();

    const [allList, setAllList] = useState([])
    const [waitingDrawList, setWaitingDrawList] = useState([])
    const [drawSoonList, setDrawSoonList] = useState([])
    const [drawnList, setDrawnList] = useState([])
    const [waitingRollupList, setWaitingRollupList] = useState([])
    const [rolledList, setRolledList] = useState([])

    const { getBlockDrawStatus, getBlockCount, getBlockByIndex } = usePrizePool()

    let listStatus = {
        'allList': {
            'name': 'All Blocks',
            'data': allList
        },
        'waitingDrawList': {
            'name': 'Waiting for Draw',
            'data': waitingDrawList,
            'status': getStatusEl('waitingDraw')
        },
        'drawSoonList': {
            'name': 'Draw Soon',
            'data': drawSoonList,
            'status': getStatusEl('drawSoon')
        },
        'drawnList': {
            'name': 'Drawn Blocks',
            'data': drawnList,
            'status':  getStatusEl('drawn')
        },
        'waitingRollupList': {
            'name': 'Waiting for Roll',
            'data': waitingRollupList,
            'status': getStatusEl('waitingRollup')
        },
        'rolledList': {
            'name': 'Rolled Blocks',
            'data': rolledList,
            'status': getStatusEl('rolled')
        },

    }


    const getBlockList = async () => {
        let count = await getBlockCount();
        let list = [];
        for (let i = 0; i < count; i++) {
            list.push(await getBlockByIndex(i));
        }
        // 升序排序
        list.sort();
        return list;
    }

    const getBlockListWithStatus = async () => {
        let __allList = await getBlockList();
        let _allList = [];
        let _waitingDrawList = [];
        let _drawnList = [];
        let _waitingRollupList = [];
        let _rolledList = [];
        let _drawSoonList = [];
        let curBlockNumber = await getBlockNumber(config);

        for (let i = 0; i < __allList.length; i++) {
            let _block = __allList[i];
            let minBlock = curBlockNumber - 256n;
            let maxBlock = curBlockNumber - BlockPeriods;

            let info = {blockNumber: _block};
            let status = await getBlockDrawStatus(_block);

            if(status.isDraw){
                info.status = 'drawnList';
                _drawnList.push({...info, ...status})
            }else if(status.isRollup){
                info.status = 'rolledList';
                _rolledList.push({...info, ...status})
            }else{
                if(_block > minBlock){
                    if(_block >= maxBlock){
                        info.status = 'waitingDrawList';
                        _waitingDrawList.push({...info});
                    }else{
                        info.status = 'drawSoonList';
                        _drawSoonList.push({...info});
                    }
                }else{
                    info.status = 'waitingRollupList';
                    _waitingRollupList.push({...info})
                }
            }
  
            _allList.push({...info, ...status});
       
        }

        setAllList(_allList);
        setWaitingDrawList(_waitingDrawList);
        setWaitingRollupList(_waitingRollupList);
        setDrawnList(_drawnList);        
        setRolledList(_rolledList);
        setDrawSoonList(_drawSoonList);

        return {_allList, _waitingDrawList, _drawSoonList, _drawnList, _waitingRollupList, _rolledList};
    }



    return {
        getBlockListWithStatus,

        listStatus,
        allList,
        waitingDrawList,
        waitingRollupList,
        drawnList,
        rolledList,
        drawSoonList,
    }
}
