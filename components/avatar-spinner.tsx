const AvatarSpinner = () => {
    return (
        <div className={"w-20 h-20 rounded-full relative"}>
            <div className={"w-[4.25rem] h-[4.25rem] bg-green-300 rounded-full absolute top-2 left-2"}></div>
            <svg
                className={"w-[5.4rem] h-[5.4rem] absolute top-0 -left-[0.5px]"}
                viewBox="0 0 200 200"
                // TODO: CHANGE HERE THE COLOR OF THE SPINNER
                color="#EA4444"
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
    )
}
export default AvatarSpinner