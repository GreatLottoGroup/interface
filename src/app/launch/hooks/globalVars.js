
import { isAddressEqual, formatUnits, parseUnits, BaseError, ContractFunctionRevertedError, ContractFunctionExecutionError, CallExecutionError  } from 'viem'  

const BlockPeriods = 30n;
const PerBlockTime = 12n;

const BlueMax = 46;
const BlueCount = 6;
const RedMax = 16;
const RedCount = 1;


const GreatCoinDecimals = 18
const DaoCoinDecimals = 18
const InvestmentCoinDecimals = 18

const DaoExecutorRewardRate = 5n
const InvestmentExecutorRewardRate = 5n

const DaoCoinMaxSupply = 10n ** 8n * 10n ** 18n
const InvestmentCoinMaxSupply = 10n ** 8n * 10n ** 18n

const InvestmentMinDepositAssets = 10000
const InvestmentMinRedeemShares = 10000

const chains = {
    "31337": "hardhat",
    "1": "mainnet",
    "17000": "holesky",
    "11155111": "sepolia"
}

const OwnerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS
const FinalBenefitAddress = process.env.NEXT_PUBLIC_BENEFIT_ADDRESS

const CoinList = {
    'GLC': {
        decimals: GreatCoinDecimals,
        isPermit: true
    },
    'DAI': {
        decimals: 18,
        isPermit: true
    },
    'USDC': {
        decimals: 6,
        isPermit: true
    },
    'USDT': {
        decimals: 6
    }
}
const F = function(n){
    if(n < 1){return 1;}
    var result = 1;
    for(var i = 1; i <= n; i++){
        result = result * i;
    }
    return result;
};

const C = function(n, m){
    if(n < m){return 0;}
    return F(n)/(F(n-m) * F(m));
};

const getDeadline = () => {
    return parseInt(new Date().getTime()/1000 + Number(PerBlockTime) * 5);
}

const shortAddress = (address) => {
    return address ? (address.slice(0,4) + '...' + address.slice(-4)) : ''
}

const formatAmount = (amount, decimals) => {
    if(amount){
        return formatUnits(amount, decimals ?? GreatCoinDecimals);
    }else{
        return 0;
    }
}

const parseAmount = (amount, decimals) => {
    if(amount){
        return parseUnits(amount.toString(), decimals ?? GreatCoinDecimals);
    }else{
        return 0;
    }
}

const isOwner = (addr) => {
    return isAddressEqual(OwnerAddress, addr);
}

const toCamelCase = (str) => {
    return str.slice(0,1).toUpperCase() + str.slice(1)
}

const errorHandle = (err) => {
    console.log(err)
    let result = err;
    if (err instanceof BaseError) {                
        console.log('ContractFunctionRevertedError')
        let errorData = _errorHandle(err, ContractFunctionRevertedError);
        if(errorData){
            let errorName = errorData.data?.errorName ?? '';
            let args = errorData.data?.args ?? [];
            result = errorName + "(" + args.join(', ') + ")";
        }
        if(!errorData){
            console.log('CallExecutionError')
            errorData = _errorHandle(err, CallExecutionError);
            if(errorData){
                result = errorData.cause;
            }
        }
        if(!errorData){
            console.log('ContractFunctionExecutionError')
            errorData = _errorHandle(err, ContractFunctionExecutionError);
            if(errorData){
                result = errorData.cause;
            }
        }
    }
    return result;
}

const _errorHandle = (err, errType) => {
    const _error = err.walk(_err => _err instanceof errType)
    if (_error instanceof errType) {
        return _error;
    }else{
        return false;
    }
}

export  {
    chains,
    toCamelCase,

    BlockPeriods,
    PerBlockTime,

    BlueMax,
    BlueCount,
    RedMax,
    RedCount,

    CoinList,

    GreatCoinDecimals,
    DaoCoinDecimals,
    InvestmentCoinDecimals,

    F,
    C,

    OwnerAddress,
    FinalBenefitAddress,
    isOwner,

    getDeadline,
    shortAddress,
    formatAmount,
    parseAmount,

    DaoExecutorRewardRate,
    InvestmentExecutorRewardRate,

    DaoCoinMaxSupply,
    InvestmentCoinMaxSupply,

    InvestmentMinDepositAssets,
    InvestmentMinRedeemShares,

    errorHandle,

}