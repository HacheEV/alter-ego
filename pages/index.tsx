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
import Upload from "../public/upload.png";

interface Profile {
    id: string;
    username: string;
    role: number;
}

interface Conversation {
    id: string;
    user_id: string;
    email: string;
}

interface Chat {
    src: string | any;
    side: string;
    created_at: string;
}

interface ConversationDetail {
    conversation_id: string;
    order: number;
    selfie_url: string;
    created_at: string;
}

const Home: NextPage = () => {
    const router = useRouter()
    const user = supabase.auth.user();
    const [profile, setProfile] = useState<Profile>()
    const [imageUrl, setImageUrl] = useState<string>("")
    const [endGame, setEndGame] = useState<boolean>(false)
    const [conversation, setConversation] = useState<Conversation[] | any>([])
    const [conversationId, setConversationId] = useState<string>("")
    const [imageReady, setImageReady] = useState<boolean>(false)
    const [chat, setChat] = useState<Chat[]>([])
    const [seeImageChat, setSeeImageChat] = useState<boolean>(false)
    const [selectedImage, setSelectedImage] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [userHasAnswered, setUserHasAnswered] = useState<boolean>(false)

    const text = "Sorry, I just don’t have the energy to have \n" +
        "a fake live on social media right now ... "

    useEffect(() => {
        setConversationId(makeId(12))
    }, [user?.id])

    const amountImages: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const randomImage: number = amountImages[Math.floor(Math.random() * amountImages.length)]

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user, router])

    useEffect(() => {
        getProfile()
    }, [user])

    useEffect(() => {
        getImageRandom()
    }, [user])

    const getImageRandom = () => {
        const {publicURL, error} = supabase
            .storage
            .from('bucket')
            .getPublicUrl(`app_selfies/${randomImage}.jpeg`)
        if (publicURL !== null) {
            setImageUrl(publicURL);
            setImageReady(true)
            const alterAnswer = {src: publicURL, side: "left", created_at: moment().format()}
            setChat([...chat, alterAnswer])
        }
    }
    useEffect(() => {
        if (userHasAnswered && chat.length < 8) {
            getImageRandom()
            setUserHasAnswered(false)
        }
        if (chat.length === 8 && !endGame) {
            verifyIfConversationExist()
            const newChat = chat.map((chat, index) => {
                return {
                    conversation_id: conversationId,
                    created_at: chat.created_at,
                    order: index + 1,
                    selfie_url: chat.src,
                    side: chat.side
                }
            })
            saveChat(newChat)
            setEndGame(true)
        }
    }, [chat, userHasAnswered])

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

    const handleUploadImage = async (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            throw new Error('You must select an image to upload.')
        } else {
            setLoading(true)
            try {
                const fileName = `${profile?.username}_${moment().format()}`

                let {data, error: uploadError} = await supabase.storage
                    .from('bucket')
                    .upload(fileName, e.target.files[0])
                if (uploadError) {
                    throw uploadError
                }
                if (data) {
                    const {publicURL, error} = supabase
                        .storage
                        .from('bucket')
                        .getPublicUrl(fileName)
                    if (publicURL) {
                        const alterAnswer = {src: publicURL, side: "right", created_at: moment().format()}
                        setChat([...chat, alterAnswer])
                        setSeeImageChat(false)
                        setUserHasAnswered(true)
                        setLoading(false)
                    }
                }
            } catch (error: any) {
                alert(error.message)
            }
        }

    }

    const saveConversation = async (conversationData: any) => {
        const {error} = await supabase
            .from('conversations')
            .insert([conversationData])
        if (error) console.log(error);
    }
    const saveChat = async (chat: ConversationDetail[]) => {
        const {error} = await supabase
            .from('conversation_detail')
            .insert(chat)
        if (error) console.log(error);
    }

    const handleExpandImage = (src: any) => {
        setSelectedImage(src);
        setSeeImageChat(true)
    }
    const handleCloseImage = () => {
        setSelectedImage("")
        setSeeImageChat(false)
    }

    const handleFinishChat = () => {
       verifyIfConversationExist()
        const newChat = chat.map((chat, index) => {
            return {
                conversation_id: conversationId,
                created_at: chat.created_at,
                order: index + 1,
                selfie_url: chat.src,
                side: chat.side
            }
        })
        saveChat(newChat)
        setEndGame(true)
    }
    const verifyIfConversationExist = () => {
        if (conversation?.length === 0) {
            const conversationObject = {
                id: conversationId,
                user_id: user?.id,
                email: user?.email,
                created_at: moment().format()
            }
            saveConversation(conversationObject);
            setConversation([conversationObject])
        }
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
                            <AvatarSpinner isLoader={false}/>
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
                                            className={"w-12 h-12 rounded-full border-whiteBorder border-2 my-2 flex items-center justify-center p-1"}>
                                            <div className={"relative w-10 h-10 rounded-full overflow-hidden"}>
                                                <Image src={item.src} layout={"fill"}
                                                       className={classNames("w-9 h-9 rounded-full object-cover")}
                                                       priority placeholder={"blur"} blurDataURL={"/alter-avatar.png"}/>
                                            </div>
                                        </div>
                                        <button
                                            className={classNames("w-32 border-2 border-whiteBorder rounded-full h-12 flex items-center justify-center p-2 text-white",
                                                item.side === "left" ? "ml-4" : "mr-4"
                                            )}
                                            onClick={() => handleExpandImage(item.src)}
                                        >
                                            <span className={" text-sm mr-3 mt-1 "}>See picture</span>
                                            <Image src={RightArrow} width={13} height={13}/>
                                        </button>
                                    </div>
                                )
                            })
                        )}
                    </div>
                    {(chat.length > 1 && !endGame) && (
                        <button
                            className={classNames("w-32 border-2 border-whiteBorder rounded-full h-12 flex items-center justify-center text-white")}
                            onClick={() => handleFinishChat()}
                        >
                            <span className={" text-md font-semibold mt-1 "}>Finish chat</span>
                        </button>
                    )
                    }
                    {endGame &&
                        <div
                            className={"w-full bg-dark h-24 font-Inter text-white text-2xl flex items-center justify-center"}>
                            <span>Thanks for talk!</span>
                        </div>
                    }
                </div>
            }
            {seeImageChat && (
                <div className={"w-full relative h-screen flex flex-col items-center justify-end"}>
                    <div className={"w-full h-full absolute top-0 left-0 z-20"}>
                        <Image src={selectedImage} layout={"fill"} className={"object-fill"}/>
                    </div>
                    <div className={"absolute top-6 right-6 z-30"}>
                        <button
                            onClick={handleCloseImage}
                            type="button"
                        >
                            <Image src={CloseIcon} width={20} height={20} alt={"Conversation icon"}/>
                        </button>
                    </div>
                    {loading ? (
                        <div className={"flex flex-col items-center z-30 h-32 mb-16"}>
                            <AvatarSpinner isLoader={true}/>
                        </div>
                    ) : (!endGame &&
                        <>
                            <div className={"flex items-center w-full justify-start z-30 h-32 mb-16"}>
                                <div className={"w-14 h-16 relative ml-4 mt-5"}>
                                    <Image src={Upload} width={25} height={25}
                                           className={"absolute top-4 left-2 z-30"}/>
                                    {/*@ts-ignore*/}
                                    <input type="file" accept="image/*"
                                           onChange={handleUploadImage}
                                           className={"w-full h-full absolute top-0 left-0 z-50 opacity-0"}/>
                                </div>

                                <div className={"flex flex-col items-center ml-20"}>
                                    <div
                                        className={"z-30 w-20 h-20 border-2 border-whiteBorder rounded-full flex items-center justify-center"}>
                                        <div
                                            className={"w-14 h-14 rounded-full border-2 border-whiteBorder flex items-center justify-center my-1"}>
                                            <div
                                                className={"w-10 h-10 rounded-full bg-white flex items-center justify-center mb-[0.5px]"}>
                                                {/*@ts-ignore*/}
                                                <input type="file" id="mypic" accept="image/*" capture="camera"
                                                       onChange={handleUploadImage} className={"w-full opacity-0"}/>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={"z-30 text-black mt-2 text-whiteBorder"}>Send image</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>

    )
}

export default Home
