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

interface Props {
    //戻り値がvoidの関数
    //関数の引数はe: React.ChangeEvent<HTMLSelectElement>
    handleDisplayChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleDevelopmentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleTargetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeadlineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleOptionClick: () => void;
    reportData: Reports;
    visible: boolean;
    target: string;
}

const Setting = ({ handleDevelopmentChange, handleDisplayChange, handleDeadlineChange, handleSortChange, handleTargetChange, handleOptionClick , reportData, visible, target}: Props) => {

    return (
        <div className={`fixed flex flex-col justify-around top-28 left-1/2 translate-x-[-50%] w-2/3 min-w-52 max-w-64 h-[45%] rounded-md bg-gray-50 shadow-xl duration-100 ${visible ? 'block' : 'hidden'}`}>
                <label htmlFor="display" className='font-bold text-green-400 text-2xl ml-2 mt-3 leading-4'>表示</label>
                <div className='flex justify-start items-center gap-x-1 flex-wrap mt-1'>
                    <input
                        type="radio"
                        name="option"
                        id="display"
                        value="レポート"
                        onChange={handleTargetChange}
                        className='mx-2'
                        checked={target === "レポート"}
                    />
                    <label className="font-bold text-base" htmlFor="display">レポート</label>

                    <input
                        type="radio"
                        name="option"
                        id="self-learning"
                        value="自習"
                        onChange={handleTargetChange}
                        className='mx-2'
                        checked={target === "自習"}
                    />
                    <label className="font-bold text-base mr-20" htmlFor="self-learning">自習</label>

                    <input
                        type="radio"
                        name="option"
                        id="all"
                        value="all"
                        onChange={handleTargetChange}
                        className='mx-2'
                        checked={target === "all"}
                    />
                    <label className="font-bold text-base " htmlFor="all">レポート・自習</label>
                </div>
                <select name="display" id="display" className='block w-11/12 h-10 mx-auto bg-transparent text-[#333] font-bold text-lg outline-none border-b border-green-400' onChange={handleDisplayChange}>
                    <option value="all">全て</option>
                    {Object.keys(reportData).map((key, index) => (
                        <option key={index} value={key}>{key}</option>
                    ))}
                </select>
                <p className="bg-gray-200 w-full h-[1px] mx-auto my-3"></p>
                <label htmlFor="development" className='font-bold text-green-400 text-2xl ml-2 leading-4'>期限</label>
                <select name="development" id="development" className='block w-11/12 h-10 mx-auto bg-transparent text-[#333] font-bold text-lg outline-none border-b border-green-400' onChange={handleDeadlineChange}>
                    <option value="all">全て</option>
                    <option value="within-deadline">期限内</option>
                    <option value="out-of-deadline">期限外</option>
                </select>
                <p className="bg-gray-200 w-full h-[1px] mx-auto my-3"></p>
                <label htmlFor="development" className='font-bold text-green-400 text-2xl ml-2 leading-4'>進歩</label>
                <select name="development" id="development" className='block w-11/12 h-10 mx-auto bg-transparent text-[#333] font-bold text-lg outline-none border-b border-green-400' onChange={handleDevelopmentChange}>
                    <option value="all">全て</option>
                    <option value="complete">完了</option>
                    <option value="uncomplete">未完了</option>
                </select>
                <p className="bg-gray-200 w-full h-[1px] mx-auto my-3"></p>
                <label htmlFor="sort" className='font-bold text-green-400 text-2xl ml-2 leading-4'>並べ替え</label>
                <select name="sort" id="sort" className='block w-11/12 h-10 mx-auto bg-transparent text-[#333] font-bold text-lg outline-none border-b border-green-400' onChange={handleSortChange}>
                    <option value="deadline-ascending-order">締切日(近い順)</option>
                    <option value="deadline-descending-order">締切日(遠い順)</option>
                </select>
                <button className="font-bold text-xl text-white self-end w-24 h-10 bg-green-400 rounded-md mr-5 my-1" onClick={handleOptionClick}>完了</button>
        </div>
    )
}

export default Setting;