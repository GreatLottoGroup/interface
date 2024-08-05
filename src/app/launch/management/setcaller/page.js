'use client';

import { useState, useEffect } from 'react'
import useCallable from '@/launch/hooks/contracts/base/Callable'
import useAddress from "@/launch/hooks/address"
import Card from '@/launch/components/card'

export default function SetCaller() {

    const { GreatCoinContractAddress, GreatEthContractAddress, GuaranteePoolContractAddress, InvestmentCoinContractAddress, InvestmentEthContractAddress, DaoCoinContractAddress, PrizePoolContractAddress, GreatNftContractAddress, GreatLottoContractAddress } = useAddress();
    const { getCallers, transferCaller, isLoading, isPending } = useCallable();

    const [greatLottoCoinCaller, setGreatLottoCoinCaller] = useState([])
    const [greatLottoEthCaller, setGreatLottoEthCaller] = useState([])
    const [guaranteePoolCaller, setGuaranteePoolCaller] = useState([])
    const [investmentCoinCaller, setInvestmentCoinCaller] = useState([])
    const [investmentEthCaller, setInvestmentEthCaller] = useState([])
    const [daoCoinCaller, setDaoCoinCaller] = useState([])
    const [prizePoolCaller, setPrizePoolCaller] = useState([])
    const [greatLottoNFTCaller, setGreatLottoNFTCaller] = useState([])

    const getAllCallers = async () => {

        setGreatLottoCoinCaller(await getCallers(GreatCoinContractAddress));
        setGreatLottoEthCaller(await getCallers(GreatEthContractAddress));
        setGuaranteePoolCaller(await getCallers(GuaranteePoolContractAddress));
        setInvestmentCoinCaller(await getCallers(InvestmentCoinContractAddress));
        setInvestmentEthCaller(await getCallers(InvestmentEthContractAddress));
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
                <button type="button" disabled={!!(isLoading || isPending)} className='btn btn-primary btn-sm ms-2' onClick={()=>{
                    setCaller(addr, newCaller, setFunc)
                }}>Set Caller {(isLoading || isPending) ? '...' : ''}</button>

                <button type="button" className='btn btn-light btn-sm ms-2' onClick={async () => {
                    setFunc(await getCallers(addr))
                }}>
                    <i className='bi bi-arrow-clockwise'></i>
                </button>
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
                    <p className="card-text mb-2"><span className='fw-semibold'>GreatLottoEth Callers: </span> 
                        {showCallers(greatLottoEthCaller, GreatEthContractAddress, PrizePoolContractAddress, setGreatLottoEthCaller)}
                    </p>
                    <p className="card-text mb-2"><span className='fw-semibold'>GuaranteePool Callers: </span>
                        {showCallers(guaranteePoolCaller, GuaranteePoolContractAddress, PrizePoolContractAddress, setGuaranteePoolCaller)}
                    </p>
                    <p className="card-text mb-2"><span className='fw-semibold'>InvestmentCoin Callers: </span>
                        {showCallers(investmentCoinCaller, InvestmentCoinContractAddress, PrizePoolContractAddress, setInvestmentCoinCaller)}
                    </p>
                    <p className="card-text mb-2"><span className='fw-semibold'>InvestmentEth Callers: </span>
                        {showCallers(investmentEthCaller, InvestmentEthContractAddress, PrizePoolContractAddress, setInvestmentEthCaller)}
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

