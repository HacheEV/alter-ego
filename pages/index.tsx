import type {NextPage} from 'next'
import {supabase} from "../utils/supabase-client";
import {useRouter} from "next/router";
import {useEffect, useMemo, useState} from "react";
import { Disclosure} from '@headlessui/react'
import {classNames} from "../utils/classnames";
import Image from "next/image";
import moment from "moment";
import { makeId } from '../utils/utils'
import NotAllowed from "../components/not-allowed";

interface Profile {
    id: string;
    username: string;
    role: number;
}
interface Conversation{
    id: string | undefined;
    user_id: string;
    app_selfie: string;
    user_selfie?: string;
    created_at: Date;
    position: number;
}

const Home: NextPage = () => {
    const router = useRouter()
    const user = supabase.auth.user();
    const [profile, setProfile] = useState<Profile>()
    const [imageUrl, setImageUrl] = useState<string>("")
    const [userImage, setUserImage] = useState<string>("")
    const [imageUploaded, setImageUploaded] = useState<File>()
    const [endGame, setEndGame] = useState<boolean>(false)
    const [conversation, setConversation] = useState<Conversation[] | any>([])
    const [conversationId, setConversationId] = useState<string>("")

    useEffect(() => {
        setConversationId(makeId(12))
    }, [user?.id])

    const amountImages: number[] = [1, 2, 3]
    const randomImage: number = amountImages[Math.floor(Math.random() * amountImages.length)]

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user])

    useEffect(() => {
        getProfile()
    }, [user])

    useEffect(() => {
        getImageRandom()
    },[user])

    useEffect(() => {
        if(conversation.length === 2){
            saveConversation()
            setEndGame(true)
        }
    }, [conversation])

    const getImageRandom = async () => {
        const { publicURL, error } = supabase
            .storage
            .from('bucket')
            .getPublicUrl(`app_selfies/${randomImage}.jpg`  )
        if(publicURL !== null){
            setImageUrl(publicURL);
        }
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


    const handleLogout = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) console.log(error)
        router.push('/login')
    }
    const navigation = [
        { name: 'Conversations', href: '/conversations', current: true }
    ]
    const handleUploadImage = async (e:any) => {
        if (!e.target.files || e.target.files.length === 0) {
            throw new Error('You must select an image to upload.')
        }
        setImageUploaded(e.target.files[0])
        const conversationObject = {
            id: conversationId,
            user_id: user?.id,
            email: user?.email
        }
        // TODO: DO DE PAGE BY CONVERSATION ID LIKE IG CHAT
        if(conversation.length === 0){
            const { data, error } = await supabase
                .from('conversations')
                .insert([conversationObject])
            if(data)console.log(data)
            if(error){
                console.log(error)
            }
        }
    }

    const uploadImage = async (e: any) => {
        try {
            if(imageUploaded){
                const fileName = `${profile?.username}_${moment().format()}`

                let { data, error: uploadError } = await supabase.storage
                    .from('bucket')
                    .upload(fileName, imageUploaded)
                if (uploadError) {
                    throw uploadError
                }
                if(data){
                    const { publicURL, error } = supabase
                        .storage
                        .from('bucket')
                        .getPublicUrl(fileName)
                    if(publicURL) {
                        setUserImage(publicURL)
                        const firstConversation = {
                            id: conversationId,
                            app_selfie: imageUrl,
                            user_selfie: publicURL,
                            created_at: moment().format()
                        }
                        setConversation((array:any) => {
                            return [...conversation, firstConversation]
                        })
                    }
                }
            }
        } catch (error:any) {
            alert(error.message)
        }
    }

    const saveConversation = async () => {
        const { data, error } = await supabase
            .from('conversation_detail')
            .upsert(conversation)
        if(data) console.log(data);
        if(error) console.log(error);
    }
    const handleNewImage = () => {
        getImageRandom()
    }

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
                        <main className={"flex items-center justify-center"}>
                            <div className="relative w-1/3 h-[40rem] mx-auto my-20  rounded-md py-6 border-2 sm:px-6 lg:px-8">
                                {endGame && <span>END GAME</span>}
                                <button className={"w-10 h-10 rounded-full bg-blue-700 z-50 absolute top-2 left-2"} onClick={handleNewImage}></button>
                                    {imageUrl && (
                                        <div className={"flex flex-col mt-4"}>
                                            <Image src={imageUrl} layout={"fill"} className={"rounded-md"}/>
                                            <span>Answer me with the same selfie</span>
                                        </div>
                                    )}
                                {/*IMAGES FROM THE USER*/}
                                <div className={"flex flex-col absolute top-44 left-4"} >
                                    {/*@ts-ignore*/}
                                    <input type="file" id="mypic" accept="image/*" capture="camera" onChange={handleUploadImage} />
                                    <button onClick={uploadImage} className={"border-2 border-red-500"}>Upload</button>
                                    {userImage && (
                                        <div className={"flex flex-col mt-4"}>
                                            <Image src={userImage} width={200} height={200} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </>
            ) : <NotAllowed />}

        </>
    )
}

export default Home
