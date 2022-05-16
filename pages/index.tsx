import type {NextPage} from 'next'
import {supabase} from "../utils/supabase-client";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

interface Profile{
    id:string;
    username:string;
    role: number;
}
const Home: NextPage = () => {
    const router = useRouter()
    const user = supabase.auth.user();
    const [profile, setProfile] = useState<Profile>()

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
            if(data) setProfile(data[0])
        } catch(err) {
            console.log(err)
        }
    }
    useEffect( () => {
        getProfile()
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
                    <div className="text-5xl font-bold">Bienvido {profile?.username}</div>
                    <button
                        onClick={handleLogout}
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log out
                    </button>
                    {profile?.role === 1 && (
                        <button
                            onClick={() => router.push('/conversations')}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Conversations
                        </button>
                    )}
                </>
            ) : <span>Redirecting...</span>}

        </>
    )
}

export default Home
