'use client'

import { useState, useRef, useEffect } from "react";
import Heart from "@/svg/Heart";
import CommentCell from "@/components/CertainVacancyComponents/CommentCell";

interface Vacancy {
    vacancy_id: number,
    title: string,
    salary: number,
    experience: number,
    description: string,
    user_id: number
}

interface Comment {
    feedback_id: number,
    comment: string,
    user_id: number,
    vacancy_id: number,
    username: string
}

interface CertainVacancyWrapperProps {
    vacancyData: Vacancy,
    isResponseSet: boolean,
    isfavouriteSet: boolean,
    CommentList: Comment[]
}

export default function CertainVacancyWrapper({ vacancyData, isResponseSet, isfavouriteSet, CommentList }: CertainVacancyWrapperProps) {
    const [btnErrorText, setBtnErrorText] = useState("")
    const [commentErrorText, setCommentErrorText] = useState("")

    const [commentList, setCommentList] = useState(CommentList)

    // Функция добавления/удаления отклика
    const [isResponse, setResponse] = useState(isResponseSet)
    function addRemoveResponse() {
        setBtnErrorText("")
        const form = {
            vacancy_id: vacancyData.vacancy_id,
        }

        // Выполнение запроса
        let url = `/api/response`
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(form)
        })
            .then(response_data => response_data.json())
            .then(response_data => {
                if (response_data.payload == "Отклик удален") {
                    setResponse(false)
                }
                if (response_data.payload == "Отклик добавлен") {
                    setResponse(true)
                }
                if (response_data.payload == "Нет резюме") {
                    setBtnErrorText("Для отклика необходимо резюме")
                }
                if (response_data.status == 401) {
                    setBtnErrorText("Для отклика необходима авторизация")
                }
                if (response_data.status == 403) {
                    setBtnErrorText("Отклик доступен только для соискателя")
                }
            })
    }

    // Функция добавления/удаления избранной вакансии
    const [isFavourite, setFavourite] = useState(isfavouriteSet)
    function addRemoveFavourite() {
        setBtnErrorText("")
        const form = {
            vacancy_id: vacancyData.vacancy_id,
        }

        // Выполнение запроса
        let url = `/api/favourite`
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(form)
        })
            .then(response_data => response_data.json())
            .then(response_data => {
                if (response_data.payload == "Избранная вакансия удалена") {
                    setFavourite(false)
                }
                if (response_data.payload == "Избранная вакансия добавлена") {
                    setFavourite(true)
                }
                if (response_data.status == 401) {
                    setBtnErrorText("Для избранного необходима авторизация")
                }
                if (response_data.status == 403) {
                    setBtnErrorText("Избранное доступно только для соискателя")
                }
            })
    }

    const [comment, setComment] = useState("")
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    useEffect(() => {
        if (commentRef.current) {
            commentRef.current.style.height = commentRef.current.scrollHeight + 'px';
        }
    }, [comment])

    // Функция отправки отзыва
    function addFeedback() {
        setCommentErrorText("")
        const form = {
            comment: comment,
            vacancy_id: vacancyData.vacancy_id,
        }

        // Выполнение запроса
        let url = `/api/vacancy/feedback`
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(form)
        })
            .then(response_data => response_data.json())
            .then(response_data => {
                switch (response_data.status) {
                    case 200:
                        setComment("")
                        setCommentList(prev => [...prev, response_data.payload])
                        break
                    case 401:
                        setCommentErrorText("Для отзыва необходима авторизация")
                        break
                    case 403:
                        setCommentErrorText("Отзывы доступны только соискателям")
                        break
                    default:
                        setCommentErrorText(response_data.payload)
                        break
                }
            })
    }

    return (
        <div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col gap-[32px] max750px:gap-[16px]">
            {/* Враппер под 1140px для новой вакансии */}

            {/* Заголовок */}
            <div className='flex flex-col mt-[16px] gap-[8px]'>
                <span className='text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]'>{vacancyData.title}</span>
                <div className='w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]'></div>
            </div>

            {/* Краткие характеристики и кнопки */}
            <div className="flex flex-col gap-[20px] max750px:gap-[12px]">
                <div className="flex flex-col gap-[4px]">
                    <span className='text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[600] text-[#313131]'>Зарплата: <span className="font-[900]">{vacancyData.salary} рублей</span></span>
                    <span className='text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[600] text-[#313131]'>Необходимо лет опыта: <span className="font-[900]">{vacancyData.experience == 0 ? "Без опыта" : vacancyData.experience}</span></span>
                </div>

                <div className="flex flex-col gap-[12px] max750px:gap-[8px]">
                    <div className="flex gap-[12px] max750px:gap-[8px]">
                        <button onClick={addRemoveResponse} className={`h-[50px] w-[150px] max750px:w-[120px] max750px:h-[40px] flex justify-center items-center ${isResponse ? "bg-[#313131]" : "bg-[#53BB6A]"} rounded-[4px] text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-mulish font-[600] text-[#FFFFFF] transition ease-in-out duration-300`} title={isResponse ? "Удалить отклик" : "Откликнуться"}>Откликнуться</button>
                        <button onClick={addRemoveFavourite} className={`h-[50px] w-[50px] max750px:w-[40px] max750px:h-[40px] flex justify-center items-center ${isFavourite ? "bg-[#313131]" : "bg-[#53BB6A]"} rounded-[4px] transition ease-in-out duration-300`} title={isFavourite ? "Удалить из избранного" : "Добавить в избранное"}><Heart className="w-[24px] h-[24px] max750px:w-[16px] max750px:h-[16px] fill-[#FFFFFF]" /></button>
                    </div>
                    {btnErrorText != ""
                        ? <span className={`text-[16px] leading-[16px] max750px:text-[14px] max750px:leading-[14px] font-[500] font-mulish text-[#FF5C35]`}>{btnErrorText}</span>
                        : null}
                </div>
            </div>

            {/* Описание вакансии */}
            <div className="flex flex-col gap-[32px] max750px:gap-[16px]">

                {/* Заголовок */}
                <div className='flex flex-col mt-[16px] gap-[8px]'>
                    <span className='text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]'>Описание</span>
                    <div className='w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]'></div>
                </div>

                <span className="text-[24px] leading-[32px] max750px:text-[16px] max750px:leading-[20px] font-mulish font-[400] text-[#000000] whitespace-pre-wrap">{vacancyData.description}</span>
            </div>

            {/* Отзывы о вакансии */}
            <div className="flex flex-col gap-[32px] max750px:gap-[16px]">

                {/* Заголовок */}
                <div className='flex flex-col mt-[16px] gap-[8px]'>
                    <span className='text-[40px] leading-[40px] max750px:text-[18px] max750px:leading-[18px] font-mulish font-[900] text-[#313131]'>Отзывы о вакансии</span>
                    <div className='w-[140px] h-[6px] max750px:h-[3px] bg-[#FF6F0E]'></div>
                </div>

                {/* Поле комментария */}
                <div className="flex flex-col gap-[8px]">
                    <span className="text-[20px] leading-[20px] max750px:text-[16px] max750px:leading-[16px] font-[500] font-mulish text-[#000000]">Текст отзыва <span className="text-[#FF5C35]">*</span></span>
                    <textarea ref={commentRef} value={comment} onChange={(e) => setComment(e.target.value)} className="relative w-full min-h-[200px] rounded-[8px] outline-none p-[12px] bg-[#dddddd] text-[14px] leading-[18px] font-[500] font-mulish text-[#222231] opacity-50 resize-none" placeholder="Текст отзыва"></textarea>
                    {commentErrorText != "" ? <span className={`text-[16px] leading-[16px] max750px:text-[14px] max750px:leading-[14px] font-[500] font-mulish text-[#FF5C35]`}>{commentErrorText}</span> : null}
                    <button onClick={addFeedback} className="h-[50px] w-[150px] max750px:w-[135px] max750px:h-[32px] flex justify-center items-center bg-[#FF6F0E] rounded-[4px] text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-mulish font-[600] text-[#FFFFFF]">Отправить</button>
                </div>

                <div className="w-full h-[2px] bg-[#E0E0E0]"></div>

                {/* Враппер комментариев */}
                <div className="flex flex-col gap-[12px] max750px:gap-[10px]">
                    {commentList.length > 0
                        ? commentList.reverse().map(comment => <CommentCell key={comment.feedback_id} username={comment.username} comment={comment.comment} />)
                        : <span className="text-[24px] leading-[24px] max750px:text-[18px] max750px:leading-[18px] self-center font-mulish font-[900] mb-[12px] text-[#313131]">Отзывы отсутствуют</span>}
                </div>
            </div>
        </div>
    );
}