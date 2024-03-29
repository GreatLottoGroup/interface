'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatAmount } from '@/launch/hooks/globalVars'
import Card from '@/launch/components/card'

export default function BeneficiaryList({poolBalance, useBenefit, finalBenefitAddress, currentBlock}) {

    const { address: accountAddress } = useAccount()

    const [benefitList, setBenefitList] = useState([])

    const { getBeneficiaryListData } = useBenefit()

    const getBenefitList = async () => {

        let list = await getBeneficiaryListData(poolBalance, finalBenefitAddress)

        setBenefitList(list)

        return list;
    }


    useEffect(()=>{

        console.log('useEffect~')
        getBenefitList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, poolBalance, currentBlock])

  return (
    <>
        <Card title="Beneficiary List" reload={getBenefitList}>
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Address</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                {benefitList.map((item, i) => 
                    <tr key={i}>
                        <td>{item.address}</td>
                        <td>{item.rate == 0n ? (
                            <span className="badge text-bg-danger">Final Benefit</span>
                        ) : Number(item.rate)/10**8 + ' %'}</td>
                        <td>{formatAmount(item.amount)} GLC</td>
                    </tr>
                )}
                </tbody>
            </table>

        </Card>

    </>

  )
}

