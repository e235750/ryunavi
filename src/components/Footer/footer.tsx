import { IconContext } from "react-icons";
import { IoHomeOutline } from "react-icons/io5";
import { CiGrid41 } from "react-icons/ci";
import { MdOutlineAssignment } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { LiaSchoolSolid } from "react-icons/lia";

const Footer = () => {
    return (
        <div className="absolute flex justify-around items-center bottom-0 w-full h-20 shadow-lg">
            <button className="flex flex-col justify-center items-center">
                <CiGrid41 size={"35px"} />
                <p className="text-xs text-[#555]" >時間割</p>
            </button>
            <button className="flex flex-col justify-center items-center">
                <MdOutlineAssignment size={"35px"}/>
                <p className="text-xs text-[#555]" >課題</p>
            </button>
            <button className="translate-y-[-24%]">
                <div className="flex justify-center items-center w-20 h-20 rounded-full shadow-md bg-green-200">
                        <IoHomeOutline size={"40px"} color={"green"} />
                </div>
                <p className="text-xs text-[#555] mt-1">ホーム</p>
            </button>
            <button className="flex flex-col justify-center items-center">
                <LiaSchoolSolid size={"35px"}/>
                <p className="text-xs text-[#555]" >WebClass</p>
            </button>
            <button className="flex flex-col justify-center items-center">
                <IoSettingsOutline size={"35px"}/>
                <p className="text-xs text-[#555]" >設定</p>
            </button>
        </div>
    )
}

export default Footer