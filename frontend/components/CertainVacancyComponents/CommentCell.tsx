export default function CommentCell({ username, comment }) {
    return (
        <div className="flex flex-col gap-[8px] p-[12px] border-[2px] border-[#FF6F0E]">
            <div className='flex flex-col gap-[8px]'>
                <span className='text-[24px] leading-[24px] max750px:text-[14px] max750px:leading-[14px] font-mulish font-[900] text-[#313131]'>{username}</span>
                <div className='w-[140px] h-[3px] max750px:h-[2px] bg-[#FF6F0E]'></div>
            </div>
            <span className="text-[16px] leading-[20px] max750px:text-[12px] max750px:leading-[16px] font-mulish font-[400] text-[#000000] whitespace-pre-wrap">{comment}</span>
        </div>
    );
}