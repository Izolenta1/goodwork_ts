'use client'

import { useEffect } from "react";
import Link from "next/link";
import VacancyCell from "@/components/CabinetComponents/VacancyComponents/VacancyCell";
import { useEmployerCabinet } from "@/context/EmployerCabinetContext";

export default function EmployerWrapper() {
    const { vacancies, setVacancies } = useEmployerCabinet()

    useEffect(() => {
        fetch("/api/vacancy/getUserVacancies")
            .then(response_data => response_data.json())
            .then(response_data => {
                setVacancies(response_data.payload)
            })
    }, [setVacancies])

    return (
        <div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col gap-[32px] max750px:gap-[16px]">
            {/* Враппер под 1140px для страницы работодателя */}

            {/* Заголовок */}
            <div className='flex flex-col mt-[16px] gap-[8px]'>
                <span className='text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]'>Ваши вакансии</span>
                <div className='w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]'></div>
            </div>

            <Link href="/cabinet/vacancy/new" className="flex justify-center items-center bg-[#FF6F0E] rounded-[6px] w-[200px] h-[50px] max750px:w-[135px] max750px:h-[32px] text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-[700] font-mulish text-[#FFFFFF]">Создать вакансию</Link>

            {/* Враппер вакансий */}
            <div className="flex flex-col gap-[16px] max750px:gap-[10px]">
                {vacancies.map(vacancy => <VacancyCell key={vacancy.vacancy_id} vacancy_id={vacancy.vacancy_id} title={vacancy.title} salary={vacancy.salary} exp={vacancy.experience} description={vacancy.description} />)}
            </div>
        </div>
    );
}