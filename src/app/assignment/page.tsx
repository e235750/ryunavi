"use client"
import { useEffect, useState } from 'react';
import db from '../../firebase'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import ItemCard from '@/components/webclass/item-card'
import Setting from '@/components/Assignment/setting'
import { HiAdjustments } from "react-icons/hi";
import AssignmentAdd from '@/components/Assignment/assignment-add';
import { IoAddCircle } from "react-icons/io5";

interface Items {
    endDate: [string, string, string];
    startDate: [string, string, string];
    endTime: [string, string];
    startTime: [string, string];
    reportName?: string;
    selfLearningName?: string;
    category: string;
    id?: string;
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
        target: 'レポート',
        display: 'all',
        deadline: 'all',
        development: 'all',
        sort: 'deadline-ascending-order',
    });
    const [reportCard, setReportCardState] = useState<{card: React.JSX.Element, complete: boolean, cardNumber: number, date: Date, start: Date}[]>([]);
    const [settingVisible, setSettingVisible] = useState<boolean>(false);
    const [addVisible, setAddVisible] = useState<boolean>(false);

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

    const getAddedReportData = async () => {
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }

        const userRef = doc(db, userID, "assignment")
        const reportRef = collection(userRef, "report")
        const lectureRef = doc(reportRef, "report")

        const reportSnap = await getDoc(lectureRef)
        if(reportSnap.exists()) {
            const data = reportSnap.data()
            return data
        } else {
            return {}
        }
    }

    useEffect(() => {
        getReportData()
    }, [])

    useEffect(() => {
        setReportCard()
    }, [reportData, sortOption])

    const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSortOption({
            ...sortOption,
            target: e.target.value
        })
    }
    const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption({
            ...sortOption,
            display: e.target.value
        })
    }
    const handleDeadlineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption({
            ...sortOption,
            deadline: e.target.value
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

    const handleOptionClick = () => {
        setSettingVisible(!settingVisible)
    }

    const handleAddClick = () => {
        setAddVisible(!addVisible)
    }

    const handleRemoveClick = async (lectureName: string, id: string) => {
        let oldData: { [key: string]: Items[] } = {};
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }

        const userRef = doc(db, userID, "assignment")
        const reportRef = collection(userRef, "report")
        const lectureRef = doc(reportRef, "report")

        const reportSnap = await getDoc(lectureRef)
        if(reportSnap.exists()) {
            const data = reportSnap.data()
            if (data) {
                oldData = data;
            }
        }
        const newData = oldData[lectureName].filter((item) => item.id !== id)
        await setDoc(lectureRef, {
            [lectureName]: newData
        })
    }

    const setComplete = (cardNumber: number, reportCard: {card: React.JSX.Element, complete: boolean, cardNumber: number, date: Date, start: Date}[]) => {
        const newReportCard = reportCard.map((item) => {
            if (item.cardNumber === cardNumber) {
                return {
                    ...item,
                    complete: !item.complete
                }
            }
            return item
        })
        setReportCardState(newReportCard)
    }

    const isWithinDeadline = (cards: {card: React.JSX.Element, complete: boolean, cardNumber: number, date: Date, start: Date}[], flag: number) => {
        const now = new Date();
        const result = cards.filter((item) => {
            if (flag === 0) {
                return now.getTime() > item.date.getTime();
            }
            return now.getTime() < item.date.getTime();
        });
        return result;
    }
    const isStart = (cards: {card: React.JSX.Element, complete: boolean, cardNumber: number, date: Date, start: Date}[]) => {
        const now = new Date();
        const result = cards.filter((item) => {
        const startTime = item.start.getTime();
        //期限が設定されていない場合は無条件で追加(自習の場合)
        if (isNaN(startTime)) {
            return true;
        }
        return now.getTime() > startTime;
        });
        return result;
    }

    const setReportCard = async () => {
        const reportCard: {
            card: React.JSX.Element;
            complete: boolean;
            cardNumber: number;
            date: Date;
            start: Date
        }[] = [];

        let addedReportData: { [key: string]: Items[] } = {};

        try {
            const data = await getAddedReportData();
            if (data) {
                addedReportData = data;
            }
            Object.keys(reportData).forEach((lectureName) => {
                const { report, selfLearning } = reportData[lectureName];
                const rcad = [
                    ...report,
                    ...(addedReportData[lectureName] || []), // 存在しない場合は空配列
                ];

                // レポートのデータを追加
                rcad.forEach((item) => {
                    if (sortOption.target !== "all" && sortOption.target !== "レポート") {
                        return;
                    }
                    if (sortOption.display !== "all" && lectureName !== sortOption.display) {
                        return;
                    }
                    reportCard.push({
                        card: (
                            <ItemCard
                                key={`report-${lectureName}-${reportCard.length}`}
                                lectureName={lectureName}
                                endDate={item["endDate"]}
                                endTime={item["endTime"]}
                                startDate={item["startDate"]}
                                startTime={item["startTime"]}
                                reportName={item["reportName"] || ""}
                                category={item["category"]}
                                cardNumber={reportCard.length}
                                setComplete={setComplete}
                                handleRemoveClick={handleRemoveClick}
                                setReportCard={setReportCard}
                                reportCard={reportCard}
                                added={item["id"] ? true : false}
                                id={item["id"] ? item["id"] : ""}
                            />
                        ),
                        complete: false,
                        cardNumber: reportCard.length,
                        date: new Date(
                            `${item["endDate"][0]}-${item["endDate"][1]}-${item["endDate"][2]}T${item["endTime"][0]}:${item["endTime"][1]}`
                        ),
                        start: new Date(
                            `${item["startDate"][0]}-${item["startDate"][1]}-${item["startDate"][2]}T${item["startTime"][0]}:${item["startTime"][1]}`
                        ),
                    });
                });

                // 自習のデータを追加
                selfLearning.forEach((item) => {
                    if (sortOption.target !== "all" && sortOption.target !== "自習") {
                        return;
                    }
                    if (sortOption.display !== "all" && lectureName !== sortOption.display) {
                        return;
                    }
                    reportCard.push({
                        card: (
                            <ItemCard
                                key={`selfLearning-${lectureName}-${reportCard.length}`}
                                lectureName={lectureName}
                                endDate={item["endDate"]}
                                endTime={item["endTime"]}
                                startDate={item["startDate"]}
                                startTime={item["startTime"]}
                                reportName={item["selfLearningName"] || ""}
                                category={item["category"]}
                                cardNumber={reportCard.length}
                                setComplete={setComplete}
                                setReportCard={setReportCard}
                                handleRemoveClick={handleRemoveClick}
                                reportCard={reportCard}
                                added={false}
                                id={item["id"] ? item["id"] : ""}
                            />
                        ),
                        complete: false,
                        cardNumber: reportCard.length,
                        date: new Date(
                            `${item["endDate"][0]}-${item["endDate"][1]}-${item["endDate"][2]}T${item["endTime"][0]}:${item["endTime"][1]}`
                        ),
                        start: new Date(
                            `${item["startDate"][0]}-${item["startDate"][1]}-${item["startDate"][2]}T${item["startTime"][0]}:${item["startTime"][1]}`
                        ),
                    });
                });
            });

            // ソート処理
            const sort = sortOption.sort === "deadline-ascending-order" ? 1 : -1;
            reportCard.sort((a, b) => {
                const result = a.date.getTime() - b.date.getTime();
                return result * sort;
            });

            // デッドライン条件に応じてフィルタリング
            const sortedReportCard = isStart(reportCard);
            if (sortOption.deadline === "within-deadline") {
                const withinDeadline = isWithinDeadline(sortedReportCard, 1);
                setReportCardState(withinDeadline);
            } else if (sortOption.deadline === "out-of-deadline") {
                const outOfDeadline = isWithinDeadline(sortedReportCard, 0);
                setReportCardState(outOfDeadline);
            } else {
                setReportCardState(sortedReportCard);
            }
        } catch (error) {
            console.error("Failed to set report card:", error);
        }
    };


    return (
        <>
            <div className={`fixed w-full h-[calc(100vh-175px)] bg-black z-10 pointer-events-none ${addVisible ? "opacity-30" : "opacity-0"}`}></div>
            <div className={`flex justify-end items-center leading-3 w-11/12 h-12 mx-auto mr-10 ${addVisible ? "pointer-events-none" : ""}`}>
                <button className="flex justify-center items-center">
                    <div className='font-bold text-kg'>表示設定:</div>
                    <HiAdjustments size={35} className='text-green-400 rotate-90 translate-y-[1px]' onClick={handleOptionClick} />
                </button>
            </div>
            <div className={`overflow-y-scroll h-[calc(80%-64px)] ${addVisible ? "pointer-events-none" : ""}`}>
                {reportCard.map((item) => item.card)}
            </div>
            <Setting
                handleDisplayChange={handleDisplayChange}
                handleDevelopmentChange={handleDevelopmentChange}
                handleDeadlineChange={handleDeadlineChange}
                handleSortChange={handleSortChange}
                handleTargetChange={handleTargetChange}
                handleOptionClick={handleOptionClick}
                reportData={reportData}
                visible={settingVisible}
                target={sortOption.target}
            />
            <AssignmentAdd className='top-1/4 left-1/2 translate-x-[-50%] z-20' handleAddClick={handleAddClick} visible={addVisible} reportData={reportData} setReportCard={setReportCard} />
            <button className={`absolute bottom-48 right-7 z-10 ${addVisible ? "pointer-events-none" : ""}`} onClick={handleAddClick} >
                <IoAddCircle className='text-green-400 text-6xl hover:text-green-500 duration-150 opacity-80' />
            </button>
        </>
    )
}

export default Page;