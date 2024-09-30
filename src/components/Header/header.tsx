"use client"
import { useState } from "react"
import Button from "./Button/button"
import { IconContext } from "react-icons";
import { GoBell } from "react-icons/go";
import MenuList from "./Button/MenuList/menu-list";

const Header = () => {
    const [active, setActive] = useState(false)
  return (
    <>
      <div className="flex justify-between place-items-center w-full mx-auto my-0 h-14">
          <Button position="ml-6" setActive={setActive}/>
          <div className="text-green-500 text-2xl font-bold">りゅうナビ！</div>
          <button>
            <IconContext.Provider value={{ size: "30px", className: "mr-6" }}>
                <GoBell />
            </IconContext.Provider>
          </button>
      </div>
      <MenuList active={active} />
    </>
  )
}

export default Header