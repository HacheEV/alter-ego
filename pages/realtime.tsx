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
    const [loading, setLoading] = useState<boolean>(false)

    const handleInsert = (payload: any) => {
        setLoading(true)
        setImage(payload.new.imageUrl)
    }
    const mySubscription = supabase
        .from('answers')
        .on('INSERT', handleInsert)
        .subscribe()

    return (
        <>
            <div className={"w-full relative h-screen flex flex-col items-center justify-end"}>
                {loading && (
                    <div className={"w-full h-full absolute top-0 left-0 z-30 bg-dark flex items-center justify-center"}>
                       <AvatarSpinner isLoader={true} />
                    </div>
                )}
                <div className={"w-full h-full absolute top-0 left-0 z-20"}>
                    <Image src={image} layout={"fill"} className={"object-fill"} priority quality={50} onLoadingComplete={() => setLoading(false)} />
                </div>

            </div>
        </>

    )
}

export default RealTime
