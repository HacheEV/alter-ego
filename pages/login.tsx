import { useState } from 'react'
import { supabase } from '../utils/supabase-client'
import {useRefreshRoot} from "next/dist/client/streaming/refresh";
import {useRouter} from "next/router";
import AvatarSpinner from "../components/avatar-spinner";

export default function Auth() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleLogin = async () => {
        try {
            setLoading(true)
            const { user, error } = await supabase.auth.signIn({ email, password })
            if (error) throw error
            if(user) router.push('/')
        } catch (error:any) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="min-h-full flex flex-col justify-center items-center bg-dark h-screen text-white px-2 py-3">
                <div className="w-full flex flex-col items-center justify-center h-full border-[1px] border-whiteBorder rounded-[25px] m-2">
                    <h1 className={"my-4 text-xl"}>Login</h1>
                    <div className="py-8 px-4 sm:rounded-lg sm:px-10">
                            <div>
                                <label htmlFor="email" className="hidden">
                                    Email address
                                </label>
                                <div className="mb-6">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder={"What's your email?"}
                                        className="appearance-none block w-full px-3 py-2 border-2 border-whiteBorder rounded-full bg-dark placeholder-gray-400 focus:outline-none focus:ring-[#A5678E] focus:border-[#A5678E] sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="hidden">
                                    Password
                                </label>
                                <div className="mb-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e)=> setPassword(e.target.value)                                        }
                                        autoComplete="current-password"
                                        required
                                        placeholder={"What's your password?"}
                                        className="appearance-none block w-full px-3 py-2 border-2 border-whiteBorder rounded-full bg-dark placeholder-gray-400 focus:outline-none focus:ring-[#A5678E] focus:border-[#A5678E] sm:text-sm"
                                    />
                                </div>
                            </div>
                        <button className={"mb-8"} onClick={() => router.push('/sign-up')}>
                            <span className={"text-sm ml-1 text-gray-400"}>Are you not registered yet?</span>
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={handleLogin}
                            className={"text-md underline transform -translate-y-6"}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}