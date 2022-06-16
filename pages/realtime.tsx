import type {NextPage} from 'next'
import Image from "next/image";
import {useIntersection, useScrolling, useWindowScroll} from "react-use";
import {useEffect, useRef, useState} from "react";
import { Transition } from '@headlessui/react';
import {classNames} from "../utils/classnames";
import CloseIcon from "../public/close.png";
import AvatarSpinner from "../components/avatar-spinner";
import Upload from "../public/upload.png";
import {supabase} from "../utils/supabase-client";


const RealTime: NextPage = () => {
    const [image, setImage] = useState<string>("https://mfbhtfficbbndnplecms.supabase.co/storage/v1/object/public/bucket/app_selfies/29.jpeg")

    const handleInsert = (payload: any) => {
        setImage(payload.new.imageUrl)
    }
    const mySubscription = supabase
        .from('answers')
        .on('INSERT', handleInsert)
        .subscribe()

    return (
        <>
                <div className={"w-full relative h-screen flex flex-col items-center justify-end"}>
                    <div className={"w-full h-full absolute top-0 left-0 z-20"}>
                        <Image src={image} layout={"fill"} className={"object-fill"}/>
                    </div>
                    <div className={"w-full h-full absolute top-0 left-0 bg-black z-30 opacity-30"}>
                    </div>
                </div>
        </>

    )
}

export default RealTime
