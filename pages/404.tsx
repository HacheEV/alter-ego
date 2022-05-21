import {useEffect} from "react";
import {useRouter} from "next/router";

const NotFound = () => {
    const router = useRouter();
    setTimeout(() => {
        router.push('/')
    }, 4000);
    return (
        <div className="min-h-full flex flex-col justify-center items-center bg-dark h-screen text-white px-2 py-3">
            <div className="w-full flex flex-col items-center justify-center h-full border-[1px] border-whiteBorder rounded-[25px] m-2">
                <h1 className={"my-4 text-xl"}>This page doesn't exist.</h1>
            </div>
        </div>
    )
}
export default NotFound