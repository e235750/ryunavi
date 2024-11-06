"use client"
import { useEffect, useState } from 'react';
import db from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import ItemCard from '@/components/webclass/item-card'
import Setting from '@/components/Assignment/setting'
import { HiAdjustments } from "react-icons/hi";

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
        sort: 'deadline-ascending-order',
        target: 'レポート'
    });
    const [reportCard, setReportCardState] = useState<{card: React.JSX.Element, complete: boolean, cardNumber: number, date: Date}[]>([]);
    const [visible, setVisible] = useState<boolean>(false);

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
        console.log(sortOption)
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
    const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSortOption({
            ...sortOption,
            target: e.target.value
        })
    }

    const handleOptionClick = () => {
        setVisible(!visible)
    }

    const setComplete = (cardNumber: number, reportCard: {card: React.JSX.Element, complete: boolean, cardNumber: number, date: Date}[]) => {
        const newReportCard = reportCard.map((item) => {
            if (item.cardNumber === cardNumber) {
                return {
                    ...item,
                    complete: !item.complete
                }
            }
            return item
        })
        console.log(newReportCard)
        setReportCardState(newReportCard)
    }

    const setReportCard = () => {
        const reportCard: {card: React.JSX.Element, complete: boolean, cardNumber: number, date: Date}[] = []
        Object.keys(reportData).forEach((lectureName) => {
            const { report, selfLearning } = reportData[lectureName];
            report.forEach((item) => {
                if (sortOption.target !== "all" && sortOption.target !== "レポート") {
                    return;
                }
                if (sortOption.display !== "all" && lectureName !== sortOption.display) {
                    return;
                }
                reportCard.push({
                    card: <ItemCard
                        key={`report-${lectureName}-${reportCard.length}`}
                        lectureName={lectureName}
                        endDate={item["endDate"]}
                        endTime={item["endTime"]}
                        startDate={item["startDate"]}
                        startTime={item["startTime"]}
                        reportName={item["reportName"] ? item["reportName"] : ""}
                        category={item["category"]}
                        cardNumber={reportCard.length}
                        setComplete={setComplete}
                        reportCard={reportCard}
                    />,
                    complete: false,
                    cardNumber: reportCard.length,
                    date: new Date(`${item["endDate"][0]}-${item["endDate"][1]}-${item["endDate"][2]}T${item["endTime"][0]}:${item["endTime"][1]}`)
                });
            });

            selfLearning.forEach((item) => {
                if (sortOption.target !== "all" && sortOption.target !== "自習") {
                    return;
                }
                if (sortOption.display !== "all" && lectureName !== sortOption.display) {
                    return;
                }
                reportCard.push({
                    card: <ItemCard
                        key={`report-${lectureName}-${reportCard.length}`}
                        lectureName={lectureName}
                        endDate={item["endDate"]}
                        endTime={item["endTime"]}
                        startDate={item["startDate"]}
                        startTime={item["startTime"]}
                        reportName={item["selfLearningName"] ? item["selfLearningName"] : ""}
                        category={item["category"]}
                        cardNumber={reportCard.length}
                        setComplete={setComplete}
                        reportCard={reportCard}
                    />,
                    complete: false,
                    cardNumber: reportCard.length,
                    date: new Date(`${item["endDate"][0]}-${item["endDate"][1]}-${item["endDate"][2]}T${item["endTime"][0]}:${item["endTime"][1]}`)
                });
            });
        });
        const sort = sortOption.sort === "deadline-ascending-order" ? 1 : -1;
        reportCard.sort((a, b) => {
            let result = a.date.getTime() - b.date.getTime();
            return result * sort;
        });
        // reportCard.forEach((item, index) => {
        //     console.log(item.card.props.category)
        // })
        setReportCardState(reportCard);
    }

    return (
        <>
            <div className='flex justify-end items-center leading-3 w-11/12 h-12 mx-auto mr-10'>
                <button className="flex justify-center items-center">
                    <div className='font-bold text-kg'>表示設定:</div>
                    <HiAdjustments size={35} className='text-green-400 rotate-90 translate-y-[1px]' onClick={handleOptionClick} />
                </button>
            </div>
            <div className='overflow-y-scroll h-[calc(80%-64px)]'>
                {reportCard.map((item) => item.card)}
            </div>
            <Setting
                handleDisplayChange={handleDisplayChange}
                handleDevelopmentChange={handleDevelopmentChange}
                handleSortChange={handleSortChange}
                handleTargetChange={handleTargetChange}
                handleOptionClick={handleOptionClick}
                reportData={reportData}
                visible={visible}
                target={sortOption.target}
            />
        </>
    )
}

export default Page;