"use client"
import { ComponentPropsWithoutRef, useRef } from "react";
import { twMerge } from "tailwind-merge";
import db from "../../firebase"
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { ulid } from "ulid";

type Props = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    visible: boolean;
    handleAddClick: () => void;
    setReportCard: () => void;
    reportData: Reports;
}

interface Items {
    endDate: [string, string, string];
    startDate: [string, string, string];
    endTime: [string, string];
    startTime: [string, string];
    reportName?: string;
    selfLearningName?: string;
    category: string;
}

interface Reports {
    [key: string]: Elements;
}

interface Elements {
    report : Items[];
    selfLearning : Items[];
}

const AssignmentAdd = ( {className, visible, handleAddClick, setReportCard, reportData, ...props }: Props) => {
    const lecRef = useRef<HTMLSelectElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    const handleEndChange = () => {
        const end = endRef.current?.value as string;
        startRef.current!.setAttribute('max', end);
    }

    const handleStartChange = () => {
        const start = startRef.current?.value as string;
        endRef.current!.setAttribute('min', start);
    }

    const contentsReset = () => {
        nameRef.current!.value = '';
        startRef.current!.value = '';
        endRef.current!.value = '';
    }

    const checkName = () => {
        const name = nameRef.current?.value as string;
        if(name === '') {
            alert('タイトルを入力してください');
            return false;
        }
        return true;
    }

    const checkDate = () => {
        const start = startRef.current?.value as string;
        const end = endRef.current?.value as string;
        if(start === '' || end === '') {
            alert('期限を入力してください');
            return false;
        }
        return true;
    }

    const validate = () => {
        if(checkDate() && checkName()) {
            return true;
        }
        return false;
    }

    const handleCancelClick = () => {
        contentsReset()
        handleAddClick()
        return
    }

    const handleReportAdd = async () => {
        if(!validate()) {
            return
        }
        const oldData: Items[] = [];
        const lecture = lecRef.current?.value as string;
        const name = nameRef.current?.value as string;
        const start = startRef.current?.value as string;
        const end = endRef.current?.value as string;

        const startDate = start?.split('T')[0].split('-') as [string, string, string];
        const startTime = start?.split('T')[1].split(':') as [string, string];
        const endDate = end?.split('T')[0].split('-') as [string, string, string];
        const endTime = end?.split('T')[1].split(':') as [string, string];

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
            if (data[lecture]) {
                oldData.push(...data[lecture]); // `lecture` に対応するデータが存在する場合のみ追加
            }
        }

        const newReportData = {
            reportName: name,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            category: 'レポート',
            id: ulid()
        }

        await setDoc(lectureRef, {
            [lecture]: [...oldData ,newReportData]
        })

        contentsReset()
        setReportCard()
        handleAddClick()
    }

    return (
        <div className={twMerge(`fixed w-11/12 h-[260px] rounded-md shadow-md bg-gray-50 ${visible ? 'block' : 'hidden'}`, className)} {...props} >
            <label className="font-bold text-green-400 text-2xl ml-2 mt-3" htmlFor="display">講義</label>
            <select name="display" id="display" className='block w-11/12 h-10 mx-auto bg-transparent text-[#333] font-bold text-lg outline-none border-b border-green-400 leading-3 mb-2' ref={lecRef}>
                {Object.keys(reportData).map((key, index) => (
                    <option key={index} value={key}>{key}</option>
                ))}
            </select>
            <label className="font-bold text-green-400 text-2xl ml-2 mt-3 leading-3" htmlFor="display">タイトル</label>
            <input className="block w-11/12 h-9 mx-auto bg-transparent text-[#333] font-bold text-lg outline-none border-b border-green-400 leading-3 mb-3" type="text" required ref={nameRef} />
            <label className="font-bold text-green-400 text-2xl ml-2 mt-3 leading-3" htmlFor="display">期限</label>
            <div className="flex justify-around items-center mx-auto">
                <input className="block w-[calc(50%-35px)] h-9 mx-auto bg-transparent text-[#333] font-bold text-sm outline-none border-b border-green-400" type="datetime-local" ref={startRef} onChange={handleStartChange} />
                <p className="h-0.5 w-3 bg-green-400"></p>
                <input className="block w-[calc(50%-35px)] h-9 mx-auto bg-transparent text-[#333] font-bold text-sm outline-none border-b border-green-400" type="datetime-local" ref={endRef} onChange={handleEndChange} />
            </div>
            <div className="relative h-12 w-11/12 mx-auto">
                <button className="absolute top-1/2 translate-y-[-50%] right-24 w-32 h-10 bg-red-400 rounded-md text-xl font-bold text-white mr-1" onClick={handleCancelClick}>キャンセル</button>
                <button className="absolute top-1/2 translate-y-[-50%] right-0 font-bold text-xl text-white w-24 h-10 bg-green-400 rounded-md" onClick={handleReportAdd}>追加</button>
            </div>
        </div>
    )
}

export default AssignmentAdd;