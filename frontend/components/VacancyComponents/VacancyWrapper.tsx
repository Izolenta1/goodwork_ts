'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Dropdowns from "@/components/VacancyComponents/Dropdowns";
import Check from "@/svg/Check";
import VacancyCell from "@/components/VacancyComponents/VacancyCell";
import LoadingScreen from "@/components/GeneralComponents/LoadingScreen"
import { useRouter } from "next/navigation"

interface Vacancy {
    vacancy_id: number,
    title: string,
    salary: number,
    experience: number,
    description: string,
    user_id?: number,
    url?: string,
    type?: string,
    currency?: string
}

interface searchParams {
    min_salary?: string,
    min_exp?: string,
    max_exp?: string,
    search?: string
}

interface VacancyWrapperProps {
    VacanciesList: Vacancy[],
    VacanciesNext: string,
    FilterParams: searchParams
}

export default function VacancyWrapper({ VacanciesList, VacanciesNext, FilterParams }: VacancyWrapperProps) {
    const [vacanciesList, setVacanciesList] = useState<Vacancy[]>(VacanciesList)
    const [vacanciesNext, setVacanciesNext] = useState<string>(VacanciesNext)

    const loadingLastElement = useRef<HTMLDivElement | null>(null)
    const observer = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        // Функция загрузки данных
        const fetchVacancies = async () => {
            if (!vacanciesNext) return;

            try {
                const response = await fetch(vacanciesNext);
                const data = await response.json();

                setVacanciesList((prev) => [...prev, ...data.payload.result]);
                setVacanciesNext(data.payload.next);
            } catch (error) {
                console.error("Ошибка загрузки вакансий:", error);
            }
        };

        if (!loadingLastElement.current) return;

        if (vacanciesNext == null) {
            loadingLastElement.current.classList.add("hidden")
            return
        }

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && vacanciesNext) {
                fetchVacancies();
            }
        });

        observer.current.observe(loadingLastElement.current);

        return () => observer.current?.disconnect();
    }, [vacanciesNext, setVacanciesList, setVacanciesNext]);

    useEffect(() => {
        window.addEventListener("beforeunload", function () { window.scrollTo(0, 0); })
    }, [])

    // Функция применения фильтра
    const router = useRouter();
    function applyFilter() {
        const min_salary = document.getElementById("min_salary") as HTMLInputElement
        const min_exp = document.getElementById("min_exp") as HTMLInputElement
        const max_exp = document.getElementById("max_exp") as HTMLInputElement

        const new_url = new URL(`http://localhost:3000/vacancy`);

        if (min_salary.value) {
            new_url.searchParams.append('min_salary', min_salary.value)
        }
        if (min_exp.value) {
            new_url.searchParams.append('min_exp', min_exp.value)
        }
        if (max_exp.value) {
            new_url.searchParams.append('max_exp', max_exp.value)
        }
        if (FilterParams["search"]) {
            new_url.searchParams.append('search', FilterParams["search"])
        }

        router.push(`${new_url.pathname}${new_url.search}`)
    }

    return (
        <div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col gap-[32px] max750px:gap-[16px]">
            {/* Враппер под 1140px для новой вакансии */}

            {/* Заголовок */}
            <div className='flex flex-col mt-[16px] gap-[8px]'>
                <span className='text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]'>Вакансии</span>
                {FilterParams["search"] != null
                    ? <span className="text-[32px] leading-[32px] max750px:text-[14px] max750px:leading-[14px] font-[500] font-mulish text-[#313131]">«{FilterParams["search"]}»</span>
                    : null}
                <div className='w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]'></div>
            </div>

            {/* Настройки фильтра */}
            <div className="flex flex-row gap-[12px] max750px:gap-[6px]">

                {/* Кнопка очистки фильтра */}
                <Link href={`/vacancy`} title="Очистить фильтр" className="h-[40px] w-[40px] max750px:h-[32px] max750px:w-[32px] flex justify-center items-center bg-[#FF6F0E] rounded-[4px]">
                    <span className="text-[16px] leading-[16px] max750px:text-[14px] max750px:leading-[14px] font-[700] max580px:font-[400] text-[#FFFFFF]">X</span>
                </Link>

                {/* Дропдауны */}
                <Dropdowns FilterParams={FilterParams} />

                {/* Кнопка применения фильтра */}
                <button onClick={applyFilter} className="h-[40px] w-[100px] max750px:h-[32px] max750px:w-[80px] max580px:w-[32px] flex justify-center items-center bg-[#FF6F0E] rounded-[4px]" title="Применить">
                    <span className="max580px:hidden text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-mulish font-[600] text-[#FFFFFF]">Применить</span>
                    <Check className="hidden max580px:block w-[14px] h-[14px] fill-[#FFFFFF]" />
                </button>
            </div>

            {/* Враппер вакансий */}
            <div className="flex flex-col gap-[16px]">
                {vacanciesList.length > 0
                    ? vacanciesList.map(vacancy => <VacancyCell key={vacancy.vacancy_id} vacancy_id={vacancy.vacancy_id} title={vacancy.title} salary={vacancy.salary} exp={vacancy.experience} description={vacancy.description} type={vacancy.type} url={vacancy.url} currency={vacancy.currency} />)
                    : <span className="text-[24px] leading-[24px] self-center font-mulish font-[900] text-[#313131]">Вакансии не найдены</span>}
            </div>

            {/* Блок с загрузкой. Обсервится для подгрузки контента */}
            <div ref={loadingLastElement} className="flex flex-col items-center gap-[12px] w-full h-[200px] max920px:h-[100px] mt-[24px]">
                <LoadingScreen className="" />
                <span className="text-[32px] max920px:text-[16px] font-[700] font-mulish text-[#313131]">Подготовка вакансий</span>
            </div>
        </div>
    );
}