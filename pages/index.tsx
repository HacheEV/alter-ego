import type {NextPage} from 'next'
import {supabase} from "../utils/supabase-client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import {classNames} from "../utils/classnames";
import Image from "next/image";
import moment from "moment";

interface Profile {
    id: string;
    username: string;
    role: number;
}

const Home: NextPage = () => {
    const router = useRouter()
    const user = supabase.auth.user();
    const [profile, setProfile] = useState<Profile>()
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [userImages, setUserImages] = useState<string[]>([])
    const [imageCounter, setImageCounter] = useState<number>(0)
    const [imageUploaded, setImageUploaded] = useState<File>()
    const [endGame, setEndGame] = useState<boolean>(false)
    const [conversation, setConversation] = useState<any>([])

    const amountImages: number[] = [1, 2, 3]
    const randomImage: number = amountImages[Math.floor(Math.random() * amountImages.length)]

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user])

    const getImageRandom = async () => {
        const { publicURL, error } = supabase
            .storage
            .from('bucket')
            .getPublicUrl(`app_selfies/${randomImage}.jpg`  )
        if(publicURL !== null){
            setImageUrls([...imageUrls, publicURL]);
        }

    }
    const handleImage = () => {
        getImageRandom()
        setImageCounter(imageCounter + 1)
    }
    const getProfile = async () => {
        try {
            const {data, error} = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
            if (data) setProfile(data[0])
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getProfile()
    }, [setProfile])

    const handleLogout = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) console.log(error)
        router.push('/login')
    }
    const navigation = [
        { name: 'Conversations', href: '/conversations', current: true }
    ]
    const handleUploadImage = (e:any) => {
        if (!e.target.files || e.target.files.length === 0) {
            throw new Error('You must select an image to upload.')
        }
        setImageUploaded(e.target.files[0])
    }


    const uploadImage = async (e: any) => {
        try {
            // setUploading(true)

            if(imageUploaded){
                const fileName = `${profile?.username}_${imageCounter}`

                let { data, error: uploadError } = await supabase.storage
                    .from('bucket')
                    .upload(fileName, imageUploaded)
                if (uploadError) {
                    throw uploadError
                }
                if(data){
                    // const {data, error} = await supabase.storage.from('public/bucket').download(fileName)
                    const { publicURL, error } = supabase
                        .storage
                        .from('bucket')
                        .getPublicUrl(fileName)
                    console.log(publicURL)
                    // @ts-ignore
                    // const url = URL.createObjectURL(data)
                    setUserImages([...userImages, publicURL]);
                }
            }
        } catch (error:any) {
            alert(error.message)
        }
    }
    if(imageCounter === 4){
        setEndGame(true)

    }
    const saveConversation = async () => {
        const conversation = imageUrls.map(image => {
            return {app_file: image, created_at: Date.now()}
        })
        const { data, error } = await supabase
            .from('conversations')
            .upsert([{"id": "123", "user_id": profile?.id,
                "app_selfie": "blob:http://localhost:3000/b263b476-b434-42b2-a6c7-d70ff969b89e",
                "user_selfie": "blob:http://localhost:3000/b263b476-b434-42b2-a6c7-d70ff969b89e",
                "created_at": moment().format()}])
    }
    // saveConversation()
    return (
        <>
            {user ? (
                <>
                    <div className="min-h-full">
                        <Disclosure as="nav" className="bg-indigo-600">
                            {({open}) => (
                                <>
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                        <div className="flex items-center justify-between h-16">
                                            <div className="flex items-center">
                                                <div className="hidden md:block">
                                                    <div className="ml-10 flex items-baseline space-x-4">
                                                        {navigation.map((item) => (
                                                            <a
                                                                key={item.name}
                                                                href={item.href}
                                                                className={classNames(
                                                                    item.current
                                                                        ? 'bg-indigo-700 text-white'
                                                                        : 'text-white hover:bg-indigo-500 hover:bg-opacity-75',
                                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                                )}
                                                                aria-current={item.current ? 'page' : undefined}
                                                            >
                                                                {item.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden md:block">
                                                <div className="ml-4 flex items-center md:ml-6">
                                                    <button
                                                        onClick={handleLogout}
                                                        type="button"
                                                        className="bg-indigo-600 p-1 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                                                    >
                                                        Log out
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Disclosure>
                        <header className="bg-white shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                <h1 className="text-3xl font-bold leading-tight text-gray-900">Game</h1>
                            </div>
                        </header>
                        <main>
                            <div className="relative max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                {/* Replace with your content */}
                                <div className="px-4 py-4 flex  sm:px-0">
                                    <button
                                        onClick={handleImage}
                                        type="button"
                                        className="absolute top-0 left-0 bg-indigo-600 p-1 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                                    >
                                       New Image
                                    </button>
                                </div>
                                {/*RANDOM IMAGES FROM ALTER EGO*/}
                                <div className={"flex flex-col absolute top-10 right-4"} >
                                    {imageUrls[0] && (
                                        <div className={"flex flex-col mt-4"}>
                                            <Image src={imageUrls[0]} width={200} height={200} />
                                            <span>Answer me with the same selfie</span>
                                        </div>
                                    )}
                                    {imageUrls[1] && (
                                        <div className={"flex flex-col mt-44"}>
                                            <Image src={imageUrls[1]} width={200} height={200} />
                                            <span>Answer me with the same selfie</span>
                                        </div>
                                    )}
                                </div>
                                {/*IMAGES FROM THE USER*/}
                                <div className={"flex flex-col absolute top-44 left-4"} >
                                    {/*@ts-ignore*/}
                                    <input type="file" id="mypic" accept="image/*" capture="camera" onChange={handleUploadImage} />
                                    <button onClick={uploadImage} className={"border-2 border-red-500"}>Upload</button>
                                    {userImages[0] && (
                                        <div className={"flex flex-col mt-4"}>
                                            <Image src={userImages[0]} width={200} height={200} />
                                        </div>
                                    )}
                                    {userImages[1] && (
                                        <div className={"flex flex-col mt-44"}>
                                            <Image src={userImages[1]} width={200} height={200} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </>
            ) : <span>Redirecting...</span>}

        </>
    )
}

export default Home
