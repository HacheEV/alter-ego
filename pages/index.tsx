import type {NextPage} from 'next'
import {supabase} from "../utils/supabase-client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import AlterAvatar from '../public/alter-avatar.png'
import RightArrow from '../public/right-arrow.png'
import {classNames} from "../utils/classnames";
import Image from "next/image";
import moment from "moment";
import {makeId} from '../utils/utils'
import Navbar from "../components/navbar";
import AvatarSpinner from "../components/avatar-spinner";
import CloseIcon from "../public/close.png";

interface Profile {
    id: string;
    username: string;
    role: number;
}

interface Conversation {
    id: string | undefined;
    user_id: string;
    app_selfie: string;
    user_selfie?: string;
    created_at: Date;
    position: number;
}

interface Chat {
    src: string | any;
    side: string;
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
    const [imageReady, setImageReady] = useState<boolean>(false)
    const [chat, setChat] = useState<Chat[]>([])
    const [seeImageChat, setSeeImageChat] = useState<boolean>(false)
    const [selectedImage, setSelectedImage] = useState<string>("")

    const chatito = [
        {src: imageUrl, side: "left"},
        {src: imageUrl, side: "right"},
        {src: imageUrl, side: "left"},
        {src: imageUrl, side: "right"},
        {src: imageUrl, side: "left"},
        {src: imageUrl, side: "right"},
        {src: imageUrl, side: "left"},
        {src: imageUrl, side: "right"},
        {src: imageUrl, side: "left"},
        {src: imageUrl, side: "right"},
    ]

    const text = "Sorry, I just don’t have the energy to have \n" +
        "a fake live on social media right now ... "

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
    }, [user])

    const getImageRandom = async () => {
        const {publicURL, error} = supabase
            .storage
            .from('bucket')
            .getPublicUrl(`app_selfies/${randomImage}.jpg`)
        if (publicURL !== null) {
            setImageUrl(publicURL);
            setImageReady(true)
            const alterAnswer = {src: publicURL, side: "left"}
            setChat([...chat, alterAnswer])
        }
    }
    useEffect(() => {
        if (conversation.length === 2) {
            saveConversation()
            setEndGame(true)
        }
    }, [conversation])


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

    const navigation = [
        {name: 'Conversations', href: '/conversations', current: true}
    ]
    const handleUploadImage = async (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            throw new Error('You must select an image to upload.')
        }
        setImageUploaded(e.target.files[0])
        const conversationObject = {
            id: conversationId,
            user_id: user?.id,
            email: user?.email
        }
        if (conversation.length === 0) {
            const {data, error} = await supabase
                .from('conversations')
                .insert([conversationObject])
            if (data) console.log(data)
            if (error) {
                console.log(error)
            }
        }
    }

    const uploadImage = async (e: any) => {
        try {
            if (imageUploaded) {
                const fileName = `${profile?.username}_${moment().format()}`

                let {data, error: uploadError} = await supabase.storage
                    .from('bucket')
                    .upload(fileName, imageUploaded)
                if (uploadError) {
                    throw uploadError
                }
                if (data) {
                    const {publicURL, error} = supabase
                        .storage
                        .from('bucket')
                        .getPublicUrl(fileName)
                    if (publicURL) {
                        setUserImage(publicURL)
                        const firstConversation = {
                            id: conversationId,
                            app_selfie: imageUrl,
                            user_selfie: publicURL,
                            created_at: moment().format()
                        }
                        setConversation((array: any) => {
                            return [...conversation, firstConversation]
                        })
                    }
                }
            }
        } catch (error: any) {
            alert(error.message)
        }
    }

    const saveConversation = async () => {
        const {data, error} = await supabase
            .from('conversation_detail')
            .upsert(conversation)
        if (data) console.log(data);
        if (error) console.log(error);
    }
    const handleNewImage = () => {
        getImageRandom()
    }
    const handleExpandImage = (src:any) => {
        setSelectedImage(src);
        setSeeImageChat(true)
    }
    const handleCloseImage = () => {
        setSelectedImage("")
        setSeeImageChat(false)
    }

    return (
        <>
            {!seeImageChat &&
                <div className={"w-full h-full bg-dark flex flex-col items-center font-Inter"}>
                    <Navbar isAdmin={profile?.role === 1}/>
                    <div className={"w-full flex flex-col items-center mt-24"}>
                        {imageReady ? (
                            <div className={"w-44 h-44 border-4 border-whiteBorder rounded-full p-2"}>
                                <Image src={AlterAvatar} layout={"responsive"}/>
                            </div>
                        ) : (
                            <AvatarSpinner/>
                        )}
                        <span className={"text-white text-xl mt-8"}>@sofiatarragona</span>
                        <p className={"text-white w-[34ch] mt-4"}>{text}</p>
                    </div>
                    <div className={classNames("w-full px-6 mt-10 flex flex-col")}>
                        {chat.length > 0 && (
                            chat.map((item, index) => {
                                return (
                                    <div key={index} className={classNames("w-full flex items-center my-3 ",
                                        item.side === "left" ? "justify-start" : "flex-row-reverse")}>
                                        <div
                                            className={"w-12 h-12 rounded-full border-whiteBorder border-2 my-2 flex items-center justify-center"}>
                                            {imageUrl &&
                                                <Image src={imageUrl} width={40} height={40} layout={"fixed"}
                                                       className={classNames("rounded-full")}/>
                                            }
                                        </div>
                                        <button
                                            className={classNames("w-32 border-2 border-whiteBorder rounded-full h-12 flex items-center justify-center p-2 text-white",
                                                item.side === "left" ? "ml-4" : "mr-4"
                                            )}
                                            onClick={() => handleExpandImage(imageUrl)}
                                        >
                                            <span className={" text-sm mr-3 mt-1 "}>See picture</span>
                                            <Image src={RightArrow} width={13} height={13}/>
                                        </button>
                                    </div>
                                )
                            })
                        )}
                    </div>
                    {endGame &&
                        <div
                            className={"w-full bg-dark h-24 font-Inter text-white text-2xl flex items-center justify-center"}>
                            <span>Thanks for talk!</span>
                        </div>
                    }
                </div>
            }
            {seeImageChat && (
                <div className={"w-full relative h-screen"}>
                    <div className={"w-full h-full absolute top-0 left-0 z-20"}>
                        <Image src={selectedImage} layout={"responsive"} width={250} height={600} />
                    </div>
                    <div className={"absolute top-6 right-6 z-30"}>
                        <button
                            onClick={handleCloseImage}
                            type="button"
                            className="text-white"
                        >
                            <Image src={CloseIcon} width={20} height={20} alt={"Conversation icon"}/>
                        </button>
                    </div>
                    <div className={"absolute bottom-20 left-12 z-30 h-10 border-black border-2"}>
                        {/*@ts-ignore*/}
                        <input type="file" id="mypic" accept="image/*" capture="camera" onChange={handleUploadImage} />
                    </div>
                </div>
            )}
        </>

    )
}

export default Home
