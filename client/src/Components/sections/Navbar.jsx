import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(useGSAP)

const Navbar = () => {
    const navbarRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(navbarRef.current, {
                height: "75px",
                borderRadius: '12px',
                width: "100%",
                margin: "10px auto",
                opacity: 0
            })
            gsap.to(navbarRef.current, {
                width: "70%",
                borderRadius: '9999px',
                duration: 1,
                opacity: 1
            })
        }, navbarRef)
        return () => ctx.revert()
    }, [])


    return (
        <nav ref={navbarRef} className='bg-primary border border-gray-700 shadow-md'>
            <div className='container mx-auto px-4 py-5 flex justify-around items-center'>
                <h1 className="text-3xl font-bold text-text tech">TODO</h1>
                <p className='text-text font-medium'>Go + React</p>
                <nav>
                    <ul className='flex items-center gap-6'>
                        <li className='hover:text-gray-400 transition-colors cursor-pointer text-xl'>LOGIN</li>
                        <li className='hover:text-gray-400 transition-colors cursor-pointer text-xl'>SIGNUP</li>
                    </ul>
                </nav>
            </div>
        </nav>
    )
}

export default Navbar