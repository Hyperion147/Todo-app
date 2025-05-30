import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const Navbar = () => {
    const navbarRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        const commonAnimation = {
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        };
        mm.add("(min-width: 768px)", () => {
            gsap.set(navbarRef.current, {
                height: "75px",
                borderRadius: '12px',
                width: "100%",
                margin: "10px auto",
                opacity: 0
            });
            
            gsap.to(navbarRef.current, {
                width: "45%",
                borderRadius: '9999px',
                ...commonAnimation
            });
        });
        mm.add("(max-width: 767px)", () => {
            gsap.set(navbarRef.current, {
                height: "65px", 
                width: "100%",
                margin: "8px auto", 
                opacity: 0
            });
            
            gsap.to(navbarRef.current, {
                width: "100%", 
                ...commonAnimation
            });
        });

        return () => mm.revert(); // Cleanup
    }, { scope: navbarRef });

    return (
        <nav ref={navbarRef} className='bg-primary border border-gray-700 shadow-md flex justify-center bgImg'>
            <div className='container mx-auto px-4 sm:px-6 py-3 sm:py-5 flex justify-around items-center gap-2 sm:gap-0 z-10'>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-l from-slate-400 to-slate-200 bg-clip-text text-transparent tech cursor-default">TODO</h1>
                <p className='text-text font-medium text-sm sm:text-base hidden sm:block'>Go + React</p>
                <nav>
                    <ul className='flex items-center gap-3 sm:gap-6'>
                        <li className='hover:text-gray-400 transition-colors cursor-pointer text-base sm:text-xl'>LOGIN</li>
                        <li className='hover:text-gray-400 transition-colors cursor-pointer text-base sm:text-xl'>SIGNUP</li>
                    </ul>
                </nav>
            </div>
        </nav>
    );
};

export default Navbar;