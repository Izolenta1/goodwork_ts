import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "404",
};


export default function NotFound() {
    return (
        <main className="grow flex flex-col items-center">

            {/* Враппер под 1140px для страницы 404 */}
            <div className="w-[1140px] h-fit flex flex-col gap-[32px]">

                {/* Заголовок */}
                <div className='flex flex-col mt-[16px] gap-[8px]'>
                    <span className='text-[40px] leading-[40px] font-mulish font-[900] text-[#313131]'>Ошибка 404 - не найдено</span>
                    <div className='w-[140px] h-[6px] bg-[#FF6F0E]'></div>
                </div>


            </div>
        </main>
    );
}