'use client'

import VacancySearchInput from "@/components/GeneralComponents/VacancySearchInput";

export default function IndexWrapper() {
    return (
        <div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col gap-[32px] max750px:gap-[16px]">
            {/* Враппер под 1140px для главной */}
            
            {/* Заголовок */}
            <div className="flex flex-col mt-[16px] gap-[8px]">
                <span className="text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]">
                    Good work
                </span>
                <div className="w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]"></div>
            </div>

            <div className="flex flex-col gap-[16px] items-center justify-center h-[600px] max1200px:h-auto max1200px:aspect-[1920/1000] relative bg-[url('/index/index_banner.jpg')] bg-cover max1200px:bg-contain max1200px:bg-no-repeat">
                <span className="text-[40px] leading-[40px] max750px:text-[24px] max750px:leading-[24px] max450px:text-[18px] max450px:leading-[18px] font-mulish font-[700] text-[#FFFFFF]">
                    Работа найдется каждому!
                </span>
                <VacancySearchInput />
            </div>

            <span className="text-[24px] leading-[42px] max750px:text-[16px] max750px:leading-[20px] font-[600] font-mulish text-[#000000]">
                Работа составляет большую часть жизни почти каждого из нас.
                Но ничто не вечно: случается, что однажды приходится менять
                место работы и с головой погружаться в поиски вакансий —
                хочется ведь найти хорошую альтернативу текущей должности.
                <br></br>
                <br></br>
                Однако зачастую при смене работы мы задумываемся не только о
                смене компании, но и об изменении профессиональной
                деятельности. И именно в эти моменты возникает вопрос: «Как
                теперь найти хорошую работу в Москве? А главное, какой
                должна быть эта работа?»
                <br></br>
                <br></br>
                Добро пожаловать на «Good Work» - ваше надежное
                онлайн-решение для поиска работы! Мы понимаем, как важно
                найти не просто работу, а именно ту, которая будет
                соответствовать вашим навыкам, интересам и карьерным целям.
            </span>
        </div>
    );
}