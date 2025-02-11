"use client";
import React, { useEffect, useState } from "react";
import db from "../firebase";
import { doc, getDoc, collection } from "firebase/firestore";
import localFont from "next/font/local";
import "./home.css";
import { IoAddCircle, IoDocumentText } from "react-icons/io5";
import MemoShow from "@/components/Home/memo-show";
import MemoWrite from "@/components/Home/memo-write";

interface Lectures {
  [key: string]: Lecture;
}

interface Lecture {
  lectureCode: string;
  lectureName: string;
  syllabusUrl: string;
}

// チョークフォント
const myFont = localFont({
  src: "../ChalkJP_3/Chalk-JP.otf",
});

const week = ["日", "月", "火", "水", "木", "金", "土"];

export default function Home() {
  const [memoVisible, setMemoVisible] = useState<boolean>(false);
  const [memoShow, setMemoShow] = useState<boolean>(false);
  const [memo, setMemo] = useState<Array<{id: string, content: string}>>([]);
  const [memoParams, setMemoParams] = useState<{content: string, memoID: string}>({
      content: '',
      memoID: '',
  })

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  let lectureSeason = [];
  //学年歴(2024)のクォーターの開始日 https://www.u-ryukyu.ac.jp/aboutus/calendar/#:~:text=%EF%BC%BB%E2%80%BB%EF%BC%93%EF%BC%BD%EF%BC%9A%E3%82%AF%E3%82%A9%E3%83%BC%E3%82%BF%E3%83%BC%E3%81%A8,%E8%A3%9C%E8%AC%9B%E3%83%BB%E5%AE%9F%E7%BF%92%E3%82%92%E8%A1%8C%E3%82%8F%E3%81%AA%E3%81%84%E3%80%82
  if(currentMonth >= 4 && currentMonth <= 12) {
    lectureSeason = [new Date(currentYear, 4, 1), new Date(currentYear, 6, 11), new Date(currentYear+1, 10, 1), new Date(currentYear+1, 11, 28)];
  } else {
    lectureSeason = [new Date(currentYear+1, 10, 1), new Date(currentYear+1, 1, 28), new Date(currentYear, 4, 1), new Date(currentYear, 6, 11)];
  }
  const [date, setDate] = useState<{ [key: string]: string }>({
    year: "",
    month: "",
    day: "",
    week: "",
  });
  const [lecture, setLecture] = useState<Lectures>({}); // 修正: オブジェクト型に変更
  const dateRef = React.useRef<HTMLDivElement>(null);

  const getLecture = async (day: number) => {
    const userID = process.env.NEXT_PUBLIC_LOGIN_ID;
    if (!userID) {
      console.warn("ユーザーIDが設定されていません");
      return;
    }
    try {
      const userRef = doc(db, userID, "academic-infomation");
      const lectureRef = doc(userRef, "academic-infomation", "basic-data");
      const lectureSnap = await getDoc(lectureRef);

      if (lectureSnap.exists()) {
        const data = lectureSnap.data();
        if (data[day - 1]) {
          setLecture(data[day - 1] as Lectures); // オブジェクトとして格納
        } else {
          console.warn("該当する日付のデータがありません");
          setLecture({});
        }
      } else {
        console.warn("データが存在しません");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const getMemo = async () => {
    const userID = process.env.NEXT_PUBLIC_LOGIN_ID;
    if (!userID) {  // lecture が空でないことを確認
        console.error("ユーザーIDまたは講義名が無効です");
        return;
    }
    const userRef = doc(db, userID, "home")
    const homeRef = collection(userRef, "memo")
    const memoRef = doc(homeRef, "memo")
    try {
        const reportSnap = await getDoc(memoRef);
        if (reportSnap.exists()) {
            const data = reportSnap.data();
            setMemo(data.memo);
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
  };

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
      week: weekNum.toString(),
    });
    getLecture(1);
  }, []);

  const handleMemoAdd = () => {
    setMemoVisible(!memoVisible);
  }
  const handleMemoShow = () => {
      setMemoShow(!memoShow);
  }
  const readMemo = (id: string) => {
      handleMemoShow();
      setMemoParams({
          content: memo.find((item) => item.id === id)!.content,
          memoID: id
      });
  }

  useEffect(() => {
      getMemo();
  }, [memoVisible, memoShow]);
  return (
    <div>
      <div className={`fixed w-full h-[calc(100vh-175px)] bg-black z-10 pointer-events-none ${memoVisible || memoShow ? "opacity-30" : "opacity-0"}`}></div>
      {memoVisible ? <MemoWrite className='left-1/2 translate-x-[-50%] top-1/4 z-20' handleMemoAdd={handleMemoAdd} /> : <></>}
      {memoShow ? <MemoShow className='left-1/2 translate-x-[-50%] top-1/4 z-20' handleMemoShow={handleMemoShow} content={memoParams.content} memoID={memoParams.memoID}/> : <></>}
      <div className={`flex justify-center items-center ${myFont.className} black-bord w-11/12 h-[270px] mx-auto mt-8 bg-green-800`}>
        <div className="w-11/12 h-full">
          <div className="text-white font-bold text-xl h-1/12 text-center mt-1">
            今日の時間割
          </div>
          <div className="h-[220px] overflow-y-scroll">
            {[
                { start: '08:30', end: '10:00', period: 0 },
                { start: '10:20', end: '11:50', period: 1 },
                { start: '12:50', end: '14:20', period: 2 },
                { start: '14:40', end: '16:10', period: 3 },
                { start: '16:20', end: '17:50', period: 4 },
                { start: '18:00', end: '19:30', period: 5 }
              ].map(({ start, end, period　}, index) => {
                return (
                  <div className="ml-2 mb-2 flex justify-start items-center" key={index}>
                    <div className="w-20">
                      <div className="text-white text-sm opacity-90">{start}</div>
                      <div className="flex justify-around items-center">
                        <div className="h-4 w-0.5 bg-white opacity-80"></div>
                        <div className="text-white text-lg font-bold opacity-90 whitespace-nowrap">{period+1}限目:</div>
                      </div>
                      <div className="text-white text-sm opacity-90">{end}</div>
                    </div>
                    <div className="text-white font-bold">
                      <div>{lecture[period]?.lectureName}</div>
                      <div>{lecture[period+"_02"]?.lectureName}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
        <div
          className="w-1/12 mt-1 text-white font-bold text-[18px] [writing-mode:vertical-rl] [text-orientation:upright] text-nowrap"
          ref={dateRef}
        >
          {date.year}年{date.month}月{date.day}日&#65077;{week[Number(date.week)]}&#65078;
        </div>
      </div>

      <div className='relative flex flex-col w-11/12 h-[250px] bg-gray-50 rounded-md mx-auto mt-5 shadow-md'>
        <div className='flex justify-start items-center ml-4'>
            <IoDocumentText className='text-green-400 text-2xl mt-2' />
            <div className='text-xl text-green-400 font-bold mt-2 ml-1'>メモ</div>
        </div>
        <div className='w-full h-[1px] mx-auto bg-gray-200 mb-2'></div>

        <div className='overflow-y-scroll'>
            {
                memo.map((item: {id: string, content: string}, index: number) => {
                    console.log(item)
                    let content = item.content;
                    const length = 15;
                    if (item.content.length >= length) {
                        content = item.content.slice(0, length) + "...";
                    }
                    return (
                        <button key={item.id} className='w-11/12 ml-[15px] bg-gray-100 rounded-md my-1 p-2' value={item.id} onClick={() => readMemo(item.id)}>
                            <div className='w-11/12 mx-auto bg-transparent text-left'><span className='font-bold text-lg text-gray-500 mr-2 w-fit'>{index+1}:</span>{content}</div>
                        </button>
                    );
                })
            }
        </div>
        <button className='absolute bottom-2 right-2' onClick={handleMemoAdd}>
            <IoAddCircle className='text-green-400 text-5xl hover:text-green-500 duration-150' />
        </button>
      </div>
    </div>
  );
}
