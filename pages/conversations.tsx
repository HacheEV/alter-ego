import type {NextPage} from 'next'
import {supabase} from "../utils/supabase-client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

interface Profile{
    id:string;
    username:string;
    role: number;
}
const Conversations: NextPage = () => {
    const router = useRouter()
    const user = supabase.auth.user();
    const [profile, setProfile] = useState<Profile>()

    const getProfile = async () => {
        try {
            const {data, error} = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
            if(data) setProfile(data[0])
        } catch(err) {
            console.log(err)
        }
    }
    useEffect( () => {
        getProfile()
        if(profile?.role === 2){
            router.push('/')
        }

    }, [setProfile])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if(error) console.log(error)
        router.push('/login')
    }
    console.log(profile)
    return (
        <>
            {user ? (
                <>
                    <div className="text-5xl font-bold">Conversations</div>
                    <div className="text-5xl font-bold">Bienvido {profile?.username}</div>
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
                </>
            ) : <span>Redirecting...</span>}

        </>
    )
}

export default Conversations
