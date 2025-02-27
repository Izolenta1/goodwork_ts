import Link from "next/link";

interface VacancyCellProps {
    vacancy_id: number,
    title: string,
    salary: number,
    exp: number,
    description: string
}

export default function VacancyCell({ vacancy_id, title, salary, exp, description }: VacancyCellProps) {
    return (
        <div className="flex gap-[12px] w-full p-[12px] border-l-[6px] max750px:border-l-[3px] border-l-[#FF6F0E] rounded-[6px] max750px:rounded-[3px] hover:bg-[#ffebde] transition ease-in-out duration-300">
            <div className="flex flex-col gap-[12px] max750px:gap-[8px]">
                <div className="table table-fixed break-words w-fit">
                    <Link href={`/vacancy/${vacancy_id}`} className='text-[32px] max750px:text-[20px] font-mulish font-[900] text-[#313131] line-clamp-1'>{title}</Link>
                </div>
                <span className="text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[700] text-[#313131]">{salary} ₽</span>
                <span className="text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[700] text-[#313131]">Необходимо лет опыта: {exp == 0 ? "Без опыта" : exp}</span>
                <div className="table table-fixed break-words w-fit">
                    <span className="text-[16px] leading-[20px] max750px:text-[12px] max750px:leading-[14px] font-mulish font-[400] text-[#313131] line-clamp-[5]">{description}</span>
                </div>

                <Link href={`/vacancy/${vacancy_id}`} className="h-[50px] w-[150px] max750px:w-[135px] max750px:h-[32px] flex justify-center items-center bg-[#FF6F0E] rounded-[4px] text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-mulish font-[600] text-[#FFFFFF]">Подробнее</Link>
            </div>
        </div>
    );
}