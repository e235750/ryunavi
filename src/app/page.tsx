"use client"
import React from "react"
import { useEffect, useState } from "react"
import localFont from 'next/font/local'
import "./home.css"

//チョークフォント
//https://font.cutegirl.jp/chalk-font-free.html
const myFont = localFont({
  src: '../ChalkJP_3/Chalk-JP.otf'
})
const week = ['日', '月', '火', '水', '木', '金', '土']

export default function Home() {
  const [date, setDate] = useState<{[key: string]: string}>({
    year: '',
    month: '',
    day: '',
    week: ''
  });
  const dateRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekNum = date.getDay();
    setDate({
      year: year.toString(),
      month: month.toString(),
      day: day.toString(),
      week: weekNum.toString()
    })
  }, [])

  return (
    <div className={`flex justify-center items-center ${myFont.className} black-bord w-11/12 h-[270px] mx-auto mt-8 bg-green-800`} >
      <div className="w-11/12 overflow-y-scroll">

      </div>
      <div className="w-1/12 mt-1 text-white font-bold text-xl [writing-mode:vertical-rl] [text-orientation:upright] text-nowrap" ref={dateRef}>
        {date.year}年{date.month}月{date.day}日&#65077;{week[Number(date.week)]}&#65078;
      </div>
    </div>
  );
}
