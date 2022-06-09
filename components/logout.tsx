import {useRouter} from "next/router";
import {supabase} from "../utils/supabase-client";

interface Logout{
    setLogout: (value: boolean) => void;
}
const Logout = ({setLogout}: Logout) => {
    const router = useRouter()

    const handleLogout = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) console.log(error)
        router.push('/login')
    }
    return(
        <div className={"w-full h-24 font-Inter text-whiteBorder flex flex-col items-center py-4"}>
            <span className={"font-semibold"}>Do you want to logout?</span>
            <div className={"w-52 h-10 border-green-200 flex items-center justify-between px-7"}>
                <button onClick={handleLogout}>Yes</button>
                <button onClick={() => setLogout(false)}>No</button>
            </div>
        </div>
    )
}
export default Logout;