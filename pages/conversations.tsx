import type {NextPage} from 'next'
import {supabase} from "../utils/supabase-client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Image from 'next/image'
import RightArrow from '../public/rightblue.png'
import NotAllowed from "../components/not-allowed";
import CloseIcon from "../public/close.png";
import {classNames} from "../utils/classnames";
import Link from "next/link";
import moment from "moment";
import Navbar from "../components/navbar";

interface Profile {
    id: string;
    username: string;
    role: number;
}

const Conversations: NextPage = () => {
    const router = useRouter()
    const user = supabase.auth.user();
    const [profile, setProfile] = useState<Profile>()
    const [conversations, setConversations] = useState<any>([])
    const [totalInteractions, setTotalInteractions] = useState<number>(0)

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user])

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
        if (profile?.role === 2) {
            router.push('/')
        }

    }, [setProfile])

    const handleLogout = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) console.log(error)
        router.push('/login')
    }
    const getConversations = async () => {
        const {data, error} = await supabase.from('conversations')
            .select(`id, email, created_at, profiles(username, color), conversation_detail(selfie_url)`)
        if(error) console.log(error)
        if (data) {
            setConversations(data)
        }
    }
    const getConversationDetails = async () => {
        const {data, error} = await supabase.from('conversation_detail')
            .select()
        if(error) console.log(error)
        if(data) setTotalInteractions(data.length)
    }
    useEffect(() => {
        getConversations()
        getConversationDetails()
    }, [])

    return (
        <>
            {(user && conversations.length > 0) ? (
                <div className={"flex flex-col items-center justify-start"}>
                    <Navbar isAdmin={profile?.role === 1} isConversations={true}/>
                    <div className={"flex flex-col items-center w-full h-32 leading-3 mt-20"}>
                        <span className={"text-white font-Inter text-3xl font-medium"}>{totalInteractions}</span>
                        <span className={"text-white font-Inter text-md font-light"}>Interactions</span>
                        <div className={"w-[80%] border-b border-whiteBorder my-4"}></div>
                        <span className={"text-white font-Inter text-xl font-medium"}>{conversations.length}</span>
                        <span className={"text-white font-Inter text-xs font-light"}>Conversations</span>
                    </div>
                        <div className={"flex items-start justify-start h-full"}>
                            <div className="w-full px-2  rounded-md py-6 sm:px-6 lg:px-8">
                                <ul role="list" className="font-Inter grid grid-cols-2 gap-6 sm:grid-cols-2">
                                    {conversations.map((conversation: any, index: number) => {
                                        const border = `border-[${conversation.profiles.color}]`
                                        return (
                                            <li key={index}
                                                className="col-span-1 bg-dark w-44">
                                                <div className="w-full flex flex-col items-center py-6 px-3">
                                                    <div
                                                        className={classNames("w-16 h-16 rounded-full border-[3px] my-2 flex items-center justify-center", border ? border : "border-whiteBorder"
                                                        )}>
                                                        <div
                                                            className={"relative w-[3.3rem] h-[3.3rem] rounded-full overflow-hidden"}>
                                                            <Image src={conversation.conversation_detail[1] ? conversation.conversation_detail[1].selfie_url : "/alter-avatar.png"}
                                                                   layout={"fill"}
                                                                   className={classNames("w-9 h-9 rounded-full object-cover")}
                                                                   priority placeholder={"blur"}
                                                                   blurDataURL={"/alter-avatar.png"}/>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={"text-white text-sm"}>@{conversation.profiles.username}</span>
                                                    <span
                                                        className={"text-white text-xs text-gray-400 mt-2"}>{moment(conversation.created_at).format('LL')}</span>
                                                    <span
                                                        className={"text-white text-xs text-gray-400"}>{conversation.conversation_detail.length} interactions</span>
                                                    <Link href={`/conversation/${conversation.id}`}>
                                                        <a className={"w-full flex items-center justify-center text-white mt-2 h-12"}>
                                                            <span className={"underline text-select2 text-sm mr-1"}>View interactions</span>
                                                            <Image src={RightArrow} width={0} height={10}/>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>

                            </div>
                        </div>
                </div>
            ) : <NotAllowed />}

        </>
    )
}

export default Conversations;

