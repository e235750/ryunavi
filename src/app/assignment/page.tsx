"use client"
import { useEffect, useState } from 'react';
import db from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import ItemCard from '@/components/webclass/item-card'

interface Items {
    endDate: [string, string, string];
    startDate: [string, string, string];
    endTime: [string, string];
    startTime: [string, string];
    reportName?: string;
    selfLearningName?: string;
    category: string;
}

interface Elements {
    report : Items[];
    selfLearning : Items[];
}

interface Reports {
    [key: string]: Elements;
}

interface SortOption {
    [key: string]: string;
}

const Page = () => {
    const [reportData, setReportData] = useState<Reports>({});
    const [sortOption, setSortOption] = useState<SortOption>({
        display: 'all',
        development: 'all',
        sort: 'date-added'
    });
    const [reportCard, setReportCardState] = useState<React.JSX.Element[]>([]);


    const getReportData = async () => {
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }
        const userRef = doc(db, userID, "webclass")
        const reportSnap = await getDoc(userRef)
        if(reportSnap.exists()) {
            setReportData(reportSnap.data())
        }
    }

    useEffect(() => {
        getReportData()
    }, [])

    useEffect(() => {
        setReportCard()
    }, [reportData, sortOption])


    const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption({
            ...sortOption,
            display: e.target.value
        })
    }
    const handleDevelopmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption({
            ...sortOption,
            development: e.target.value
        })
    }
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption({
            ...sortOption,
            sort: e.target.value
        })
    }

    const setReportCard = () => {
        const reportCard: React.JSX.Element[] = []
        Object.keys(reportData).forEach((lectureName) => {
            const { report, selfLearning } = reportData[lectureName];

            report.forEach((item, index) => {
            if (sortOption.display !== "all" && item["category"] !== sortOption.display && lectureName !== sortOption.display) {
                return;
            }
            reportCard.push(
                <ItemCard
                key={`report-${lectureName}-${index}`}
                lectureName={lectureName}
                endDate={item["endDate"]}
                endTime={item["endTime"]}
                startDate={item["startDate"]}
                startTime={item["startTime"]}
                reportName={item["reportName"] ? item["reportName"] : ""}
                category={item["category"]}
                />
            );
            });

            selfLearning.forEach((item, index) => {
            if (sortOption.display !== "all" && item["category"] !== sortOption.display && lectureName !== sortOption.display) {
                return;
            }
            reportCard.push(
                <ItemCard
                key={`selfLearning-${lectureName}-${index}`}
                lectureName={lectureName}
                endDate={item["endDate"]}
                endTime={item["endTime"]}
                startDate={item["startDate"]}
                startTime={item["startTime"]}
                reportName={item["selfLearningName"] ? item["selfLearningName"] : ""}
                category={item["category"]}
                />
            );
            });
        });
        setReportCardState(reportCard);
    }
    return (
        <>
            <div className='flex justify-around items-center w-11/12 h-16 mx-auto'>
                <label htmlFor="display" className='font-bold'>表示:</label>
                <select name="display" id="display" className='w-1/5 h-10 rounded-md bg-green-400 text-white font-bold text-sm shadow-md outline-none' onChange={handleDisplayChange}>
                    <option value="レポート">レポート</option>
                    <option value="all">全て</option>
                    <option value="自習">自習</option>
                    {Object.keys(reportData).map((key, index) => (
                        <option key={index} value={key}>{key}</option>
                    ))}
                </select>
                <label htmlFor="development" className='font-bold'>進歩:</label>
                <select name="development" id="development" className='w-1/6 h-10 rounded-md bg-green-400 text-white font-bold text-sm shadow-md outline-none' onChange={handleDevelopmentChange}>
                    <option value="all">全て</option>
                    <option value="complete">完了</option>
                    <option value="uncomplete">未完了</option>
                </select>
                <label htmlFor="sort" className='font-bold'>並べ替え:</label>
                <select name="sort" id="sort" className='w-1/6 h-10 rounded-md bg-green-400 text-white font-bold text-sm shadow-md outline-none' onChange={handleSortChange}>
                    <option value="date-added">追加日</option>
                    <option value="deadline-ascending-order">締切日(昇順)</option>
                    <option value="deadline-descending-order">締切日(降順)</option>
                </select>
            </div>
            <div className='overflow-y-scroll h-[calc(80%-64px)]'>
                {reportCard}
            </div>
        </>
    )
}

export default Page;