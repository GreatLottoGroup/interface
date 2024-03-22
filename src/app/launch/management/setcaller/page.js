'use client';

import { useState, useEffect } from 'react'
import useCallable from '@/launch/hooks/callable'
import useAddress from "@/launch/hooks/address"
import Card from '@/launch/components/card'

export default function SetCaller() {

    const { GreatCoinContractAddress, GuaranteePoolContractAddress, InvestmentCoinContractAddress, DaoCoinContractAddress, PrizePoolContractAddress, GreatNftContractAddress, GreatLottoContractAddress } = useAddress();
    const { getCallers, transferCaller, isLoading } = useCallable();

    const [greatLottoCoinCaller, setGreatLottoCoinCaller] = useState([])
    const [guaranteePoolCaller, setGuaranteePoolCaller] = useState([])
    const [investmentCoinCaller, setInvestmentCoinCaller] = useState([])
    const [daoCoinCaller, setDaoCoinCaller] = useState([])
    const [prizePoolCaller, setPrizePoolCaller] = useState([])
    const [greatLottoNFTCaller, setGreatLottoNFTCaller] = useState([])

    const getAllCallers = async () => {

        setGreatLottoCoinCaller(await getCallers(GreatCoinContractAddress));
        setGuaranteePoolCaller(await getCallers(GuaranteePoolContractAddress));
        setInvestmentCoinCaller(await getCallers(InvestmentCoinContractAddress));
        setDaoCoinCaller(await getCallers(DaoCoinContractAddress));
        setPrizePoolCaller(await getCallers(PrizePoolContractAddress));
        setGreatLottoNFTCaller(await getCallers(GreatNftContractAddress));

    }

    const showCallers = (callers, addr, newCaller, setFunc) => {
        if(callers.length > 0){
            return callers.map((c ,i) => 
                <span className='ps-2 pe-1' key={i}>{c}</span>
            )
        }else{
            return (
            <>
                <button type="button" disabled={!!isLoading} className='btn btn-primary btn-sm ms-2' onClick={()=>{
                    setCaller(addr, newCaller, setFunc)
                }}>Set Caller {isLoading ? '...' : ''}</button>
            </>
            )
        }

    }

    const setCaller = async (addr, newCaller, setFunc) => {
        await transferCaller(addr, newCaller);
        setFunc(await getCallers(addr))
    }

    useEffect(()=>{

        console.log('useEffect~')
        getAllCallers()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
        <div className='mb-3 row'>
            <div className='col'>
                <Card title="Set Caller" reload={getAllCallers}>
                    <p className="card-text mb-2"><span className='fw-semibold'>GreatLottoCoin Callers: </span> 
                        {showCallers(greatLottoCoinCaller, GreatCoinContractAddress, PrizePoolContractAddress, setGreatLottoCoinCaller)}
                    </p>
                    <p className="card-text mb-2"><span className='fw-semibold'>GuaranteePool Callers: </span>
                        {showCallers(guaranteePoolCaller, GuaranteePoolContractAddress, PrizePoolContractAddress, setGuaranteePoolCaller)}
                    </p>
                    <p className="card-text mb-2"><span className='fw-semibold'>InvestmentCoin Callers: </span>
                        {showCallers(investmentCoinCaller, InvestmentCoinContractAddress, PrizePoolContractAddress, setInvestmentCoinCaller)}
                    </p>
                    <p className="card-text mb-2"><span className='fw-semibold'>DaoCoin Callers: </span>
                        {showCallers(daoCoinCaller, DaoCoinContractAddress, PrizePoolContractAddress, setDaoCoinCaller)}
                    </p>
                    <p className="card-text mb-2"><span className='fw-semibold'>PrizePool Callers: </span>
                        {showCallers(prizePoolCaller, PrizePoolContractAddress, GreatLottoContractAddress, setPrizePoolCaller)}
                    </p>
                    <p className="card-text mb-2"><span className='fw-semibold'>GreatLottoNFT Callers: </span>
                        {showCallers(greatLottoNFTCaller, GreatNftContractAddress, GreatLottoContractAddress, setGreatLottoNFTCaller)}
                    </p>

                </Card>

            </div>
        </div>
    </>

  )
}

