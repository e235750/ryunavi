import { IoHomeOutline } from "react-icons/io5";
import { CiGrid41 } from "react-icons/ci";
import { MdOutlineAssignment } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { LiaSchoolSolid } from "react-icons/lia";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="fixed flex justify-center items-center bottom-0 w-screen max-w-[420px] h-20 bg-white shadow-lg gap-x-20">
            <Link href="/time-table" className="flex flex-col justify-center items-center">
                <CiGrid41 size={"35px"} />
                <p className="text-xs text-[#555]" >時間割</p>
            </Link>
            <Link href="/" className="flex flex-col justify-center items-center translate-y-[-18%]">
                <div className="flex justify-center items-center w-14 h-14 rounded-full shadow-md bg-green-300">
                        <IoHomeOutline size={"35px"} color={"green"} />
                </div>
                <p className="text-xs text-[#555] mt-1">ホーム</p>
            </Link>
            <Link href="/assignment" className="flex flex-col justify-center items-center">
                <MdOutlineAssignment size={"35px"}/>
                <p className="text-xs text-[#555]" >課題</p>
            </Link>
        </div>
    )
}

export default Footer