import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { IoDocumentText } from "react-icons/io5";
import db from "../../firebase"
import { doc, collection, getDoc, setDoc } from "firebase/firestore";

type Props = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    handleMemoShow: () => void;
    content: string;
    lectureName: string;
    reportName: string;
    memoID: string;
};

const MemoShow = ({ className, handleMemoShow, content, lectureName, reportName, memoID, ...props }: Props) => {
    const getMemo = async () => {
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }
        const userRef = doc(db, userID, "assignment")
        const lectureRef = collection(userRef, lectureName)
        const reportRef = doc(lectureRef, reportName)
        const reportSnap = await getDoc(reportRef)
        if(reportSnap.exists()) {
            const data = reportSnap.data()
            return data.memo
        }
        return []
    }

    const removeMemo = async () => {
        const memos = await getMemo()
        const userID = process.env.NEXT_PUBLIC_LOGIN_ID
        if(!userID) {
            return
        }
        const userRef = doc(db, userID, "assignment")
        const lectureRef = collection(userRef, lectureName)
        const reportRef = doc(lectureRef, reportName)
        const newMemos = memos.filter((memo: {id: string, content: string}) => memo.id !== memoID)
        await setDoc(reportRef, {memo: newMemos})
        handleMemoShow()
    }

    return (
        <div className={twMerge("fixed flex flex-col w-11/12 h-[250px] rounded-md bg-gray-50 shadow-md", className)} {...props}>
            <div className='flex justify-start items-center ml-4'>
                <IoDocumentText className='text-green-400 text-2xl mt-2' />
                <div className='text-xl text-green-400 font-bold mt-2 ml-1'>メモ</div>
            </div>
            <div className='w-full h-[1px] mx-auto bg-gray-200 mb-2'></div>
            <textarea className="w-[calc(100%-20px)] h-40 translate-x-[10px] outline-none bg-transparent resize-none" name="memo" value={content} disabled></textarea>
            <div className="flex justify-end gap-x-1">
            <button className="w-20 h-10 bg-red-400 rounded-md text-xl font-bold text-white mr-1" onClick={removeMemo}>削除</button>
                <button className="w-20 h-10 bg-green-400 rounded-md text-xl font-bold text-white mr-1" onClick={handleMemoShow}>完了</button>
            </div>
        </div>
    )
}

export default MemoShow;
