import Eye from "@/svg/Eye";
import Edit from "@/svg/Edit";
import Trash from "@/svg/Trash";
import Link from "next/link";
import { useEmployerCabinet } from "@/context/EmployerCabinetContext";

interface VacancyCellProps {
    vacancy_id: number,
    title: string,
    salary: number,
    exp: number,
    description: string
}

export default function VacancyCell({ vacancy_id, title, salary, exp, description }: VacancyCellProps) {
    const { setVacancies } = useEmployerCabinet()


    function deleteVacancy() {
        const form = {
            vacancy_id: vacancy_id,
        }

        const url = `/api/vacancy/deleteVacancy`
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(form)
        })
        setVacancies(prev => [...prev].filter(vacancy => vacancy.vacancy_id != vacancy_id))
    }

    return (
        <div className="flex max450px:flex-col gap-[12px] w-full p-[12px] border-l-[6px] max750px:border-l-[3px] border-l-[#FF6F0E] rounded-[6px] max750px:rounded-[3px] hover:bg-[#ffebde] transition ease-in-out duration-300">
            <div className="flex flex-col gap-[12px] max750px:gap-[8px]">
                <div className="table table-fixed break-words w-fit">
                    <span className='text-[32px] max750px:text-[20px] font-mulish font-[900] text-[#313131] line-clamp-1'>{title}</span>
                </div>
                <span className="text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[700] text-[#313131]">{salary} ₽</span>
                <span className="text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[700] text-[#313131]">Необходимо лет опыта: {exp == 0 ? "Без опыта" : exp}</span>
                <div className="table table-fixed break-words w-fit">
                    <span className="text-[16px] leading-[20px] max750px:text-[12px] max750px:leading-[14px] font-mulish font-[400] text-[#313131] line-clamp-[8]">{description}</span>
                </div>
            </div>

            <div className="flex gap-[12px] max750px:gap-[8px]">
                <Link href={`/cabinet/vacancy/responses/${vacancy_id}`} className="flex justify-center items-center w-[50px] h-[50px] max750px:w-[35px] max750px:h-[35px] bg-[#53BB6A] rounded-[6px]" title="Посмотреть отклики">
                    <Eye className="w-[24px] h-[24px] max750px:w-[20px] max750px:h-[20px] fill-[#FFFFFF]" />
                </Link>
                <Link href={`/cabinet/vacancy/edit/${vacancy_id}`} className="flex justify-center items-center w-[50px] h-[50px] max750px:w-[35px] max750px:h-[35px] bg-[#FF6F0E] rounded-[6px]" title="Редактировать">
                    <Edit className="w-[24px] h-[24px] max750px:w-[20px] max750px:h-[20px] fill-[#FFFFFF]" />
                </Link>
                <button onClick={deleteVacancy} className="flex justify-center items-center w-[50px] h-[50px] max750px:w-[35px] max750px:h-[35px] bg-[#858585] rounded-[6px]" title="Удалить">
                    <Trash className="w-[24px] h-[24px] max750px:w-[20px] max750px:h-[20px] fill-[#FFFFFF]" />
                </button>
            </div>
        </div>
    );
}