"use client"
import './layout.css'
import { useEffect, useState } from 'react'
import db from '../../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import parse from 'html-react-parser';
import Link from 'next/link'
import { FaPenNib } from "react-icons/fa";

interface items {
    lectureRoom: string;
    teachingFormat: string;
    lectureYear: string;
    lecturePeriod: string;
    dayPeriod: string;
    lectureCode: string;
    numberOfCredits: string;
    teacherName: string;
    lectureFormat: string;
    learningCategory: string;
    lectureContents: string;
    educationalGoals: string;
    lectureGoals: string;
    evaluationMethod: string;
    requirements: string;
    lecturePlan: string;
    preLearnig: string;
    textbookName: string;
    textbookUrl: string;
    message: string;
    email: string;
    refUrl: string;
}

interface SyllabusData {
    [key: string]: items;
}

export default function Page({ params }: { params: {slug: string} }) {
    const [lectureSyllabusData, setLectureSyllabusData] = useState<SyllabusData>({})

    const getLectureData = async () => {
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }
        const userRef = doc(db, userID, "academic-infomation")
        const syllabusRef = doc(userRef, "academic-infomation", "syllabus-data")

        const syllabusSnap = await getDoc(syllabusRef);
        if(syllabusSnap.exists()) {
            const data = syllabusSnap.data()
            setLectureSyllabusData(data[params.slug])

        } else {
            console.log("No such document!")
        }
    }

    useEffect(() => {
        getLectureData()
    }, [])
    return (
        <div className='overflow-hidden'>
            <table className='w-11/12 mx-auto border table-fixed my-7'>
                <tbody>
                    <tr><td className='table-td-header' colSpan={2}>科目名</td><td className='table-td-header' colSpan={1}>教室</td></tr>
                    <tr><td className='table-td-contents' colSpan={2}>{String(lectureSyllabusData.lecutureName)}</td><td className='table-td-contents' colSpan={1}>{String(lectureSyllabusData.lectureRoom)}</td></tr>
                    <tr>
                        <td className='table-td-header'>開講年</td>
                        <td className='table-td-header'>開講期間</td>
                        <td className='table-td-header'>曜日時限</td>
                    </tr>
                    <tr>
                        <td className='table-td-contents'>{String(lectureSyllabusData.lectureYear)}</td>
                        <td className='table-td-contents'>{String(lectureSyllabusData.lecturePeriod)}</td>
                        <td className='table-td-contents'>{String(lectureSyllabusData.dayPeriod)}</td>
                    </tr>
                    <tr>
                        <td className='table-td-header'>講義コード</td>
                        <td className='table-td-header'>単位数</td>
                        <td className='table-td-header'>講義形式</td>
                    </tr>
                    <tr>
                        <td className='table-td-contents'>{String(lectureSyllabusData.lectureCode)}</td>
                        <td className='table-td-contents'>{String(lectureSyllabusData.numberOfCredits)}</td>
                        <td className='table-td-contents'>{String(lectureSyllabusData.teachingFormat)}</td>
                    </tr>
                </tbody>
            </table>

            <div className='w-11/12 mx-auto '>
                <section className='mb-10'>
                    <div className='flex justify-start items-start text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>授業形態</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        {parse(String(lectureSyllabusData.lectureFormat))}
                    </div>
                </section>

                <section className='mb-10'>
                    <div className='flex justify-start items-start  text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>授業内容と方法</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        {parse(String(lectureSyllabusData.lectureContents))}
                    </div>
                </section>

                <section className='mb-10'>
                    <div className='flex justify-start items-start  text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>評価基準と評価方法</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        {parse(String(lectureSyllabusData.lecturePlan))}
                    </div>
                </section>

                <section className='mb-10'>
                    <div className='flex justify-start items-start  text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>達成目標</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        {parse(String(lectureSyllabusData.lectureGoals))}
                    </div>
                </section>

                <section className='mb-10'>
                    <div className='flex justify-start items-start  text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>履修条件</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        {parse(String(lectureSyllabusData.requirements))}
                    </div>
                </section>

                <section className='mb-10'>
                    <div className='flex justify-start items-start  text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>事前学習</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        {parse(String(lectureSyllabusData.preLearnig))}
                    </div>
                </section>

                <section className='mb-10'>
                    <div className='flex justify-start items-start  text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>教科書情報</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        <Link href={String(lectureSyllabusData.textbookUrl)}>{String(lectureSyllabusData.textbookName)}</Link>
                    </div>
                </section>

                <section className='mb-10'>
                    <div className='flex justify-start items-start  text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>教科書情報備考</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        {parse(String(lectureSyllabusData.textbookRemarks))}
                    </div>
                </section>

                <section className='pb-28'>
                    <div className='flex justify-start items-start  text-xl text-green-600 font-bold'>
                        <FaPenNib className='mr-2' color='green' size={20} />
                        <h2 className='relative pr-4 after:absolute after:right-1 after:bottom-[5px] after:w-0.5 after:h-4 after:bg-green-600 before:absolute before:right-2 before:bottom-[5px] before:w-0.5 before:h-3 before:bg-green-600 mb-2'>メッセージ</h2>
                    </div>
                    <div className='w-11/12 mx-auto link'>
                        {parse(String(lectureSyllabusData.message))}
                    </div>
                </section>
            </div>
        </div>
    )
}