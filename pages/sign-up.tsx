import { useState } from 'react'
import { supabase } from '../utils/supabase-client'
import {useRefreshRoot} from "next/dist/client/streaming/refresh";
import {useRouter} from "next/router";

export default function SignUp() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [color, setColor] = useState<string>('')

    const handleLogin = async () => {
        try {
            setLoading(true)
            const { user, error } = await supabase.auth.signUp({ email, password })
            if (error) throw error
            if(user){
                const { data, error } = await supabase
                    .from('profiles')
                    .update({ username: username, color: color })
                    .match({ id: user.id })
                if(data){
                    router.push('/')
                }
            }
        } catch (error:any) {
            console.log(error)
            alert(JSON.stringify(error));
        } finally {
            setLoading(false)
        }
    }
    console.log(color)
    return (
        <>
            <div className="min-h-full flex flex-col justify-center items-center bg-dark h-screen text-white px-2 py-3">
                <div className="w-full flex flex-col items-center justify-center h-full border-[1px] border-whiteBorder rounded-[25px] m-2">
                    <h1 className={"my-4 text-lg"}>Sign-up</h1>
                    <div className="py-8 px-4 sm:rounded-lg sm:px-10">
                            <div>
                                <label htmlFor="email" className="hidden">
                                    Email address
                                </label>
                                <div className="mb-5">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        required
                                        placeholder={"Write your email"}
                                        className="appearance-none block w-full px-3 py-2 border-2 border-whiteBorder rounded-full bg-dark placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="username" className="hidden">
                                    Username
                                </label>
                                <div className="mb-5">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={username}
                                        onChange={(e)=> setUsername(e.target.value)}
                                        required
                                        placeholder={"Write your username"}
                                        className="appearance-none block w-full px-3 py-2 border-2 border-whiteBorder rounded-full bg-dark placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="hidden">
                                    Password
                                </label>
                                <div className="mb-5">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e)=> setPassword(e.target.value)                                        }
                                        autoComplete="current-password"
                                        required
                                        placeholder={"Write your password"}
                                        className="appearance-none block w-full px-3 py-2 border-2 border-whiteBorder rounded-full bg-dark placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        <div>
                            <label htmlFor="color" className="hidden">
                                Color
                            </label>
                            <div className="mb-5">
                                <div
                                    className={"appearance-none flex flex-col items-center justify-between w-full px-3 py-2 border-2 border-whiteBorder rounded-[25px] bg-dark text-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"}
                                >
                                    <span className={"text-left w-full"}>Choose a color</span>
                                    <div className={"grid grid-cols-2 gap-5 justify-center my-2"}>
                                        <button onClick={() => setColor('#33539E')}className={"w-12 h-12 bg-select1 rounded-full"}></button>
                                        <button onClick={() => setColor('#7FACD6')} className={"w-12 h-12 bg-select2 rounded-full"}></button>
                                        <button onClick={() => setColor('#BFB8DA')} className={"w-12 h-12 bg-select3 rounded-full"}></button>
                                        <button onClick={() => setColor('#E8B7DA')} className={"w-12 h-12 bg-select4 rounded-full"}></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className={"mb-8"} onClick={() => router.push('/login')}>
                            <span className={"text-sm ml-1 text-gray-400"}>Are you already registered?</span>
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