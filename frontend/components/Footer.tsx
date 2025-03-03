import VacancySearchInput from "@/components/GeneralComponents/VacancySearchInput";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full h-fit flex justify-center bg-[#313131] py-[24px] mt-[16px]">

            {/* Враппер для основного содержимого под 1140px */}
            <div className="w-[1140px] max1200px:w-[95%] flex flex-row justify-between max920px:justify-center max920px:gap-[12px] items-center max450px:flex-col-reverse">

                {/* Навигация */}
                <div className="w-[150px] max750px:w-[120px] h-fit flex flex-col items-start gap-[16px] max750px:gap-[12px]">
                    <span className="text-[24px] leading-[24px] max750px:text-[20px] max750px:leading-[20px] font-mulish font-[600] text-[#FFFFFF]">Навигация</span>
                    <Link href="/" className="text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-mulish font-[400] text-[#FFFFFF] text-start hover:text-[#FF6F0E] select-none transition ease-in-out duration-300">Главная</Link>
                    <Link href="/vacancy" className="text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-mulish font-[400] text-[#FFFFFF] text-start hover:text-[#FF6F0E] select-none transition ease-in-out duration-300">Вакансии</Link>
                    <Link href="/cabinet" className="text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-[400] font-mulish text-[#FFFFFF] hover:text-[#FF6F0E] select-none transition ease-in-out duration-300">Личный кабинет</Link>
                </div>

                <VacancySearchInput />

                <div className="flex flex-col items-center max920px:hidden w-[150px] text-[80px] leading-[80px] font-[700] font-mulish text-[#FFFFFF] text-end select-none">
                    <span>GW</span>
                    <span className="text-[12px] leading-[12px] font-[700] font-mulish text-[#FFFFFF]">Дипломный проект</span>
                </div>
            </div>
        </footer>
    );
}