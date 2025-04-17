"use client"
import Image from "next/image";
import React from "react";
import { motion, useTime, useTransform } from "framer-motion";
import Link from "next/link";


const Landing = () => {

    const time = useTime();

  const rotate = useTransform(time, [0,3000], [0, 160], {
      clamp: false,
  });
  const rotatingBg = useTransform(rotate, (r) => {
      return `conic-gradient(from ${r}deg, #4338ca, #172554 , #3b82f6, #4338ca, #172554 , #3b82f6, #4338ca`
  })

    return ( 
        <div className="mx-8">
        <div 
          className="grainy "
        >
  
        </div>
        <nav className="w-full max-w-[980px] backdrop-blur-sm mx-auto sticky top-3 p-2 z-20 flex justify-between rounded-lg">
          <div className="size-8 bg-neutral-950 rounded-md flex justify-center items-center">
            <Image
              src="/brand/logo.svg"
              alt="logo"
              width={26}
              height={26}
            />
  
          </div>
          <button className="bg-white text-black rounded-md px-3 ">
            <Link href="/get-started">
              Get Started
            </Link>
          </button>
        </nav>
        <main>
        <div className="min-h-screen flex flex-col justify-center items-center">
        {/* <div className="absolute w-full h-[700px] bg-[radial-gradient(circle,_rgba(104,192,255,0.6)_0%,_transparent_70%)] blur-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div> */}
  
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[900px] h-[900px] bg-blue-500 opacity-50 blur-[180px] rounded-full animate-cloudy-1"></div>
          <div className="absolute top-[40%] left-[55%] w-[800px] h-[800px] bg-blue-600 opacity-40 blur-[160px] rounded-full animate-cloudy-2"></div>
          <div className="absolute top-[60%] left-[25%] w-[1000px] h-[1000px] bg-blue-400 opacity-30 blur-[200px] rounded-full animate-cloudy-3"></div>
        </div>
  
          <div>
              <div className="absolute w-full h-48 left-0 mt-48 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_2px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px]">
              </div>
              <div className="relative bg-neutral-950 w-full max-w-[980px] mx-auto  px-8 py-16 flex justify-between border border-blue-600">
                <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#262626_0.5px,transparent_1px)] [background-size:4px_4px]"></div>
                
                <h1 className="text-8xl text-center font-sans font-bold text-white z-10">
                  Make the best websites modern <span className="text-blue-600">Developers</span>.
                </h1>
  
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-blue-600 text-white" />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-blue-600 text-white" />
                <div className="absolute -left-1.5 -bottom-1.5 h-3 w-3 bg-blue-600 text-white" />
                <div className="absolute -right-1.5 -bottom-1.5 h-3 w-3 bg-blue-600 text-white" />
              </div>
          </div>
          </div>
          <div className="relative flex justify-center items-center w-full min-h-[500px]">
            <div className="absolute w-full">
              <Image
                src="/brand/logo.svg"
                alt="logo"
                width={480}
                height={480}
                className="mx-auto opacity-5"
              />
            </div>
            <h2 className="text-center text-white drop-shadow-[0px_0px_100px_rgba(21,93,252,1)] text-6xl font-bold leading-relaxed text-balance">You imagine the &apos;<span className="text-blue-600">What</span>&apos;. <br /> We engineer the &apos;<span className="text-blue-600">How</span>&apos;. <br /> We believe in the &apos; <span className="text-blue-600">Why</span>&apos;.</h2>
            
          </div>
  
          <div className="border-2 border-neutral-800 rounded-2xl aspect-video w-full p-6">
            <div className="relative h-full w-full">
                    <button className="relative px-3 py-2 h-full w-full grainy bg-neutral-900 text-black rounded-md z-10">
                            Rotating Border Gradient
                        </button>
                  <motion.div
                            className="absolute -inset-[2px] rounded-md"
                            style={{
                                background: rotatingBg
                            }}
                  />
  
            </div>
          </div>
  
        </main>
        <footer className="h-screen">
          <p>© 2024 My Website</p>
        </footer>
      </div>
     );
}
 
export default Landing;