'use client'

import { useState, useRef } from "react";

export default function NewVacancyWrapper() {
    const [title, setTitle] = useState("")
    const [salary, setSalary] = useState("")
    const [exp, setExp] = useState("")
    const [description, setDescription] = useState("")
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null)

    const [saveInfo, setSaveInfo] = useState("")
    const [isError, setError] = useState(false)

    function handleDescriptonChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setDescription(e.target.value)
        if (descriptionRef.current) {
            descriptionRef.current.style.height = 'auto';
            descriptionRef.current.style.height = descriptionRef.current.scrollHeight + 'px';
        }
    }

    const [isAdded, setAdded] = useState(false)
    function sendVacancyForm() {
        const form = {
            title: title,
            salary: salary,
            exp: exp,
            description: description,
        }

        // Выполнение запроса
        const url = `/api/vacancy/addVacancy`
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(form)
        })
            .then(response_data => response_data.json())
            .then(response_data => {
                if (response_data.status != 200) {
                    setSaveInfo(response_data.payload)
                    setError(true)
                }
                else {
                    setSaveInfo(response_data.payload)
                    setError(false)
                    setAdded(true)
                }
            })
    }

    return (
        <div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col gap-[32px] max750px:gap-[16px]">
            {/* Враппер под 1140px для новой вакансии */}

            {/* Заголовок */}
            <div className='flex flex-col mt-[16px] gap-[8px]'>
                <span className='text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]'>Новая вакансия</span>
                <div className='w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]'></div>
            </div>

            {/* Поле заголовка */}
            <div className="flex flex-col gap-[8px]">
                <span className="text-[20px] leading-[20px] max750px:text-[16px] max750px:leading-[16px] font-[500] font-mulish text-[#000000]">Заголовок вакансии <span className="text-[#FF5C35]">*</span></span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Python разработчик"></input>
            </div>

            {/* Поле зарплаты */}
            <div className="flex flex-col gap-[8px]">
                <span className="text-[20px] leading-[20px] max750px:text-[16px] max750px:leading-[16px] font-[500] font-mulish text-[#000000]">Предлагаемая зарплата <span className="text-[#FF5C35]">*</span></span>
                <input value={salary} onChange={(e) => setSalary(e.target.value)} className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="250000"></input>
            </div>

            {/* Поле опыта */}
            <div className="flex flex-col gap-[8px]">
                <span className="text-[20px] leading-[20px] max750px:text-[16px] max750px:leading-[16px] font-[500] font-mulish text-[#000000]">Необходимый опыт работы <span className="text-[#FF5C35]">*</span></span>
                <input value={exp} onChange={(e) => setExp(e.target.value)} className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="6"></input>
            </div>

            {/* Поле для вакансии */}
            <div className="flex flex-col gap-[8px]">
                <span className="text-[20px] leading-[20px] max750px:text-[16px] max750px:leading-[16px] font-[500] font-mulish text-[#000000]">Текст вакансии <span className="text-[#FF5C35]">*</span></span>
                <textarea ref={descriptionRef} value={description} onChange={handleDescriptonChange} className="relative w-full min-h-[600px] rounded-[8px] outline-none p-[12px] bg-[#dddddd] text-[14px] leading-[18px] font-[500] font-mulish text-[#222231] opacity-50 resize-none" placeholder="Текст вакансии"></textarea>
            </div>

            {/* Текст ошибки */}
            {saveInfo == "" ? null : <span className={`text-[16px] leading-[16px] max750px:text-[14px] max750px:leading-[14px] font-[500] font-mulish ${isError ? "text-[#FF5C35]" : "text-[#53BB6A]"} `}>{saveInfo}</span>}

            {isAdded
            ? null
            : <button onClick={() => sendVacancyForm()} className="w-[195px] h-[45px] max750px:w-[135px] max750px:h-[32px] bg-[#FF6F0E] rounded-[6px] flex justify-center items-center text-[18px] leading-[18px] max750px:text-[12px] max750px:leading-[12px] font-[700] font-mulish text-[#FFFFFF]">Добавить</button>}
        </div>
    );
}