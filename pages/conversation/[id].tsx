import {NextPage} from "next";
import {useRouter} from "next/router";
import {supabase} from "../../utils/supabase-client";
import {useEffect, useState} from "react";
import Image from "next/image";
import NotAllowed from "../../components/not-allowed";

const ConversationId: NextPage = () => {
    const router = useRouter()
    const user = supabase.auth.user();
    const [profile, setProfile] = useState<any>()
    const [conversationDetail, setConversationDetail] = useState<any>([])

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user])

    const {id} = router.query

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
    const getConversation = async () => {
        const {data, error} = await supabase.from('conversation_detail')
            .select("*")
        if (data) setConversationDetail(data)
    }
    useEffect(() => {
        getConversation()
    }, [])

    console.log(conversationDetail)
    return (
        <>
            {user ? (
                <>
                    <div className="text-5xl font-bold">Conversations</div>
                    <div className="text-5xl font-bold">Bienvenido {profile?.username}</div>
                    <button
                        onClick={handleLogout}
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log out
                    </button>
                    <button
                        onClick={() => router.push('/conversations')}
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go back
                    </button>
                    <main className={"flex items-center justify-center"}>
                        <div className="w-1/3 h-[40rem] mx-auto my-20  rounded-md py-6 border-2 sm:px-6 lg:px-8">
                            {conversationDetail.map((conversation: any, index: number) => (
                                <div key={index} className={"flex flex-col w-full h-auto"}>
                                    <div className={"w-24 h-24 ml-52"}>
                                        <Image src={conversation.app_selfie} width={150} height={150}/>
                                    </div>
                                    <div className={"w-24 h-24"}>
                                        <Image src={conversation.user_selfie} width={150} height={150}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </>
            ) : <NotAllowed />}
        </>
    )
}

export default ConversationId;

