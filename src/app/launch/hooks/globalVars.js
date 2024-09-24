
import { isAddressEqual, formatUnits, parseUnits, BaseError, ContractFunctionRevertedError, ContractFunctionExecutionError, CallExecutionError  } from 'viem'  

const BlockPeriods = 30n;
const PerBlockTime = 12n;

const BlueMax = 46;
const BlueCount = 6;
const RedMax = 16;
const RedCount = 1;

const PricePerCount = 1n;
const PricePerCountEth = 10n ** 15n;

const IssueInterval = 300n;

const GreatCoinDecimals = 18
const GreatEthDecimals = 18
const DaoCoinDecimals = 18
const InvestmentCoinDecimals = 18

const DaoCoinMaxSupply = 10n ** 8n * 10n ** 18n
const InvestmentCoinMaxSupply = 10n ** 8n * 10n ** 18n

const InvestmentMinDepositAssets = 10000
const InvestmentMinDepositAssetsByEth = 10
const InvestmentMinRedeemShares = 10000

const ExecutorRewardSaveRate = 1n

const chains = {
    "31337": "hardhat",
    "1": "mainnet",
    "17000": "holesky",
    "11155111": "sepolia"
}

const OwnerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS
const FinalBenefitAddress = process.env.NEXT_PUBLIC_BENEFIT_ADDRESS

const ServerUrl = process.env.NEXT_PUBLIC_SERVER_URL

const CoinList = {
    'GLC': {
        decimals: GreatCoinDecimals,
        isPermit: true
    },
    'GLETH': {
        decimals: GreatEthDecimals,
        isPermit: true,
        isEth: true
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
    },
    'WETH': {
        decimals: 18,
        isEth: true
    }
}

const getCoinListByIsEth = (isEthCoin, _CoinList) => {
    let list = [];
    for (const key in _CoinList) {
        if(!!_CoinList[key].isEth == isEthCoin){
            list.push(key);
        }
    }
    return list;
}

var F = function(n){
	if(n < 1n){return 1n;}
	var result = 1n;
	for(var i = 1n; i <= n; i++){
		result = result * i;
	}
	return result;
};
var C = function(n, m){
    n = BigInt(n);
    m = BigInt(m);
	if(n < m){return 0n;}
	return F(n)/(F(n-m) * F(m));
};

const shortAddress = (address) => {
    return address ? (address.slice(0,4) + '...' + address.slice(-4)) : ''
}

const formatAmount = (amount, decimals) => {
    if(amount){
        return formatUnits(amount, decimals ?? GreatCoinDecimals);
    }else{
        return '0';
    }
}

const parseAmount = (amount, decimals) => {
    if(amount){
        return parseUnits(amount.toString(), decimals ?? GreatCoinDecimals);
    }else{
        return 0n;
    }
}

const isOwner = (addr) => {
    return isAddressEqual(OwnerAddress, addr);
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

const getBlockTime = (blockNumber, currentBlock) => {
    blockNumber = BigInt(blockNumber);
    if(blockNumber && currentBlock?.number && blockNumber >= currentBlock.number - BlockPeriods){
        return Number((blockNumber - currentBlock.number) * PerBlockTime + currentBlock.timestamp) * 1000
    }else{
        return 0
    }
}

export  {
    chains,

    BlockPeriods,
    PerBlockTime,

    IssueInterval,

    BlueMax,
    BlueCount,
    RedMax,
    RedCount,

    PricePerCount,
    PricePerCountEth,

    CoinList,
    getCoinListByIsEth,

    GreatCoinDecimals,
    DaoCoinDecimals,
    InvestmentCoinDecimals,

    F,
    C,

    OwnerAddress,
    FinalBenefitAddress,
    isOwner,

    shortAddress,
    formatAmount,
    parseAmount,

    DaoCoinMaxSupply,
    InvestmentCoinMaxSupply,

    InvestmentMinDepositAssets,
    InvestmentMinDepositAssetsByEth,
    InvestmentMinRedeemShares,

    errorHandle,

    ExecutorRewardSaveRate,

    ServerUrl,

    getBlockTime,
}