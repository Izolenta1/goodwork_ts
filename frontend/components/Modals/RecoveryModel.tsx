import { useState } from "react"
import useClickOutside from "@/hooks/useClickOutside"
import styles from "@/styles/Header/Modals.module.css"
import { useAuth } from "@/context/AuthContext";

interface RecoveryModalProps {
	activeModal: string;
	setActiveModal: React.Dispatch<React.SetStateAction<string>>
}

export default function RecoveryModal({ activeModal, setActiveModal }: RecoveryModalProps) {
    const [email, setEmail] = useState("")

    const { recovery } = useAuth();

    const [recError, setRecError] = useState("")
    const [infoText, setInfoText] = useState("")

    async function sendRecForm() {
		const reg_result = await recovery(email);
        if (reg_result != "Success") {
			setRecError(reg_result);
		}
		else {
            setEmail("")
            setRecError("")
            setInfoText("Письмо для восстановления отправлено на почту.")
		}
    }

    const modalRef = useClickOutside(() => {
        if (activeModal == "Recovery") {
            setEmail("")
            setRecError("")
            setInfoText("")
            setActiveModal("")
        }
    }, "mousedown");

    return (
        // Темный фон
        <div className={`fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-[10] bg-[#000000D9] ${activeModal == "Recovery" ? styles.active : styles.disabled}`}>

            {/* Модальное окно */}
            <div ref={modalRef} className="w-[630px] max920px:w-[340px] flex flex-col gap-[20px] max920px:gap-[16px] bg-[#FFFFFF] p-[20px] ">

                {/* Заголовок */}
                <div className="flex flex-row justify-between items-center">

                    {/* Текст */}
                    <div className='flex flex-col gap-[8px]'>
                        <span className='text-[40px] leading-[40px] max920px:text-[18px] max920px:leading-[18px] font-mulish font-[900] text-[#313131]'>Восстановление</span>
                        <div className='w-[140px] h-[6px] max920px:h-[3px] bg-[#FF6F0E]'></div>
                    </div>

                    {/* Кнопка закрытия окна */}
                    <button onClick={() => setActiveModal("")} className="w-[42px] h-[42px] max920px:w-[32px] max920px:h-[32px] bg-[#FF6F0E] rounded-[4px] flex justify-center items-center">
                        <span className="text-[16px] leading-[16px] max920px:text-[12px] max920px:leading-[12px] font-[700] text-[#FFFFFF]">X</span>
                    </button>
                </div>

                {/* Враппер инпутов */}
                <div className="flex flex-col gap-[10px] p-[10px] max920px:p-[0]">

                    {/* Поле почты */}
                    <div className="flex flex-col w-[320px] max920px:w-full gap-[8px]">
                        <span className="text-[20px] leading-[20px] max920px:text-[16px] max920px:leading-[16px] font-[500] font-mulish text-[#000000]">Почта <span className="text-[#FF5C35]">*</span></span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Ваша почта"></input>
                    </div>

                    {/* Текст ошибки */}
                    {recError != "" ? <span className="text-[16px] leading-[16px] font-[500] font-mulish text-[#FF5C35]">{recError}</span> : null}

                    {/* Текст информации */}
                    {infoText != "" ? <span className="text-[16px] leading-[16px] font-[500] font-mulish text-[#48be43]">{infoText}</span> : null}
                </div>

                <span className="text-[16px] leading-[16px] max920px:text-[14px] max920px:leading-[14px] font-[400] font-mulish text-[#000000] select-none">Помните пароль? <button onClick={() => setActiveModal("Login")} className="text-[#FF6F0E]">Войти</button></span>

                <button onClick={() => sendRecForm()} className="w-[195px] h-[45px] max920px:w-[135px] max920px:h-[32px] bg-[#FF6F0E] rounded-[6px] flex justify-center items-center text-[18px] leading-[18px] max920px:text-[12px] max920px:leading-[12px] font-[700] font-mulish text-[#FFFFFF]">Восстановить</button>
            </div>
        </div>
    )
}