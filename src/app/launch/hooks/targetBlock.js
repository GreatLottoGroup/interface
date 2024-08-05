import { useConfig } from 'wagmi'
import { ServerUrl } from '@/launch/hooks/globalVars'
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
    const chainId = config.state.chainId;

    let listStatus = {
        'all': {
            'name': 'All Blocks',
        },
        'waitingDraw': {
            'name': 'Waiting for Draw',
            'status': getStatusEl('waitingDraw')
        },
        'drawSoon': {
            'name': 'Draw Soon',
            'status': getStatusEl('drawSoon')
        },
        'drawn': {
            'name': 'Drawn Blocks',
            'status':  getStatusEl('drawn')
        },
        'waitingRollup': {
            'name': 'Waiting for Roll',
            'status': getStatusEl('waitingRollup')
        },
        'rolled': {
            'name': 'Rolled Blocks',
            'status': getStatusEl('rolled')
        },

    }

    const getServerData = async (path) => {
        const res = await fetch(ServerUrl + path);
        const data = await res.json();
        console.log(data);
        return data;
    }

    const getBlockListFromServer = async (pageSize, page) => {
        let data = await getServerData('/block-list/' + chainId + '/find/all?pageSize=' + pageSize + '&page=' + page);
        return data;
    }

    const getBlockListWithStatusFromServer = async (status, pageSize, page) => {
        let data = await getServerData('/block-list/' + chainId + '/find/status/' + status +'?pageSize=' + pageSize + '&page=' + page);
        return data;
    }

    const searchBlockFromServer = async (blockNumber) => {
        let data = await getServerData('/block-list/' + chainId + '/search/' + blockNumber);
        return data;
    }

    return {
        getBlockListFromServer,
        getBlockListWithStatusFromServer,
        searchBlockFromServer,

        listStatus,
    }
}
