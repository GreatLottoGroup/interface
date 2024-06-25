import { PricePerCount, PricePerCountEth, BlueCount, RedCount, C  } from './globalVars'

export function quoteTicket(numbers, multiple, periods, isEth){
    var totalCount = 0n;
    for(var i = 0; i < numbers.length; i++){
        totalCount += _quoteTicket(numbers[i]);
    }
    let _totalCount = BigInt(multiple * periods) * totalCount;
    let amount = _totalCount * PricePerCount;
    if(isEth){
        amount = _totalCount * PricePerCountEth;
    }
    return [ totalCount, amount ];
};

// 计算注数
const _quoteTicket = function(number){
    return C(number[1].length, BlueCount - number[0].length) * C(number[2].length, RedCount);
};

