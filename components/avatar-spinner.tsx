import Image from "next/image";
import AlterAvatar from "../public/alter-avatar.png";

interface Avatar{
    isLoader: boolean
}
const AvatarSpinner = ({isLoader}:Avatar ) => {
    return (
   <>
       {isLoader ? (
           <div className={"w-32 h-32 rounded-full relative"}>
               <div className={"w-28 h-28 p-2 absolute top-2 left-2 bg-white rounded-full"}>
               </div>
               <svg
                   className={"w-full h-full absolute top-0 -left-[0.5px]"}
                   viewBox="0 0 200 200"
                   // TODO: CHANGE HERE THE COLOR OF THE SPINNER
                   color="#E8B7DA"
                   fill="none"
                   xmlns="http://www.w3.org/2000/svg"
               >
                   <defs>
                       <linearGradient id="spinner-secondHalf">
                           <stop offset="0%" stopOpacity="0" stopColor="currentColor" />
                           <stop offset="100%" stopOpacity="0.5" stopColor="currentColor" />
                       </linearGradient>
                       <linearGradient id="spinner-firstHalf">
                           <stop offset="0%" stopOpacity="1" stopColor="currentColor" />
                           <stop offset="100%" stopOpacity="0.5" stopColor="currentColor" />
                       </linearGradient>
                   </defs>

                   <g strokeWidth="8">
                       <path stroke="url(#spinner-secondHalf)" d="M 4 100 A 96 96 0 0 1 196 100" />
                       <path stroke="url(#spinner-firstHalf)" d="M 196 100 A 96 96 0 0 1 4 100" />
                       <path
                           stroke="currentColor"
                           strokeLinecap="round"
                           d="M 4 100 A 96 96 0 0 1 4 98"
                       />
                   </g>
                   <animateTransform
                       from="0 0 0"
                       to="360 0 0"
                       attributeName="transform"
                       type="rotate"
                       repeatCount="indefinite"
                       dur="1300ms"
                   />
               </svg>
           </div>
       ) : (
           <div className={"w-44 h-44 rounded-full relative"}>
               <div className={"w-40 h-40 p-2 absolute top-2 left-2"}>
                   <Image src={AlterAvatar} layout={"responsive"} />
               </div>
               <svg
                   className={"w-full h-full absolute top-0 -left-[0.5px]"}
                   viewBox="0 0 200 200"
                   // TODO: CHANGE HERE THE COLOR OF THE SPINNER
                   color="#E8B7DA"
                   fill="none"
                   xmlns="http://www.w3.org/2000/svg"
               >
                   <defs>
                       <linearGradient id="spinner-secondHalf">
                           <stop offset="0%" stopOpacity="0" stopColor="currentColor" />
                           <stop offset="100%" stopOpacity="0.5" stopColor="currentColor" />
                       </linearGradient>
                       <linearGradient id="spinner-firstHalf">
                           <stop offset="0%" stopOpacity="1" stopColor="currentColor" />
                           <stop offset="100%" stopOpacity="0.5" stopColor="currentColor" />
                       </linearGradient>
                   </defs>

                   <g strokeWidth="8">
                       <path stroke="url(#spinner-secondHalf)" d="M 4 100 A 96 96 0 0 1 196 100" />
                       <path stroke="url(#spinner-firstHalf)" d="M 196 100 A 96 96 0 0 1 4 100" />
                       <path
                           stroke="currentColor"
                           strokeLinecap="round"
                           d="M 4 100 A 96 96 0 0 1 4 98"
                       />
                   </g>
                   <animateTransform
                       from="0 0 0"
                       to="360 0 0"
                       attributeName="transform"
                       type="rotate"
                       repeatCount="indefinite"
                       dur="1300ms"
                   />
               </svg>
           </div>
       )}

   </>

    )
}
export default AvatarSpinner