import {GetStaticPropsContext, NextPage} from "next";
import {useRouter} from "next/router";
import {supabase} from "../../utils/supabase-client";
import {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import Navbar from "../../components/navbar";
import AlterAvatar from "../../public/alter-avatar.png";
import GridIcon from "../../public/grid-icon.png"
import ChatIcon from "../../public/chat-icon.png"
import {classNames} from "../../utils/classnames";
import moment from "moment";

interface UserChat{
    username: string;
    color: string;
}
interface ConversationDetail{
    selfie_url: string;
    created_at: string;
    id: string;
    order: number;
    conversation_id: string;
    side: string;
}
interface ConversationUser{
    user_id: string;
    created_at: string;
    profiles: UserChat;
}

interface Props{
    conversationDetail: ConversationDetail[];
    conversationAndUser: ConversationUser;
    // userCardBorder:string;
    // userColorBorder: string;
    userColor:string;
}


const ConversationId: NextPage<Props> = ({conversationDetail, conversationAndUser, userColor}) => {
    const router = useRouter()
    const user = supabase.auth.user();
    const [profile, setProfile] = useState<any>()
    const [grid, setGrid] = useState<boolean>(false)

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

    console.log(userColor)
    return (
        <>
            <style jsx global>{`
              :root {
                --user-color: ${userColor};
              }
            `}</style>
            {(user) && (
                <div className={"flex flex-col items-center font-Inter text-white"}>
                    <Navbar isAdmin={profile?.role === 1} isConversations={false}/>
                    <div className={"flex items-center justify-center w-full h-28 mt-8"}>
                            <div className={"relative w-52"}>
                                <div className={"flex flex-col items-center absolute top-0 left-0 w-36 z-0"}>
                                    <div className={"w-28 h-28 border-4 border-whiteBorder rounded-full p-1"}>
                                        <Image src={AlterAvatar} layout={"responsive"}/>
                                    </div>
                                    <span className={"mr-14 mt-2 text-sm font-semibold"}>@sofiatarragona</span>
                                </div>
                                <div className={"flex flex-col items-center absolute top-0 right-0 w-36 z-20"}>
                                    <div className={classNames("w-28 h-28 rounded-full p-1 overflow-hidden border-[3px] border-user")}>
                                        <Image src={conversationDetail[1] ? conversationDetail[1].selfie_url : "/alter-avatar.png"}
                                               width={300}
                                               height={300}
                                               className={"w-9 h-9 rounded-full object-cover"}
                                        />
                                    </div>
                                    <span className={"ml-8 mt-2 text-sm font-semibold"}>@{conversationAndUser.profiles.username}</span>
                                </div>
                            </div>
                    </div>
                    <div className={"w-[80%] border-b border-whiteBorder my-4 mt-36"}></div>
                    <div className={"w-full flex flex-col items-center py-8"}>
                        <span className={"text-2xl font-semibold"}>{conversationDetail.length}</span>
                        <span className={"text-lg"}>Interactions</span>
                        <span className={"text-sm mt-4"}>First interaction</span>
                        <span className={"text-sm font-bold mt-1"}>{moment(conversationDetail[0].created_at).format("MMMM Do YYYY")}</span>
                    </div>
                    {grid ? (
                        <button className={"w-full h-14 flex items-center justify-end pr-6"} onClick={() => setGrid(false)}>
                            <span className={"mr-1 text-sm underline"}>view chat</span>
                            <Image src={ChatIcon} width={23} height={23} />
                        </button>
                    ) : (
                        <button className={"w-full h-14 flex items-center justify-end pr-6"} onClick={() => setGrid(true)}>
                            <span className={"mr-1 text-sm underline"}>view grid</span>
                            <Image src={GridIcon} width={23} height={23} />
                        </button>
                    )}
                    {grid ? (
                        <div className={"flex items-start justify-between  w-full h-full px-3 mt-1 pb-20"}>
                            <div className={"flex items-start justify-center h-full mt-5"}>
                                <div className={"w-14 h-14 border-2 border-whiteBorder rounded-full p-1"}>
                                    <Image src={AlterAvatar} width={250} height={250}/>
                                </div>
                            </div>
                            <div className={"grid grid-cols-2 w-full"}>
                                {conversationDetail.map((conversation, index) => {
                                    return (
                                        <div key={index} className={classNames("flex col-span-1 w-full my-5", conversation.side === "left" ? "justify-start" : "flex-row-reverse")}>
                                            <div className={classNames("flex items-end", conversation.side === "left" ? "justify-start ml-2" : "justify-end mr-2"
                                            )}>
                                                <div className={classNames("w-20 h-40  rounded-xl ", conversation.side === "left" ? "" : "")}>
                                                    <Image src={conversation.selfie_url} width={220} height={450} layout={"responsive"} className={"rounded-xl"}/>
                                                </div>
                                                <span className={classNames("text-xs font-bold ml-1")}>{moment(conversation.created_at).format('HH:mm')}</span>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                            <div className={"flex items-start justify-center h-full mt-5"}>
                                <div className={classNames("w-14 h-14 rounded-full p-1 overflow-hidden")}>
                                    <Image src={conversationDetail[1] ? conversationDetail[1].selfie_url : "/alter-avatar.png"}
                                           width={300}
                                           height={300}
                                           className={"w-9 h-9 rounded-full object-cover"}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={"flex flex-col items-start justify-start  w-full h-full px-3 mt-1 pb-20"}>
                            {conversationDetail.map((conversation, index) => {
                                return (
                                    <div key={index} className={classNames("flex w-full mt-14", conversation.side === "left" ? "justify-start" : "flex-row-reverse")}>

                                        {conversation.side === "left" ? (
                                            <div className={"w-16 h-16 border-2 border-whiteBorder rounded-full p-0.5"}>
                                                <Image src={AlterAvatar} width={250} height={250}/>
                                            </div>
                                        ) : (
                                            <div className={classNames("w-16 h-16 rounded-full p-0.5 overflow-hidden border-[3px] border-user")}>
                                                <Image src={conversationDetail[1] ? conversationDetail[1].selfie_url : "/alter-avatar.png"}
                                                       width={300}
                                                       height={300}
                                                       className={"w-9 h-9 rounded-full object-cover"}
                                                />
                                            </div>
                                        )}
                                        <div className={classNames("flex items-end w-44 ", conversation.side === "left" ? "justify-end" : "flex-row-reverse")}>
                                            <div className={classNames("w-24 h-44  rounded-xl ", conversation.side === "left" ? "ml-4" : "mr-6")}>
                                                <Image src={conversation.selfie_url} width={220} height={425} layout={"responsive"} className={"rounded-xl"}/>
                                            </div>
                                            <span className={classNames("text-xs font-bold", conversation.side === "left" ? "ml-2" : "mr-2")}>{moment(conversation.created_at).format('HH:mm')}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
export async function getServerSideProps({params}: GetStaticPropsContext) {
    const id = params?.id as string;
    let conversationDetail;
    let conversationAndUser;
    let userColor;

    if(id){
        const {data, error} = await supabase.from('conversation_detail')
            .select("*")
            .eq('conversation_id', id)
            .order('order', {ascending: true})

        if(error) console.log(error)
        if (data) {
            conversationDetail = data;
        }
    }

    const {data, error} = await supabase.from('conversations')
        .select(`user_id, created_at, profiles(username, color)`)
        .eq('id', id)

    if(error) console.log(error)
    if (data) {
        conversationAndUser = data[0];
        userColor = data[0].profiles.color
    }

    return { props: { conversationDetail, conversationAndUser, userColor } }
}

export default ConversationId;

