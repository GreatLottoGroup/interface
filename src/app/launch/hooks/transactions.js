import { useState, useEffect } from 'react';
import { useAccount, useConfig } from 'wagmi'
import { waitForTransactionReceipt, getTransactionReceipt } from '@wagmi/core'
import { errorHandle } from '@/launch/hooks/globalVars'

const maxTrans = 10;

export function useTransactions() {

    const config = useConfig();
    const { address: accountAddress } = useAccount();
    const chainId = config.state.chainId

    const localStorageKey = ['global-transactions', chainId, accountAddress].join('-');
    console.log(localStorageKey)
    const [transactions, setTransactions] = useState([]);

    const _errorHandle = (err) => {
        console.log(errorHandle(err))
    }

    const setTransaction = (trans, translList, isLocal) => {
        let hash = trans.hash;
        if(isLocal){
            translList = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
        }else{
            translList = translList || transactions
        }
        if(!hash) return;
        console.log(translList)
        let _translList = [...translList];

        let transIndex = _findTransIndex(_translList, hash);
        if(transIndex > -1){
            // 修改
            _translList[transIndex] = trans
        }else{
            // 新增
            if(_translList.length >= maxTrans){
                _translList.shift();
            }
            _translList.push(trans);
        }

        _setTransaction(_translList)
    }  

    const _setTransaction = (translList) => {
        console.log(translList);
        setTransactions(translList);
        localStorage.setItem(localStorageKey, JSON.stringify(translList));
    }

    const _findTransIndex = (list, hash) => {
        let index = -1;
        for(let i = 0; i < list.length; i++){
            if(list[i].hash == hash){
                index = i;
                break;
            }
        }
        return index;
    }

    const hasPendingTrans = (list) => {
        list = list || transactions;
        let index = -1;
        for(let i = 0; i < list.length; i++){
            if(list[i].status == 'pending'){
                index = i;
                break;
            }
        }
        return index;
    }
    
    const getTransaction = (hash) => {
        if(!hash) return;
        return transactions.find(t => t.hash == hash);
    }

    const delTransaction = () => {
        _setTransaction([]);
    }

    const checkTransactions = async (list) => {
        list = list || transactions;
        for(let i = 0; i < list.length; i++){
            if(list[i].status == 'pending'){
                let tx = list[i].hash;
                let transactionReceipt;
                try {
                    transactionReceipt = await waitForTransactionReceipt(config, {hash: tx});
                } catch (err) {
                    //_errorHandle(err);
                    transactionReceipt = await getTransactionReceipt(config, {hash: tx})
                }
                console.log(transactionReceipt)

                setTransaction({
                    ...list[i],
                    status: transactionReceipt.status
                }, list);
            }
        }

    }

    useEffect(() => {

        let trans = localStorage.getItem(localStorageKey);

        if(!trans){
            trans = []
        }else{
            trans = JSON.parse(trans)
        }

        setTransactions(trans);
        checkTransactions(trans);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress]);

    return {
        transactions,
        getTransaction,
        setTransaction,
        checkTransactions,
        hasPendingTrans,
        delTransaction,
    }

}