"use client"
//import Image from "next/image";
import Board from '@/components/Board';
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { BoardState, initBoard } from "@/utils/gameSetting";
import { useState } from 'react';

export default function Home() {
    
    return(
      <div className='flex flex-col items-center' style={{background: `#FFF`, margin:`20%`, padding: `5%`}}>
        <h2 className="font-bold" style={{fontSize: `20px`, margin: `3%`}}>
          オセロ対戦
        </h2>
        <Button variant="destructive" asChild>
            <Link href="/match">二人で対戦</Link>
        </Button>
        <Button variant="destructive" asChild>
            <Link href="/vsAI">AIと対戦</Link>
        </Button>
      </div>
    );
}
