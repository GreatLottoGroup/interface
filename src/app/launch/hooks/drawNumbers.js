
import { useConfig } from 'wagmi'
import { getBlock } from '@wagmi/core'
import { encodePacked, keccak256 } from 'viem'

import { BlueCount, BlueMax, RedMax, C  } from './globalVars'

// 每组组合开奖的区块数 2：连续两个区块为一组进行开奖
const DRAW_FRONT_GROUP_Q = 2;
const DRAW_BACK_GROUP_Q = 3;

//              0+0 0+1  1+0  1+1   2+0 2+1   3+0 3+1    4+0  4+1     5+0   5+1       6+0     6+1
var drawMap = [[0n, 2n], [0n, 2n], [0n, 5n], [2n, 50n], [50n, 500n], [500n, 50000n], [500000n, 888n]];
let rewardBase = 10n**18n;
let rewardBaseEth = 10n**15n;


export function useDrawNumbers() {

    const config = useConfig();
    // 获取中奖号码
    const getDrawNumber =  async (blockNumber) => {
        let drawNumber = [];
        let curBlock = Number(blockNumber);
        // 获取前区号码
        while(drawNumber.length < BlueCount){
            let num;
            [num, curBlock] = await _getNumber(curBlock, BlueMax, DRAW_FRONT_GROUP_Q);
            if(drawNumber.indexOf(num) == -1){
                    drawNumber.push(num);
            }
            curBlock ++;
        }
        // 获取后区号码
        drawNumber.push((await _getNumber(curBlock, RedMax, DRAW_BACK_GROUP_Q))[0]);
        return drawNumber;
    };

    // 获取单个号码
    const _getNumber = async (blockNumber, max, count) => {
        let curBlock = blockNumber - 1;
        let types = [];
        let values = [];
        for(let i = 0; i < count; i++){
            types.push('bytes32');
            let hash;
            curBlock ++
            [hash, curBlock] = await _getHash(curBlock);
            values.push(hash);
        }
        let num = keccak256(encodePacked(types, values));
        num = Number(BigInt(num) % BigInt(max)) + 1;
        return [num, curBlock];
    };

    // 获取存在的区块哈希
    const _getHash = async (blockNumber) => {
        let curBlock = blockNumber;
        let hash = (await getBlock(config, {blockNumber: curBlock})).hash;
        while(hash == 0){
            curBlock ++;
            hash = (await getBlock(config, {blockNumber: curBlock})).hash;
        }  
        return [hash, curBlock];  
    };
    
    
    return {
        getDrawNumber
    }

}

// Draw
export function drawTicketList(numList, drawNums, isEth){
    var bonus = 0n;
    var topBonus = 0n;
    for(var i = 0; i < numList.length; i++){
        var [b, tb] = drawTicket(numList[i], drawNums, isEth);
        bonus += b;
        topBonus += tb;
    }
    return [bonus, topBonus];
}

function drawTicket(nums, drawNums, isEth){
    var drawCount = drawTicketCount(nums, drawNums);
    //console.log(drawCount);
    var bonus = 0n;
    var topBonus = 0n;
    for(var i = 0; i < drawCount.length; i++){
        var v = drawMap[drawCount[i][0]][drawCount[i][1]];
        if(v == 888n){
            topBonus += BigInt(drawCount[i][2]);
        }else if(v > 0n){
            if(isEth){
                v = v * rewardBaseEth;
            }else{
                v = v * rewardBase;
            }
            bonus += BigInt(drawCount[i][2]) * v;
        }
    }

    return [bonus, topBonus];
}


function drawTicketCount(nums, drawNums){
    var drawFrontNums = drawNums.slice(0, BlueCount);
    var drawBackNum = drawNums[BlueCount];
    var dMap = [];
    // 胆码
    var believeDrawNums = [];
    var believeCount = nums[0].length;
    if(believeCount > 0){
        believeDrawNums = getDrawCount(nums[0], drawFrontNums);
    }

    // 拖码
    var dragDrawNums = getDrawCount(nums[1], drawFrontNums);

    // 后区
    var backDrawStatus = false;
    var backCount = nums[2].length;
    if(nums[2].indexOf(drawBackNum) > -1){
        backDrawStatus = true;
    }

    var maxFrontCount = believeDrawNums.length + dragDrawNums.length;
    var dragDMap = calculateDrag(nums[1], dragDrawNums, BlueCount - believeCount);

    while(maxFrontCount >= 0 && maxFrontCount >= believeDrawNums.length){
        var dragC = dragDMap[maxFrontCount-believeDrawNums.length];
        if(dragC){
            if(backDrawStatus){
                dMap.push([maxFrontCount, 1, dragC]);
                dMap.push([maxFrontCount, 0, dragC * C(backCount-1, 1)]);
            }else{
                dMap.push([maxFrontCount, 0, dragC * C(backCount, 1)]);
            }
        }
        maxFrontCount --;
    }
    //console.log(dMap);
    return dMap;
}

function getDrawCount(list, targetNums){
    var drawNums = [];
    for(var i = 0; i < list.length; i++){
        if(targetNums.indexOf(list[i]) > -1){
            drawNums.push(list[i]);
        }
    }
    return drawNums;
}
// 计算拖码部分
function calculateDrag(dragNums, dragDrawNums, dragCount){
    var dMap = [];
    var dCount = dragDrawNums.length;
    var elseCount = dragNums.length - dCount;
    while(dCount >= 0 && elseCount >= (dragCount - dCount)){
        dMap[dCount] = C(dragDrawNums.length, dCount) * C(elseCount, dragCount - dCount);
        dCount --;
    }
    //console.log(dMap)
    return dMap;
}

