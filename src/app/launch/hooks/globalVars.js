
import { isAddressEqual, formatUnits, parseUnits } from 'viem'


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

const GreatLottoContractAddress = process.env.NEXT_PUBLIC_GREATLOTTO_CONTRACT_ADDRESS
const PrizePoolContractAddress = process.env.NEXT_PUBLIC_PRIZEPOOL_CONTRACT_ADDRESS
const GuaranteePoolContractAddress = process.env.NEXT_PUBLIC_GUARANTEEPOOL_CONTRACT_ADDRESS
const GreatCoinContractAddress = process.env.NEXT_PUBLIC_GREATCOIN_CONTRACT_ADDRESS
const GreatNftContractAddress = process.env.NEXT_PUBLIC_GREATNFT_CONTRACT_ADDRESS
const InvestmentCoinContractAddress = process.env.NEXT_PUBLIC_INVESTMENTCOIN_CONTRACT_ADDRESS
const InvestmentBenefitPoolContractAddress = process.env.NEXT_PUBLIC_INVESTMENTBENEFITPOOL_CONTRACT_ADDRESS
const DaoCoinContractAddress = process.env.NEXT_PUBLIC_DAOCOIN_CONTRACT_ADDRESS
const DaoBenefitPoolContractAddress = process.env.NEXT_PUBLIC_DAOBENEFITPOOL_CONTRACT_ADDRESS
const SalesChannelContractAddress = process.env.NEXT_PUBLIC_SALESCHANNEL_CONTRACT_ADDRESS

const OwnerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS
const FinalBenefitAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS

const CoinList = {
    'GLC': {
        address: GreatCoinContractAddress,
        decimals: GreatCoinDecimals,
    },
    'DAI': {
        address: process.env.NEXT_PUBLIC_COIN_DAI_ADDRESS,
        decimals: 18,
    },
    'USDC': {
        address: process.env.NEXT_PUBLIC_COIN_USDC_ADDRESS,
        decimals: 6,
    },
    'USDT': {
        address: process.env.NEXT_PUBLIC_COIN_USDT_ADDRESS,
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

const getTokenName = (addr) => {
    let tokenName;
    Object.keys(CoinList).forEach((name)=>{
        if(isAddressEqual(CoinList[name].address, addr)){
            tokenName = name;
        }
    })
    return tokenName;
}
const getTokenAddress = (tokenName) => {
    let tokenAddress;
    Object.keys(CoinList).forEach((name)=>{
        if(name == tokenName){
            tokenAddress = CoinList[name].address;
        }
    })
    return tokenAddress;
}
const getTokendDecimals = (addr) => {
    let decimals;
    Object.keys(CoinList).forEach((name)=>{
        if(isAddressEqual(CoinList[name].address, addr)){
            decimals = CoinList[name].decimals;
        }
    })
    return decimals;
}

const getDeadline = () => {
    return parseInt(new Date().getTime()/1000);
}

const shortAddress = (address) => {
    return address ? (address.slice(0,4) + '...' + address.slice(-4)) : ''
}

const formatAmount = (amount, decimals) => {
    if(amount && decimals){
        return formatUnits(amount, decimals);
    }else{
        return 0;
    }
}

const parseAmount = (amount, decimals) => {
    if(amount && decimals){
        return parseUnits(amount.toString(), decimals);
    }else{
        return 0;
    }
}

const isOwner = (addr) => {
    return isAddressEqual(OwnerAddress, addr);
}

export  {

    BlockPeriods,
    PerBlockTime,

    BlueMax,
    BlueCount,
    RedMax,
    RedCount,

    CoinList,
    getTokenName,
    getTokendDecimals,
    getTokenAddress,

    GreatCoinDecimals,
    DaoCoinDecimals,
    InvestmentCoinDecimals,

    F,
    C,

    GreatLottoContractAddress,
    PrizePoolContractAddress,
    GuaranteePoolContractAddress,
    GreatCoinContractAddress,
    GreatNftContractAddress,
    InvestmentCoinContractAddress,
    InvestmentBenefitPoolContractAddress,
    DaoCoinContractAddress,
    DaoBenefitPoolContractAddress,
    SalesChannelContractAddress,

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

}