import VacancyCell from "@/components/VacancyComponents/VacancyCell";

interface Vacancy {
    description: string,
    experience: number,
    fav_vacancy_id: number,
    salary: number,
    title: string,
    user_id: number,
    vacancy_id: number
}

interface FavouriteWrapperProps {
    VacanciesList: Vacancy[]
}

export default function FavouriteWrapper({ VacanciesList }: FavouriteWrapperProps) {
    return (
        <div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col gap-[32px] max750px:gap-[16px]">
            {/* Враппер под 1140px для новой вакансии */}

            {/* Заголовок */}
            <div className='flex flex-col mt-[16px] gap-[8px]'>
                <span className='text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]'>Избранные вакансии</span>
                <div className='w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]'></div>
            </div>

            {/* Враппер избранных вакансий */}
            <div className="flex flex-col gap-[16px] max750px:gap-[10px]">
                {VacanciesList.length > 0
                    ? VacanciesList.map(vacancy => <VacancyCell key={vacancy.vacancy_id} vacancy_id={vacancy.vacancy_id} title={vacancy.title} salary={vacancy.salary} exp={vacancy.experience} description={vacancy.description} />)
                    : <span className="text-[24px] leading-[24px] max750px:text-[18px] max750px:leading-[18px] self-center font-mulish font-[900] text-[#313131]">Вакансии не найдены</span>}
            </div>
        </div>
    );
}