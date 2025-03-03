'use client';

import { GreatCoinDecimals, CoinList, formatAmount, shortAddress } from '@/launch/hooks/globalVars'
import './colorTheme.css'
import './coinShow.css'
import Image from 'next/image'
import Tooltips from './tooltips';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const infoContent = (
    <InfoOutlinedIcon sx={{verticalAlign: 'bottom', fontSize: '1rem', marginLeft: '0.2rem', opacity: 0.5}}/>
)

const _coinShow = (value, isFormat, fixed, coinName, className, coinIcon, coinAddr, info) => {
    if(value && !isFormat){
        value = formatAmount(value, CoinList[coinName]?.decimals || GreatCoinDecimals)
    }else{
        value = value?.toString();
    }

    if(fixed > 0){
        value = Number(value).toFixed(fixed);
    }

    const coinEl = (
        <span className={'badge coin-name ' + className}>
            {coinIcon && (
                <Image src={coinIcon} alt={coinName} width='1' height='1' className='coin-icon me-1'/>
            )}
            {coinName}
            {info && infoContent}
        </span>
    );

    const valueEl = (
        <span className="badge text-bg-light coin-amount">
            {value}
            {info && infoContent}
        </span>
    )

    return (
        <span className="badge-group coin-group">
            {value && ( info ? (
                <Tooltips title={info} placement="top">{valueEl}</Tooltips>
            ) : valueEl)}
            {coinName && (coinAddr ? (
                <Tooltips title={coinAddr} placement="top">{coinEl}</Tooltips>
            ) : coinEl)}
        </span>
    )
}

const usd = (value, isFormat) => {
    return amount(value, isFormat, '$');
}
const eth = (value, isFormat) => {
    return _coinShow(value, isFormat, 5, 'ETH', 'dark-bg-subtle');
}
const dai = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 2, 'DAI', 'warning-bg-subtle', '/MCDDai_32.webp', coinAddr);
}
const usdt = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 2, 'USDT', 'success-bg-subtle', '/tethernew_32.webp', coinAddr);
}
const usdc = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 2, 'USDC', 'primary-bg-subtle', '/centre-usdc_28.webp', coinAddr);
}
const weth = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 5, 'WETH', 'danger-bg-subtle', '/weth_28.webp', coinAddr);
}
const glc = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 2, 'GLC', 'info-bg-subtle', null, coinAddr);
}
const gleth = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 5, 'GLETH', 'info-bg-subtle', null, coinAddr);
}
const gldc = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 2, 'GLDC', 'info-bg-subtle', null, coinAddr);
}
const glic = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 2, 'GLIC', 'info-bg-subtle', null, coinAddr);
}
const glieth = (value, isFormat, coinAddr) => {
    return _coinShow(value, isFormat, 5, 'GLIETH', 'info-bg-subtle', null, coinAddr);
}
const amount = (value, isFormat, coinName, info) => {
    if(coinName){
        return _coinShow(value, isFormat, 2, coinName, 'dark-bg-subtle', null, null, info);
    }else{
        return _coinShow(value, isFormat, null, null, null, null, null, info);
    }
}
const rate = (value) => {
    return _coinShow(value + '%', true);
}
const gwei = (value) => {
    return amount(formatAmount(value, 9), true, 'Gwei');
}


const coinShow = (coinName, value, isFormat, coinAddr) => {
    let coinEl;
    if(coinName == 'DAI'){
        coinEl = dai(value, isFormat, coinAddr);
    }else if(coinName == 'USDC'){
        coinEl = usdc(value, isFormat, coinAddr);
    }else if(coinName == 'USDT'){
        coinEl = usdt(value, isFormat, coinAddr);
    }else if(coinName == 'WETH'){
        coinEl = weth(value, isFormat, coinAddr);
    }else if(coinName == 'GLETH'){
        coinEl = gleth(value, isFormat, coinAddr);
    }else if(coinName == 'GLC'){
        coinEl = glc(value, isFormat, coinAddr);
    }else{
        coinEl = amount(value, isFormat, coinAddr);
    }
    return coinEl
}

const address = (addr) => {
    const sAddr = shortAddress(addr);
    return _coinShow(sAddr, true, null, null, null, null, null, addr);
}

export {
    dai,
    usdt,
    usdc,
    glc,
    gldc,
    glic,
    glieth,
    usd,
    eth,
    gwei,
    weth,
    gleth,
    amount,
    rate,
    coinShow,
    address
}