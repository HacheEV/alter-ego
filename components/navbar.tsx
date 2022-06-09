import Image from 'next/image'
import ConversIcon from '../public/convers-icon.png'
import CloseIcon from '../public/close.png'
import {classNames} from "../utils/classnames";
import {useRouter} from "next/router";
import Logout from "./logout";
import {useState} from "react";

interface Navbar {
    isAdmin: boolean;
    isConversations:boolean;
}

const Navbar = ({isAdmin, isConversations}: Navbar) => {
    const [logout, setLogout] = useState<boolean>(false)
    const router = useRouter()

    return (
        <div className={"w-full"}>
            <div className={classNames("w-full flex items-center px-6 pt-6",
                isAdmin ? "justify-between" : "justify-end")}>
                {(isAdmin && !isConversations) && (
                    <button
                        onClick={()=> router.push('/conversations')}
                    >
                        <Image src={ConversIcon} width={25} height={25} alt={"Conversation icon"}/>
                    </button>
                )}
                {(isAdmin && isConversations) && (
                        <button
                        onClick={() => router.push('/')}
                        type="button"
                        className="text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                    </button>
                )}
                <button
                    onClick={() => setLogout(true)}
                    type="button"
                    className="text-white"
                >
                    <Image src={CloseIcon} width={20} height={20} alt={"Conversation icon"}/>
                </button>
            </div>
            {logout && (
                <Logout setLogout={setLogout}/>
            )}
        </div>
    )
}
export default Navbar