import type {NextPage} from 'next'
import Image from "next/image";


const Welcome: NextPage = () => {

    return (
        <div className="min-h-full flex flex-col justify-center items-center bg-dark h-screen text-white px-2 py-3">
            <div
                className="w-full flex flex-col items-center justify-center h-full border-[1px] border-whiteBorder rounded-[25px] m-2">
                <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className={"w-64 h-80  relative flex items-center justify-center"}>
                        <div className={"w-4 h-4 border-t-2 border-l-2 border-white absolute top-0 left-0"}>
                        </div>
                        <div className={"w-4 h-4 border-t-2 border-r-2 border-white absolute top-0 right-0"}>
                        </div>
                        <div className={"w-4 h-4 border-b-2 border-l-2 border-white absolute bottom-0 left-0"}>
                        </div>
                        <div className={"w-4 h-4 border-b-2 border-r-2 border-white absolute bottom-0 right-0"}>
                        </div>
                        <div className={"bg-dark flex flex-col items-center absolute top-12 w-44 h-44"}>
                            <Image src={"/qr.png"} layout={"fill"} className={"border-2 "}/>
                        </div>
                        <span className={"text-white text-xl absolute bottom-12"}>SCAN ME</span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Welcome
