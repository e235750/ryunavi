"use client"
import { useEffect, useRef, useState } from 'react'
import db from '../../../firebase'
import { doc, getDoc, collection } from 'firebase/firestore'
import { useSearchParams } from 'next/navigation'
import { IoIosBook } from "react-icons/io";
import { IoTimeSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { IoAddCircle } from "react-icons/io5";
import MemoWrite from '@/components/Assignment/memo-write'
import MemoShow from '@/components/Assignment/memo-show'

interface Items {
    endDate: [string, string, string];
    startDate: [string, string, string];
    endTime: [string, string];
    startTime: [string, string];
    reportName?: string;
    selfLearningName?: string;
    category: string;
}

const Page = ({ params }: { params: {slug: string} }) => {
    const report = decodeURI(params.slug);
    const [lectureData, setLectureData] = useState<Items>({
        endDate: ['','',''],
        startDate: ['','',''],
        endTime: ['',''],
        startTime: ['',''],
        category: ''
    })
    const [basicData, setBasicData] = useState<{lecture: string, category: string}>({
        lecture: '',
        category: ''
    })
    const [memoVisible, setMemoVisible] = useState<boolean>(false);
    const [memoShow, setMemoShow] = useState<boolean>(false);
    const [memo, setMemo] = useState<Array<{id: string, content: string}>>([]);
    const [memoParams, setMemoParams] = useState<{content: string, lecture: string, report: string, memoID: string}>({
        content: '',
        lecture: '',
        report: '',
        memoID: '',
    })
    const searchParam = useSearchParams();
    const infoRef = useRef<HTMLDivElement>(null);

    const getLectureData = async (report: string, lecture: string, category: string) => {
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }
        const userRef = doc(db, userID, "webclass")

        const lectureSnap = await getDoc(userRef);
        if(lectureSnap.exists()) {
            const data = lectureSnap.data()
            const categoryData = category === "レポート" ? "report" : "selfLearning";
            const lectureData = data[lecture][categoryData].find((element: Items) => element.reportName === report);
            setLectureData(lectureData);
        } else {
            console.log("No such document!")
        }
    }
    const getParams = () => {
        const lecture = searchParam.get('lecture')!;
        const category = searchParam.get('category')!;
        return {lecture, category}
    }

    const getMemo = async (lecture: string, report: string) => {
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID;
        if (!userID || !lecture) {  // lecture が空でないことを確認
            console.error("ユーザーIDまたは講義名が無効です");
            return;
        }
        const userRef = doc(db, userID, "assignment");
        const lectureRef = collection(userRef, lecture);
        const reportRef = doc(lectureRef, report);
        try {
            const reportSnap = await getDoc(reportRef);
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
        const {lecture, category} = getParams();
        setBasicData({lecture, category});
        getLectureData(report, lecture, category);
    }, [])
    useEffect(() => {
        getMemo(basicData.lecture, report);
    }, [basicData])
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
            lecture: basicData.lecture,
            report: report,
            memoID: id
        });
    }

    useEffect(() => {
        getMemo(basicData.lecture, report);
    }, [memoVisible, memoShow])

    return(
        <div>
            <div className={`fixed w-full h-[calc(100vh-175px)] bg-black z-10 pointer-events-none ${memoVisible || memoShow ? "opacity-30" : "opacity-0"}`}></div>
            {memoVisible ? <MemoWrite className='left-1/2 translate-x-[-50%] top-1/4 z-20' handleMemoAdd={handleMemoAdd} lectureName={basicData.lecture} reportName={report}/> : <></>}
            {memoShow ? <MemoShow className='left-1/2 translate-x-[-50%] top-1/4 z-20' handleMemoShow={handleMemoShow} content={memoParams.content} lectureName={memoParams.lecture} reportName={memoParams.report} memoID={memoParams.memoID}/> : <></>}
            <div ref={infoRef} className={memoVisible || memoShow ? "pointer-events-none" : ""}>
                <h1 className='text-xl font-bold text-center mt-5'><input className='w-11/12 mx-auto bg-transparent' type="text" value={basicData.lecture} disabled /></h1>
                <div className='flex flex-col w-11/12 h-[250px] bg-gray-50 rounded-md mx-auto mt-5 shadow-md'>
                    <div className='flex justify-start items-center ml-4'>
                        <IoIosBook className='text-green-400 text-2xl mt-2' />
                        <div className='text-xl text-green-400 font-bold mt-2 ml-1'>レポート情報</div>
                    </div>
                    <div className='w-full h-[1px] mx-auto bg-gray-200 mb-2'></div>
                    <div className='w-11/12 mx-auto font-bold text-3xl'><input className='bg-transparent' type="text" value={report} disabled /></div>
                    <div className='self-end w-fit mr-3 font-bold text-gray-500 leading-4'>{basicData.category}</div>
                    <div className='flex justify-start items-center ml-4'>
                        <IoTimeSharp className='text-red-400 text-2xl mt-2'/>
                        <div className='text-xl text-red-400 font-bold mt-2 ml-1'>締切</div>
                    </div>
                    <div className='w-11/12 h-[1px] mx-auto bg-gray-200 mb-2'></div>
                    <div className='flex items-center w-11/12 gap-x-6'>
                        <div className='flex ml-5'>
                            <div className='w-fit text-3xl font-bold'>{lectureData?.endDate[0]}</div><div className='text-3xl font-bold mx-1 w-fit'>/</div><div className='text-3xl font-bold w-fit'>{lectureData?.endDate[1]}</div><div className='text-3xl font-bold w-fit mx-1'>/</div><div className='text-3xl font-bold w-fit'>{lectureData?.endDate[2]}</div>
                        </div>
                        <div className='flex'>
                            <div className='w-fit text-3xl font-bold'>{lectureData?.endTime[0]}</div><div className='text-3xl font-bold mx-1 w-fit'>:</div><div className='w-fit text-3xl font-bold'>{lectureData?.endTime[1]}</div>
                        </div>
                    </div>
                    <div className='flex ml-5 justify-end leading-4 mr-1'>
                        <div className='font-bold text-gray-500'>開始:</div>
                        <div className='ml-1 w-fit font-bold text-gray-500'>{lectureData?.startDate[0]}</div><div className='w-fit text-gray-500'>/</div><div className='font-bold w-fit text-gray-500'>{lectureData?.startDate[1]}</div><div className='w-fit text-gray-500'>/</div><div className='font-bold w-fit text-gray-500'>{lectureData?.startDate[2]}</div>
                        <div className='mx-2 flex'>
                            <div className='w-fit text-gray-500 font-bold'>{lectureData?.startTime[0]}</div><div className='text-gray-500 font-bold w-fit'>:</div><div className='w-fit text-gray-500 font-bold'>{lectureData?.startTime[1]}</div>
                        </div>
                    </div>
                    <button className='self-end mr-2'>
                        <FaCheck className='text-gray-400 text-5xl bg-white p-2 rounded-lg'/>
                    </button>
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
        </div>
    )
}
export default Page;