"use client"
//import Image from "next/image";
import Board from '@/components/Board';
import WinnerAnnouncePop from '@/components/WinnerAnnouncePop';
import { BoardState, checkPut, checkWinner, countPiece, initBoard, makeBoard, Player, Winner } from "@/utils/gameSetting";
import { useEffect, useState } from 'react';

export default function Match() {
    const [board, setBoard] = useState<BoardState>(initBoard());
    const [nowPlayer, setNowPlayer] = useState<Player>('black');
    const [winner, setWinner] = useState<Winner>(null);
    const [skip, setSkip] = useState<Boolean>(false);

    /**
     * セルを押した時に処理する関数
     * @param row 置いたマスの縦
     * @param col 置いたマスの横
     */
    const cellClick = (row: number, col: number) => {
        setSkip(false);
        //盤面変える
        const newBoard = makeBoard(board, col, row, nowPlayer);
        if(newBoard){
            setBoard(newBoard);
            const winner = checkWinner(newBoard, skip);
            if(winner){
                setWinner(winner);
            }else{
                //プレイヤーチェンジ
                setNowPlayer(nowPlayer === 'black' ? 'white' : 'black');
            }
            //プレイヤーチェンジ
            setNowPlayer(nowPlayer === 'black' ? 'white' : 'black');            
        }
    };
    /**
     * ゲームを最初からにする関数
     */
    const handleWinnerDismiss = () => {
        setWinner(null);
        setBoard(initBoard()); // ゲームをリセット
        setNowPlayer('black'); // 初期プレイヤーをセット
    };
    /**
     * 打つところがなかったときの処理
     */
    useEffect(() => {
        if(!checkPut(board, nowPlayer)){
            if(skip){
                setSkip(false);
                const winner = checkWinner(board, skip);
                if(winner){
                    setWinner(winner);
              }
            }else{
                setSkip(true);
                setNowPlayer(nowPlayer === 'black' ? 'white' : 'black');
            }
            
        }
    }, [board, nowPlayer, skip, winner]);
    return(
        <div className='flex flex-col items-center'>
            <p>二人で対戦</p>
            <Board board={board} onCellClick={cellClick}/>
            {!winner && <p>{nowPlayer}のターン</p>}
            {!winner && <p>黒：{countPiece(board).countBlack}　　白：{countPiece(board).countWhite}</p>}
            {winner && <WinnerAnnouncePop winner={winner} onDismiss={handleWinnerDismiss} />}
        </div>
    );
}
