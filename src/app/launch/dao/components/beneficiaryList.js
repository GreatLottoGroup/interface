'use client';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Card from '@/launch/components/card'
import { glc, gleth, address, rate } from "@/launch/components/coinShow"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material'

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
            <TableContainer >
                <Table sx={{ width: '100%' }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell>Amount</TableCell>
                            {poolBalanceByEth && poolBalanceByEth > 0n && (
                                <TableCell>Amount By Eth</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {benefitList.map((item, i) => 
                        <TableRow key={i} 
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                        >
                            <TableCell>{address(item.address)}</TableCell>
                            <TableCell>
                                {item.rate == 0n ? (
                                    <Chip label="Final Benefit" color="error" size="small" />
                                ) : rate(Number(item.rate)/10**8)}
                            </TableCell>
                            <TableCell>{isEth ? gleth(item.amount) : glc(item.amount)}</TableCell>
                            {poolBalanceByEth && poolBalanceByEth > 0n && (
                                <TableCell>{gleth(benefitListByEth[i]?.amount)}</TableCell>
                            )}
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>

        </Card>

    </>

  )
}

