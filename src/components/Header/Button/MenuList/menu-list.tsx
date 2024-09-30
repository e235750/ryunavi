import { useRef } from 'react'

interface Props {
    active: boolean
}
const MenuList = ({ active }: Props) => {
    const listRef = useRef<HTMLDivElement>(null)
    if(listRef.current) {
        if(!active) {
            listRef.current.classList.remove('scale-x-100')
            listRef.current.classList.add('scale-x-0')
        } else {
            listRef.current.classList.remove('scale-x-0')
            listRef.current.classList.add('scale-x-100')
        }
    }
    
  return (
    <div className="fixed z-10 w-2/3 max-w-[300px] h-screen bg-white shadow-2xl rounded-r-md origin-left scale-x-0 duration-300" ref={listRef}>

    </div>
  )
}

export default MenuList