import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { IoDocumentText } from "react-icons/io5";
import db from "../../firebase"
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { ulid } from "ulid";

type Props = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    handleMemoAdd: () => void;
    lectureName: string;
    reportName: string;
};

const MemoWrite = ({ className, handleMemoAdd, lectureName, reportName, ...props }: Props) => {
    const getMemo = async () => {
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }
        const userRef = doc(db, userID, "assignment")
        const memoRef = collection(userRef, "memo")
        const lectureRef = doc(memoRef, lectureName)
        const lectureDoc = collection(lectureRef, "report")
        const reportRef = doc(lectureDoc, reportName)
        const reportSnap = await getDoc(reportRef)
        if(reportSnap.exists()) {
            const data = reportSnap.data()
            return data.memo
        }
        return []
    }
    const handleSaveClick = async () => {
        const memos = await getMemo()
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }
        const userRef = doc(db, userID, "assignment")
        const memoRef = collection(userRef, "memo")
        const lectureRef = doc(memoRef, lectureName)
        const lectureDoc = collection(lectureRef, "report")
        const reportRef = doc(lectureDoc, reportName)
        const memo = document.querySelector('textarea')?.value
        if(!memo) {
            return
        }
        memos.push({id: ulid(), content: memo})
        //reportRefにメモの内容をリスト形式で追加、個々のメモをIDで管理
        await setDoc(reportRef, {memo: memos})
        handleMemoAdd()
    }
    return (
        <div className={twMerge("fixed flex flex-col w-11/12 h-[250px] rounded-md bg-gray-50 shadow-md", className)} {...props}>
            <div className='flex justify-start items-center ml-4'>
                <IoDocumentText className='text-green-400 text-2xl mt-2' />
                <div className='text-xl text-green-400 font-bold mt-2 ml-1'>メモ作成</div>
            </div>
            <div className='w-full h-[1px] mx-auto bg-gray-200 mb-2'></div>
            <textarea className="w-[calc(100%-20px)] h-40 translate-x-[10px] outline-none bg-transparent resize-none" name="memo" autoFocus></textarea>
            <div className="flex justify-end gap-x-1">
                <button className="w-32 h-10 bg-red-400 rounded-md text-xl font-bold text-white mr-1" onClick={handleMemoAdd}>キャンセル</button>
                <button className="w-20 h-10 bg-green-400 rounded-md text-xl font-bold text-white mr-1" onClick={handleSaveClick}>保存</button>
            </div>
        </div>
    )
}

export default MemoWrite;
