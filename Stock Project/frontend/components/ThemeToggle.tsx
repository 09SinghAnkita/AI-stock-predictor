import { useEffect, useState } from "react"

export const ToggleDarkMode = () =>{

    const [ toggleDarkMode, setToggleDarkMode] = useState(true)

    useEffect(()=>{

        document.documentElement.classList.toggle('dark',toggleDarkMode)

},[toggleDarkMode])




    return <button onClick={()=>setToggleDarkMode(toggle => !toggle)} className="px-3 py-1 rounded-2xl border text-sm ">

        {toggleDarkMode ? 'Dark Mode Enabled' : 'Light mode Enabled'}

    </button>
}