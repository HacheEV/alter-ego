import type {NextPage} from 'next'
import Image from "next/image";
import {useIntersection, useScrolling, useWindowScroll} from "react-use";
import {useEffect, useRef, useState} from "react";
import { Transition } from '@headlessui/react';
import {classNames} from "../utils/classnames";


const Welcome: NextPage = () => {

    const [showTitle, setShowTitle] = useState<boolean>(false)
    const [showSubTitle, setShowSubTitle] = useState<boolean>(false)
    const [showMessage, setShowMessage] = useState<boolean>(false)
    const [showQR, setShowQR] = useState<boolean>(false)
    const intersectionRef = useRef(null);
    const intersection = useIntersection(intersectionRef, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    });

    setTimeout(() => {
        setShowTitle(true)
    }, 1000)
    setTimeout(() => {
        setShowSubTitle(true)
    }, 1750)
    setTimeout(() => {
        setShowMessage(true)
    }, 2500)

    useEffect(() => {
        if(intersection?.isIntersecting){
            setShowQR(true)
        }
    }, [intersection])

    return (
        <div className={"bg-dark"}>
            {!showQR && (
                <>
                    <div
                        className="flex flex-col justify-center items-center bg-dark h-screen text-white px-2 py-3 font-Inter">
                        <div
                            className="w-full flex flex-col items-center justify-center rounded-[25px] m-2">
                            <div className={"w-full h-[90%] font-Inter flex flex-col pl-8 pr-10 "}>
                                <Transition
                                    show={showTitle}
                                    as="span"
                                    enter={classNames("transition-all ease-in-out duration-[2000ms]")}
                                    enterFrom="opacity-0 transform translate-y-16"
                                    enterTo="opacity-100 transform translate-y-0"
                                >
                                    <span className={"text-6xl font-extrabold"}>Hey there!</span>
                                </Transition>
                                <Transition
                                    show={showSubTitle}
                                    as="span"
                                    enter={classNames("transition-all ease-in-out duration-[2000ms]")}
                                    enterFrom="opacity-0 transform translate-y-16"
                                    enterTo="opacity-100 transform translate-y-2"
                                >
                                    <span className={"text-2xl text-gray-400 mt-4"}>Nice to meet you ;)</span>
                                </Transition>
                                <Transition
                                    show={showMessage}
                                    as="span"
                                    enter={classNames("transition-all ease-in-out duration-[2000ms]")}
                                    enterFrom="opacity-0 transform translate-y-20"
                                    enterTo="opacity-100 transform translate-y-4"
                                >
                                    <span className={"text-2xl text-gray-400 mt-5 leading-[1.375rem]"}>I think you are an interesting person, let's get to know each other if it's ok with you</span>
                                </Transition>
                            </div>
                        </div>

                    </div>
                    <div className={"w-24 h-[20rem] bg-dark"} ref={intersectionRef}>
                    </div>
                </>
            )}
                <div
                    className="flex flex-col justify-center items-center bg-dark h-screen text-white px-2 py-3 font-Inter">
                    <Transition
                        show={showQR}
                        enter={classNames("transition-all ease-in-out duration-[3000ms]")}
                        enterFrom="opacity-0 transform translate-y-20"
                        enterTo="opacity-100 transform translate-y-0"
                    >
                        <div className="py-8 px-4 sm:rounded-lg mt-14 sm:px-10">
                            <div className={"w-56 h-72  relative flex items-center justify-center"}>
                                <div className={"w-4 h-4 border-t-2 border-l-2 border-white absolute top-0 left-0 animate-pulse"}>
                                </div>
                                <div className={"w-4 h-4 border-t-2 border-r-2 border-white absolute top-0 right-0 animate-pulse"}>
                                </div>
                                <div className={"w-4 h-4 border-b-2 border-l-2 border-white absolute bottom-0 left-0 animate-pulse"}>
                                </div>
                                <div className={"w-4 h-4 border-b-2 border-r-2 border-white absolute bottom-0 right-0 animate-pulse"}>
                                </div>
                                <div className={"bg-dark flex flex-col items-center absolute top-4 w-56 h-56"}>
                                    <Image src={"/qr.png"} layout={"fill"} className={"border-2 "}/>
                                </div>
                                <span className={"text-white text-xl absolute bottom-4"}>SCAN ME</span>
                            </div>
                        </div>
                    </Transition>
                </div>
        </div>

    )
}

export default Welcome
