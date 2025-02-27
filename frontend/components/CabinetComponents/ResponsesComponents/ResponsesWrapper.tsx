import ResponseCell from "@/components/CabinetComponents/ResponsesComponents/ResponseCell";

interface Vacancy {
    vacancy_id: number,
    title: string,
    salary: number,
    experience: number,
    description: string,
    user_id: number
}

interface Response {
    response_id: number,
    user_id: number,
    vacancy_id: number,
    resume_id: number,
    email: string,
    description: string,
    username: string
}

interface ResponsesWrapperProps {
    VacancyData: Vacancy,
    ResumesList: Response[]
}

export default function ResponsesWrapper({ VacancyData, ResumesList }: ResponsesWrapperProps) {

    return (
        <div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col gap-[32px] max750px:gap-[16px]">
            {/* Враппер под 1140px для новой вакансии */}

            {/* Заголовок */}
            <div className='flex flex-col mt-[16px] gap-[8px]'>
                <span className='text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]'>Отклики вакансии «{VacancyData.title}»</span>
                <div className='w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]'></div>
            </div>

            {/* Враппер откликов */}
            <div className="flex flex-col gap-[16px] max750px:gap-[10px]">
                {ResumesList.length > 0
                    ? ResumesList.map(resume => <ResponseCell key={resume.response_id} email={resume.email} description={resume.description} />)
                    : <span className="text-[24px] leading-[24px] max750px:text-[18px] max750px:leading-[18px] self-center font-mulish font-[900] mb-[12px] text-[#313131]">Отклики отсутствуют</span>}
            </div>
        </div>
    );
}