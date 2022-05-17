import { useState } from 'react'
import { supabase } from '../utils/supabase-client'
import {useRefreshRoot} from "next/dist/client/streaming/refresh";
import {useRouter} from "next/router";

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
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e)=> setPassword(e.target.value)                                        }
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none block w-full mb-8 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={handleLogin}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign in
                                </button>
                            </div>
                    </div>
                </div>
            </div>
        </>
    )

    // return (
    //     <div className="row flex flex-center">
    //         <div className="col-6 form-widget">
    //             <h1 className="header">Supabase + Next.js</h1>
    //                 <div>
    //                     <input
    //                         className="inputField"
    //                         type="email"
    //                         placeholder="Your email"
    //                         value={email}
    //                         onChange={(e) => setEmail(e.target.value)}
    //                     />
    //                 </div>
    //                 <div>
    //                     <input
    //                         className="inputField"
    //                         type="password"
    //                         placeholder="Your password"
    //                         value={password}
    //                         onChange={(e) => setPassword(e.target.value)}
    //                     />
    //                 </div>
    //                 <div>
    //                     <button
    //                         onClick={(e) => {
    //                             e.preventDefault()
    //                             handleLogin(email, password)
    //                         }}
    //                         className=""
    //                         disabled={loading}
    //                     >
    //                         <span>{loading ? 'Loading' : 'Send magic link'}</span>
    //                     </button>
    //                 </div>
    //         </div>
    //     </div>
    // )
}