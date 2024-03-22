
import { useState, useEffect } from 'react'
import { useBlockNumber, useConfig } from 'wagmi'
import { getBlock } from '@wagmi/core'


export default function useCurrentBlock() {

    const { data: blockNumber } = useBlockNumber({ watch: true }) 

    const config = useConfig();

    const [curBlock, setCurBlock] = useState({})

    const setCurrentBlock = async () => {
        const cBlock = await getBlock(config)
        setCurBlock(cBlock);
    }
    
    useEffect(()=>{

        // 10个块自动更新
        if (!blockNumber || !curBlock.number || blockNumber % 10n === 0n) {
            setCurrentBlock()
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[blockNumber])

    return {
        currentBlock: curBlock,
        setCurrentBlock
    }

}