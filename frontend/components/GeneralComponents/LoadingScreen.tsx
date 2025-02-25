interface LoadingScreenProps {
    className: string
}

export default function LoadingScreen({ className }: LoadingScreenProps) {
    return (
        <div className={`${className} flex flex-row justify-center items-center`}>
            <div className="w-[100px] h-[100px] max920px:w-[50px] max920px:h-[50px] border-[8px] max920px:border-[4px] rounded-[50%] border-l-[#FF6F0E] border-t-[#FF6F0E] border-r-[#313131] border-b-[#313131] animate-spin"></div>
        </div>
    )
}