'use client'

import { useState } from "react"

interface RecoveryWrapperProps {
    recovery_id: string
}

interface ChangePasswordResponse {
    status: number,
    payload: string
}

export default function RecoveryWrapper({ recovery_id }: RecoveryWrapperProps) {
    const [errorText, setErrorText] = useState("")
    const [infoText, setInfoText] = useState("")

    // Хуки инпутов
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")

    // Функция, посылающая запрос на изменение пароля
    async function changePassword() {
        // Очистка ошибок при повторной попытке
        setErrorText("")
        setInfoText("")

        // Данные для отправки
        const recoveryData = {
            "recovery_id": recovery_id,
            "password": password,
            "repeated": passwordRepeat
        }

        // Выполнение запроса
        const response = await fetch(`/auth/recovery/changePassword`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(recoveryData),
            cache: 'no-store',
        })
        const response_data: ChangePasswordResponse = await response.json()

        // Обработка результата изменения пароля
        if (response_data.status === 200) {
            process_change_success();
        } else {
            process_change_error(response_data);
        }
    }

    // Функция обработки ошибки восстановления
    async function process_change_error(response: ChangePasswordResponse) {
        const error_text = response.payload
        setErrorText(error_text)
    }

    // Вывод информации об отправке письма
    async function process_change_success() {
        setInfoText("Пароль успешно изменен")
    }

    return (
        <div className="w-[1140px] max1200px:w-[95%] h-fit flex flex-col items-center gap-[32px] max750px:gap-[16px]">
            {/* Враппер под 1140 пикселей */}

            {/* Заголовок */}
            <div className="flex flex-col mt-[16px] gap-[8px]">
                <span className="text-[40px] leading-[40px] max920px:text-[18px] max920px:leading-[18px] font-mulish font-[900] text-[#313131]">Изменение пароля</span>
                <div className="w-[140px] h-[6px] max920px:h-[3px] bg-[#FF6F0E]"></div>
            </div>

            {infoText != "Пароль успешно изменен" ?
                <div className="flex flex-col gap-[10px] p-[10px] max920px:p-[0]">
                    {/* Враппер инпутов */}

                    {/* Поле пароля */}
                    <div className="flex flex-col w-[320px] max920px:w-full gap-[8px]">
                        <span className="text-[20px] leading-[20px] max920px:text-[16px] max920px:leading-[16px] font-[500] font-mulish text-[#000000]">Пароль <span className="text-[#FF5C35]">*</span></span>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Ваш пароль"></input>
                    </div>

                    {/* Поле повторение пароля */}
                    <div className="flex flex-col w-[320px] max920px:w-full gap-[8px]">
                        <span className="text-[20px] leading-[20px] max920px:text-[16px] max920px:leading-[16px] font-[500] font-mulish text-[#000000]">Повторите пароль <span className="text-[#FF5C35]">*</span></span>
                        <input value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} type="password" className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Повторите пароль"></input>
                    </div>
                </div>
            : null}
            {errorText.length > 0 ? <span className="text-[16px] leading-[16px] font-[500] font-mulish text-[#FF5C35]">{errorText}</span> : ""}
            {infoText.length > 0 ? <span className="text-[16px] leading-[16px] font-[500] font-mulish text-[#48be43]">{infoText}</span> : ""}
            {infoText != "Пароль успешно изменен" ?
                <button onClick={changePassword} className="flex justify-center items-center bg-[#FF6F0E] rounded-[6px] w-[200px] h-[50px] max920px:w-[130px] max920px:h-[40px] text-[16px] leading-[16px] font-[700] font-mulish text-[#FFFFFF]">Изменить</button>
            : null}
        </div>
    )
}