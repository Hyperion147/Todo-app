import React from 'react'

const HeroSection = () => {
  return (
    <div className="min-h-[800px]">
        <div className='bg-green-300 flex justify-around'>
                <h2 className="text-center text-3xl font-bold  py-5 tech">TODO</h2>
                <p className='flex items-center font-bold'>Go + React</p>
                <ul className='flex items-center gap-4 text-[20px] font-bold'>
                    <li>Login</li>
                    <li>Signup</li>
                </ul>
        </div>
    </div>
  )
}

export default HeroSection