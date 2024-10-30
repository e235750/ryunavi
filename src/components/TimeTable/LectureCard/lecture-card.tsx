import './layout.css'
import Link from "next/link";

interface Props {
    lectureName: string
    place: string
    lectureCode: string
}

const LectureCard = ({ lectureName, place, lectureCode }: Props) => {
    return (
        <Link href={`syllabus/${lectureCode}`} className="block relative w-full max-h-28 min-h-10 h-4/5 rounded-sm bg-blue-300 overflow-hidden my-1">
            <div className="relative flex justify-center items-center text-center w-full h-3/5 mt-2 overflow-y-scroll">
                <div className="w-11/12 text-xs">{lectureName}</div>
            </div>
            <div className="absolute w-11/12 text-center bottom-0.5 left-1/2 translate-x-[-50%] text-xs rounded-sm bg-white whitespace-nowrap overflow-x-scroll scroll-bar">{place}</div>
        </Link>
    )
}

export default LectureCard;