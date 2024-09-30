"use client"
import { twMerge } from 'tailwind-merge'
import './time-table.css'
import LectureCard from '@/components/TimeTable/LectureCard/lecture-card'
import { useEffect } from 'react'

const Page = () => {
    // api/academic-infomation/route.tsにリクエストしたい
    useEffect(() => {
        fetch('/api/academic-infomation/')
            .then(response => response.json())
            .then(data => console.log(data))
    }, [])
    
  return (
    <table className='table'>
        <thead>
            <tr>
                <th className='table-h'></th>
                <th className='table-h'>月</th>
                <th className='table-h'>火</th>
                <th className='table-h'>水</th>
                <th className='table-h'>木</th>
                <th className='table-h'>金</th>
                <th className={twMerge('table-h', 'text-blue-500')}>土</th>
            </tr>
        </thead>
        <tbody>
            <tr className="table-td">
                <td className='border-b border-r w-10'>
                    <div className='w-10 text-sm text-[#666] text-center'>08:30</div>
                    <div className='w-9 ml-1 relative text-lg font-bold after:absolute after:top-1/2 after:right-4 after:translate-y-[-50%] after:w-[1px] after:h-3 after:bg-[#666]'>1</div>
                    <div className='w-10 text-sm text-[#666] text-center'>10:00</div>
                </td>
                <td className='table-td'><LectureCard lectureName='プログラミング演習' place='遠隔授業' /></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
            </tr>
            <tr className="table-td">
                <td className='border-b border-r w-10'>
                    <div className='w-10 text-sm text-[#666] text-center'>10:20</div>
                    <div className='w-9 ml-1 relative text-lg font-bold after:absolute after:top-1/2 after:right-4 after:translate-y-[-50%] after:w-[1px] after:h-3 after:bg-[#666]'>2</div>
                    <div className='w-10 text-sm text-[#666] text-center'>11:50</div>
                </td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
            </tr>
            <tr className="table-td">
                <td className='border-b border-r w-10'>
                    <div className='w-10 text-sm text-[#666] text-center'>12:50</div>
                    <div className='w-9 ml-1 relative text-lg font-bold after:absolute after:top-1/2 after:right-4 after:translate-y-[-50%] after:w-[1px] after:h-3 after:bg-[#666]'>3</div>
                    <div className='w-10 text-sm text-[#666] text-center'>14:20</div>
                </td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
            </tr>
            <tr className="table-td">
                <td className='border-b border-r w-10'>
                    <div className='w-10 text-sm text-[#666] text-center'>14:40</div>
                    <div className='w-9 ml-1 relative text-lg font-bold after:absolute after:top-1/2 after:right-4 after:translate-y-[-50%] after:w-[1px] after:h-3 after:bg-[#666]'>4</div>
                    <div className='w-10 text-sm text-[#666] text-center'>16:10</div>
                </td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
            </tr>
            <tr className="table-td">
                <td className='border-b border-r w-10'>
                    <div className='w-10 text-sm text-[#666] text-center'>16:20</div>
                    <div className='w-9 ml-1 relative text-lg font-bold after:absolute after:top-1/2 after:right-4 after:translate-y-[-50%] after:w-[1px] after:h-3 after:bg-[#666]'>5</div>
                    <div className='w-10 text-sm text-[#666] text-center'>17:50</div>
                </td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
            </tr>
            <tr className="table-td">
                <td className='border-b border-r w-10'>
                    <div className='w-10 text-sm text-[#666] text-center'>18:00</div>
                    <div className='w-9 ml-1 relative text-lg font-bold after:absolute after:top-1/2 after:right-4 after:translate-y-[-50%] after:w-[1px] after:h-3 after:bg-[#666]'>6</div>
                    <div className='w-10 text-sm text-[#666] text-center'>19:30</div>
                </td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
                <td className='table-td'></td>
            </tr>
        </tbody>
        
    </table>
  )
}

export default Page