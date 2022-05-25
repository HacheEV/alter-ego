import Image from 'next/image'
import ConversIcon from '../public/convers-icon.png'
import CloseIcon from '../public/close.png'
import {classNames} from "../utils/classnames";
import {supabase} from "../utils/supabase-client";
import {useRouter} from "next/router";

interface Navbar {
    isAdmin: boolean;
}

const Navbar = ({isAdmin}: Navbar) => {
    const router = useRouter()

    const handleLogout = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) console.log(error)
        router.push('/login')
    }
    return (
        <div className={classNames("w-full flex items-center px-6 pt-6",
            isAdmin ? "justify-between" : "justify-end")}>
            {isAdmin && (
                <button
                    onClick={()=> router.push('/conversations')}
                >
                    <Image src={ConversIcon} width={25} height={25} alt={"Conversation icon"}/>
                </button>
            )}
            <button
                onClick={handleLogout}
                type="button"
                className="text-white"
            >
                <Image src={CloseIcon} width={20} height={20} alt={"Conversation icon"}/>
            </button>
        </div>
    )
}
export default Navbar