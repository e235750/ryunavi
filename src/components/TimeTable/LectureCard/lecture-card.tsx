interface Props {
    lectureName: string
    place: string
}

const LectureCard = ({ lectureName, place }: Props) => {
    return (
        <div className="relative w-full h-full rounded-md bg-blue-300">
            <div className="relative flex justify-center items-center w-full h-3/5 top-[10%]">
                <div className="w-11/12 text-sm">{lectureName}</div>
            </div>
            <div className="absolute w-11/12 text-center bottom-0.5 left-1/2 translate-x-[-50%] text-xs rounded-sm bg-white">{place}</div>
        </div>
    )
}

export default LectureCard;