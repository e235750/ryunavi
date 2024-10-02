"use client"
import { twMerge } from 'tailwind-merge'
import './time-table.css'
import LectureCard from '@/components/TimeTable/LectureCard/lecture-card'
import { useEffect, useState } from 'react'
import db from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

interface items {
    lectureName: string;
    lectureCode: string;
    syllabusUrl: string;
}

interface periodData {
    [key: string]: items;
}

interface LectureData {
    [key: string]: periodData;
}

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



const Page = () => {
    const [lectureBasicData, setLectureBasicData] = useState<LectureData>({})
    const [lectureSyllabusData, setLectureSyllabusData] = useState<SyllabusData>({})

    const getLectureData = async () => {
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }
        const userRef = doc(db, userID, "academic-infomation")
        const academicInfoRef = doc(userRef, "academic-infomation", "basic-data")
        const syllabusRef = doc(userRef, "academic-infomation", "syllabus-data")

        const lectureSnap = await getDoc(academicInfoRef);
        const syllabusSnap = await getDoc(syllabusRef);
        if(lectureSnap.exists() && syllabusSnap.exists()) {
            setLectureBasicData(lectureSnap.data())
            setLectureSyllabusData(syllabusSnap.data())
        } else {
            console.log("No such document!")
        }
    }

    useEffect(() => {
        getLectureData()
    }, [])
    
  return (
    <table className='table'>
        <thead>
            <tr>
                <th className='table-h'></th>
                {['月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <th key={index} className={twMerge('table-h', day === '土' && 'text-blue-500')}>{day}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {[
                { start: '08:30', end: '10:00', period: '1'　},
                { start: '10:20', end: '11:50', period: '2' },
                { start: '12:50', end: '14:20', period: '3' },
                { start: '14:40', end: '16:10', period: '4' },
                { start: '16:20', end: '17:50', period: '5' },
                { start: '18:00', end: '19:30', period: '6' }
            ].map(({ start, end, period　}, index) => (
                <tr key={index} className="table-td">
                    <td className='border-b border-r w-10'>
                        <div className='w-10 text-sm text-[#666] text-center'>{start}</div>
                        <div className='w-9 ml-1 relative text-lg font-bold after:absolute after:top-1/2 after:right-4 after:translate-y-[-50%] after:w-[1px] after:h-3 after:bg-[#666]'>{period}</div>
                        <div className='w-10 text-sm text-[#666] text-center'>{end}</div>
                    </td>
                    {[...Array(6)].map((_, i) => {
                        const lecture = lectureBasicData[(i).toString()]?.[(index+1).toString()];
                        const lectureCode = lecture ? lecture.lectureCode : '';
                        const place = lectureSyllabusData ? lectureSyllabusData[lectureCode]?.lectureRoom.replace(/\[.*?\]/g, "") : '';
                        
                        return (
                            <td key={i} className='table-td'>
                                {lecture ? <LectureCard lectureName={lecture.lectureName} place={place} lectureCode={lectureCode} /> : null}
                            </td>
                        );
                    })}
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default Page