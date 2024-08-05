'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Card from '@/launch/components/card'
import { glc, gleth } from "@/launch/components/coinShow"

export default function BeneficiaryList({poolBalance, poolBalanceByEth, isEth,  useGovCoin, finalBenefitAddress, currentBlock}) {

    const { address: accountAddress } = useAccount()

    const [benefitList, setBenefitList] = useState([])
    const [benefitListByEth, setBenefitListByEth] = useState([])

    const { getBeneficiaryListData } = useGovCoin()

    const getBenefitList = async () => {

        let list = await getBeneficiaryListData(poolBalance, finalBenefitAddress);
        setBenefitList(list);

        if(poolBalanceByEth && poolBalanceByEth > 0n){
            let listByEth =  await getBeneficiaryListData(poolBalance, finalBenefitAddress);
            console.log(listByEth);
            setBenefitListByEth(listByEth);
        }

    }


    useEffect(()=>{

        console.log('useEffect~')
        getBenefitList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, poolBalance])

  return (
    <>
        <Card title="Beneficiary List" reload={getBenefitList}>
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        {poolBalanceByEth && poolBalanceByEth > 0n && (
                            <th>Amount By Eth</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                {benefitList.map((item, i) => 
                    <tr key={i}>
                        <td>{item.address}</td>
                        <td>{item.rate == 0n ? (
                            <span className="badge text-bg-danger">Final Benefit</span>
                        ) : Number(item.rate)/10**8 + ' %'}</td>
                        <td>{isEth ? gleth(item.amount) : glc(item.amount)}</td>
                        {poolBalanceByEth && poolBalanceByEth > 0n && (
                            <td>{gleth(benefitListByEth[i]?.amount)}</td>
                        )}
                    </tr>
                )}
                </tbody>
            </table>

        </Card>

    </>

  )
}

