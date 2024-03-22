'use client';

import  useCoin  from '@/launch/hooks/coin'

import { shortAddress, formatAmount, parseAmount } from '@/launch/hooks/globalVars'
import useAddress from "@/launch/hooks/address"
import WriteBtn from '@/launch/components/writeBtn'

export function usePayCoin(payCoin, setPayCoin) {

    const { getAllowance, increaseAllowance, getBalance, error, setError, isLoading, isSuccess, isPending, isConfirm } = useCoin();
    const { getApproveSpender } = useAddress();

    const updatePayCoin = async (t) => {
        let allowance, balance;
        let newPayCoin = {...payCoin};

        if(!t || t == 'allowance'){
            allowance = await getAllowance(payCoin.address, getApproveSpender(payCoin.name));
            newPayCoin.allowance = allowance;
        }
        if(!t || t == 'balance'){
            balance = await getBalance(payCoin.address);
            newPayCoin.balance = balance
        }

        setPayCoin(newPayCoin)
        return [balance, allowance]
    }

    const payExecute = async (payAction, payPermitAction, payAmount) => {

        payAmount = parseAmount(payAmount, payCoin.decimals);

        // balance
        if(payCoin.balance < payAmount){
            console.log('balance is not enough')
            return false;
        }

        let txPay;
        if(payCoin.allowance >= payAmount){
            // pay
            txPay = await payAction(payCoin, payAmount);
        }else{
            console.log(payCoin.isPermit)
            if(payCoin.isPermit){
                // permit
                // pay by permit
                txPay = await payPermitAction(payCoin, payAmount)
            }else{
                // allowance
                let tx = await increaseAllowance(payCoin.address, getApproveSpender(payCoin.name), payCoin.balance)
                if(tx){
                    let [, _a] = await updatePayCoin('allowance')
                    if(_a < payAmount){
                        return false;
                    }    
                }else{
                    return false;
                }
                // pay
                txPay = await payAction(payCoin, payAmount);
            }
        }

        if(txPay){
            await updatePayCoin()
        }else{
            console.log('error---');
        }

        return txPay;
    }


    return {
        updatePayCoin,
        payExecute, 

        error,
        setError,
        isLoading,
        isSuccess,
        isPending,
        isConfirm
    }
}

export function PayCoin({payCoin, setPayCoin, setCurrentBlock}) {

    const { getAllowance, increaseAllowance, getBalance, isLoading, isPending } = useCoin();
    const { getApproveSpender, CoinList } = useAddress();

    const changeCoin = async (coin) => {
        if(!coin){
            setPayCoin({});
        }else{
            let coinData = {...CoinList[coin]}
            coinData.name = coin

            let allowance = await getAllowance(coinData.address, getApproveSpender(coin))

            coinData.allowance = allowance

            let balance = await getBalance(coinData.address)
            coinData.balance = balance

            setPayCoin(coinData)
        }
    }

    const increaseCoinAllowance = async () => {
        let val = payCoin.balance;
        if(payCoin.name == 'USDT' && payCoin.allowance > 0n){
            val = 0n;
        }
        let approveSpender = getApproveSpender(payCoin.name);
        let tx = await increaseAllowance(payCoin.address, approveSpender, val)
        if(tx){
            let newCoin = {...payCoin};
            newCoin.allowance = await getAllowance(payCoin.address, approveSpender)
            setPayCoin(newCoin) 
            setCurrentBlock()
        }
    }

    return (
        <>
            <div className='col me-3'>
                <select className="form-select form-select-lg mb-3" onChange={(e) =>{changeCoin(e.target.value)}}>
                    <option value=''>Select Coin...</option>
                    {Object.keys(CoinList).map( name =>
                        <option key={name} value={name}>{name}</option>
                    )}
                </select>
                {(payCoin.name == 'DAI' || payCoin.name == 'USDC' || payCoin.name == 'GLC') && (payCoin?.allowance < payCoin?.balance) && (
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={payCoin?.isPermit} id="permitPayCheck" onChange={(e)=>{
                            let coinData = {...payCoin}
                            coinData.isPermit = e.target.checked
                            console.log(coinData)
                            setPayCoin(coinData)
                        }}/>
                        <label className="form-check-label" htmlFor="permitPayCheck">Permit Pay</label>
                    </div>
                )}
            </div>
            <div className='col-6 overflow-hidden'>
                <div>Pay Coin: {payCoin?.name}</div>
                <div>Coin Address: {shortAddress(payCoin?.address)}</div>
                <div>Balance: {formatAmount(payCoin?.balance, payCoin?.decimals)}</div>
                <div>Allowance: {formatAmount(((payCoin?.allowance > payCoin?.balance) ? payCoin?.balance : payCoin?.allowance), payCoin?.decimals)}
                    {(payCoin?.allowance < payCoin?.balance) && (
                        <WriteBtn action={increaseCoinAllowance} isLoading={isLoading || isPending} className="btn-outline-success btn-sm ms-4"> Increase Allowance </WriteBtn>
                    )}
                </div>
            </div>
        </>
    )

}