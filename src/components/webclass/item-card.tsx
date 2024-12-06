import { FaCheck } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Items {
    lectureName: string;
    endDate: [string, string, string];
    startDate: [string, string, string];
    endTime: [string, string];
    startTime: [string, string];
    reportName: string;
    category: string;
    cardNumber: number;
    setComplete: (cardNumber: number, reportCard: {card: React.JSX.Element, complete: boolean, cardNumber: number, date: Date, start: Date}[]) => void;
    handleRemoveClick: (lectureName: string, id: string) => void;
    setReportCard: () => void;
    reportCard: { card: JSX.Element, complete: boolean, cardNumber: number, date: Date, start: Date}[];
    added: boolean;
    id: string;
}

const ItemCard = ({ lectureName, endDate, startDate, endTime, startTime, reportName, category, cardNumber, setComplete, handleRemoveClick, setReportCard, reportCard, added, id }: Items) => {
    const remove = () => {
        handleRemoveClick(lectureName, id)
        setReportCard()
    }
    //スラッシュが含まれていたら、ルーティングに影響するため、エンコードする
    const encodedReportName = encodeURIComponent(reportName)
    return (
        <div className="relative w-full h-fit">
            <button className="absolute flex justify-center items-center w-8 h-8 bg-white rounded-md top-2 right-5 text-[#666] opacity-60 z-10" onClick={() => setComplete(cardNumber, reportCard)}>
                <FaCheck color="gray" size={20} />
            </button>
            <button className={`absolute flex justify-center items-center w-8 h-8 bg-white rounded-md top-2 right-14 text-[#666] opacity-60 z-10 ${added ? 'block' : 'hidden'}`} onClick={remove}>
                <RiDeleteBin5Line color="gray" size={20} />
            </button>
            <a href={`assignment/${encodedReportName}?lecture=${lectureName}&category=${category}`} className="relative block z-0">
                <div className="relative flex flex-col justify-around w-11/12 h-24 bg-gray-50 shadow-md mx-auto rounded-md my-2 z-0">
                    <input type="text" className="text-xs text-[#666] w-11/12 mx-auto rouded-md bg-transparent" disabled value={lectureName} />
                    <input type="text" className="text-2xl font-bold text-[#555] w-11/12 mx-auto rouded-md bg-transparent" disabled value={reportName} />
                    <div className="w-11/12 h-[1px] bg-gray-600 mx-auto rounded-full"></div>
                    <div className="flex w-11/12 mx-auto">
                        <div className="text-[#666] self-end">{category}</div>
                        <div className="text-sm text-[#666] ml-4 self-start">利用可能期間</div>
                        <div className="flex flex-col w-1/2 text-lg  text-[#555]">
                            <div className="flex leading-none self-center">
                                <div>
                                    <span>{startDate[0]}</span>/<span>{startDate[1]}</span>/<span>{startDate[2]}</span>
                                </div>
                                &nbsp;
                                <div>
                                    <span>{startTime[0]}</span>:<span>{startTime[1]}</span>
                                </div>
                                <div className="leading-none self-center w-2 h-[1px] bg-[#666] rounded-sm ml-1 mb-0.5"></div>
                            </div>
                            <div className="flex leading-none self-end">
                                <div>
                                    <span>{endDate[0]}</span>/<span>{endDate[1]}</span>/<span>{endDate[2]}</span>
                                </div>
                                &nbsp;
                                <div>
                                    <span>{endTime[0]}</span>:<span>{endTime[1]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default ItemCard;