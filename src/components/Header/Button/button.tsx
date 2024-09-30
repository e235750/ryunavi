"use client"
import { useRef } from 'react'

interface Props {
    position?: string
    setActive: Function
}

const button = ({ setActive, position }: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const bar1Ref = useRef<HTMLDivElement>(null)
    const bar2Ref = useRef<HTMLDivElement>(null)
    const bar3Ref = useRef<HTMLDivElement>(null)

    const handleClick = () => {
        if (buttonRef.current && bar1Ref.current && bar2Ref.current && bar3Ref.current) {
            buttonRef.current.classList.toggle('active')
            if(buttonRef.current.classList.contains('active')) {
                bar1Ref.current.classList.add('rotate-45', 'scale-x-110')
                bar2Ref.current.classList.remove('scale-x-1')
                bar2Ref.current.classList.add('scale-x-0')
                bar3Ref.current.classList.add('-rotate-45', 'scale-x-110')
                setActive(true)
            } else {
                bar1Ref.current.classList.remove('rotate-45', 'scale-x-110')
                bar2Ref.current.classList.remove('scale-x-0')
                bar2Ref.current.classList.add('scale-x-1')
                bar3Ref.current.classList.remove('-rotate-45', 'scale-x-110')
                setActive(false)
            }
        }
    }
  return (
    <button className={`flex flex-col justify-center place-items-center w-10 h-10 ${position}`} ref={buttonRef} onClick={handleClick}>
        <div className="w-7 h-[3px] my-1 bg-[#333] rounded-full origin-left duration-300" ref={bar1Ref}></div>
        <div className="w-7 h-[3px] my-1 bg-[#333] rounded-full origin-left scale-x-1 duration-300" ref={bar2Ref}></div>
        <div className="w-7 h-[3px] my-1 bg-[#333] rounded-full origin-left duration-300" ref={bar3Ref}></div>
    </button>
  )
}

export default button