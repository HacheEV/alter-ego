import type {NextPage} from 'next'
import {supabase} from "../utils/supabase-client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Image from 'next/image'
import {MailIcon, PhoneIcon} from "@heroicons/react/solid";
import NotAllowed from "../components/not-allowed";

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
            .select(`id, email, created_at, profiles(username)`)
        if (data) setConversations(data)
    }
    useEffect(() => {
        getConversations()
    }, [])

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
                        onClick={() => router.push('/')}
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go back
                    </button>
                    <main className={"flex items-center justify-center"}>
                        <div className="w-1/3 h-[40rem] mx-auto my-20  rounded-md py-6 border-2 sm:px-6 lg:px-8">
                            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {conversations.map((conversation: any, index: number) => (
                                    <li key={index}
                                        className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                                        <div className="w-full flex items-center justify-between p-6 space-x-6">
                                            <div className="flex-1 truncate">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-gray-900 text-sm font-medium truncate">{conversation.profiles.username}</h3>
                                                </div>
                                                <p className="mt-1 text-gray-500 text-sm truncate">{conversation.email}</p>
                                            </div>
                                            <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                                                 src={conversation.user_selfie} alt=""/>
                                        </div>
                                        <div className="-mt-px flex divide-x divide-gray-200">
                                            <div className="w-0 flex-1 flex">
                                                <a
                                                    href={`/conversation/${conversation.id}`}
                                                    className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                                                >
                                                    <span className="ml-3">View</span>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </main>
                </>
            ) : <NotAllowed />}

        </>
    )
}

export default Conversations;

