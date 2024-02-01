
import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'


export default function useCurrentBlock() {

    const publicClient = usePublicClient()

    const [curBlock, setCurBlock] = useState({})

    const setCurrentBlock = async () => {
        const curBlockNumber = await publicClient.getBlockNumber()

        const cBlock = await publicClient.getBlock({
            blockNumber: curBlockNumber
        })

        setCurBlock(cBlock);
    }

    useEffect(()=>{

        setCurrentBlock()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[publicClient])



    return {
        currentBlock: curBlock,
        setCurrentBlock
    }

}