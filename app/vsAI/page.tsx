"use client"
//import Image from "next/image";
import Board from '@/components/Board';
import WinnerAnnouncePop from '@/components/WinnerAnnouncePop';

import { isPlacedCorner, listCanPutCell, listCanPutPlayerPerAI, minOpponentPut} from '@/utils/AILogic';
import { BoardState, checkPut, checkPutRowCol, checkWinner, countPiece, initAI, initBoard, initPlayer, makeBoard, Player, Winner } from "@/utils/gameSetting";
import { useEffect, useState } from 'react';

export default function VsAI() {
    const [board, setBoard] = useState<BoardState>(initBoard());
    const [player, setPlayer] = useState<Player>(initPlayer(true));
    const [AI, setAI] = useState<Player>(initAI(player));
    const [winner, setWinner] = useState<Winner>(null);
    //const [skip, setSkip] = useState<Boolean>(false);

    let skip = false;

    /**
     * セルを押した時に処理する関数
     * @param row 置いたマスの縦
     * @param col 置いたマスの横
     */
    const cellClick = (row: number, col: number) => {
        //盤面変える

        const newBoard = makeBoard(board, col, row, player);
        if(checkPut(board, player)){
            
            if(newBoard){
                skip = false;
                setBoard(newBoard);
                const winner = checkWinner(newBoard, skip);
                if(winner){
                    setWinner(winner);
                }          
            }
        }else{
            if(skip){
                const winner = checkWinner(board, skip);
                if(winner){
                    setWinner(winner);
                }
            }else{
                skip = true;
            }
        }
        //AI
        if(newBoard){
            if(checkPut(newBoard, AI)){
            
                //おけるところを配列に
                const canPutAI = listCanPutCell(newBoard, AI);
                //console.log(canPutAI);
                const AIPut = canPutAI[Math.trunc(Math.random() * canPutAI.length)];
                const putAIBoard = makeBoard(newBoard, Math.trunc(AIPut % 8), Math.trunc(AIPut / 8), AI);
                /*if(putAIBoard){
                    setTimeout(() => {
                        setBoard(putAIBoard);
                        const winner = checkWinner(newBoard, skip);
                        if(winner){
                            setWinner(winner);
                        }
                    }, 500);
                }
                skip = false;*/
                //仮置きしてプレイヤーが置けるところを配列に
                const canPutPlayerPerAI = listCanPutPlayerPerAI(newBoard, canPutAI, AI);
                //どれだけ試合が進んでるかによってAIのアルゴリズムを変える。
                //const countPieces = countPiece(board);
                //if(countPieces.countBlack + countPieces.countWhite <= 48){
                    if(!isPlacedCorner(canPutPlayerPerAI)){
                        //角に置かれない一手があるとき
                        //角に置かれてしまう一手を置けるところから削除する
                        for(let i = 0; i < canPutPlayerPerAI.length; i++){
                            for(let j = 0; j < canPutPlayerPerAI[i].length; j++){
                                if(canPutPlayerPerAI[i][j] === 0
                                    || canPutPlayerPerAI[i][j] === 7
                                    || canPutPlayerPerAI[i][j] === 56
                                    || canPutPlayerPerAI[i][j] === 63){
                                    canPutPlayerPerAI.slice(i, 1);
                                    canPutAI.slice(i, 1);
                                    i--;
                                    break;
                                }
                            }
                        }
                        console.log(canPutPlayerPerAI);
                        //最も相手の手数が少なくなる自分の手を配列に入れる
                        // const minOpponentAIPut = minOpponentPut(canPutPlayerPerAI, canPutAI);
                        // const AIPut = minOpponentAIPut[Math.trunc(Math.random() * minOpponentAIPut.length)];
                        const AIPut = canPutAI[Math.trunc(Math.random() * canPutAI.length)];
                        const putAIBoard = makeBoard(newBoard, Math.trunc(AIPut % 8), Math.trunc(AIPut / 8), AI);
                        if(putAIBoard){
                            setTimeout(() => {
                                setBoard(putAIBoard);
                                skip = false;
                            }, 500);
                            //setBoard(putAIBoard);
                        }
    
                    }else{
                        //絶対に角に置かれてしまうとき
                    }
                // }else{
    
                // }
            }else{
                if(skip){
                    const winner = checkWinner(board, skip);
                    if(winner){
                        setWinner(winner);
                    }
                }else{
                    skip = true;
                }
            }
        }

    };
    /**
     * ゲームを最初からにする関数
     */
    const handleWinnerDismiss = () => {
        setWinner(null);
        setBoard(initBoard()); // ゲームをリセット

        setPlayer(initPlayer(true)); // 初期プレイヤーをセット
        setAI(initAI(player));
        setPlayer('black');
        skip = false;

    };
    /**
     * 打つところがなかったときの処理
     */

    /*useEffect(() => {
        if(!checkPut(board, player)){
            
            
        }
    }, [board, player, skip, winner]);*/
    return(
        <div className='flex flex-col items-center'>
            <p>二人で対戦</p>
            <Board board={board} onCellClick={cellClick}/>
            {!winner && <p>{player}のターン</p>}

            {!winner && <p>黒：{countPiece(board).countBlack}　　白：{countPiece(board).countWhite}</p>}
            {winner && <WinnerAnnouncePop winner={winner} onDismiss={handleWinnerDismiss} />}
        </div>
    );
}

