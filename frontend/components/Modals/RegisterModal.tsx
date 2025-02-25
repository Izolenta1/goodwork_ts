import { useState } from "react"
import useClickOutside from "@/hooks/useClickOutside"
import styles from "@/styles/Header/Modals.module.css"
import { useAuth } from "@/context/AuthContext";

interface RegisterModalProps {
	activeModal: string;
	setActiveModal: React.Dispatch<React.SetStateAction<string>>
}

export default function RegisterModal({ activeModal, setActiveModal }: RegisterModalProps) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [repeated, setRepeated] = useState("")
    const [role, setRole] = useState("")

    const { register } = useAuth();

    const [regError, setRegError] = useState("")
    const [infoText, setInfoText] = useState("")

    async function sendRegForm() {
		const reg_result = await register(username, password, repeated, role);
        if (reg_result != "Success") {
			setRegError(reg_result);
		}
		else {
			setUsername("")
			setPassword("")
            setRepeated("")
            setRole("")
            setRegError("")
            setInfoText("Регистрация прошла успешно. Можете войти в аккаунт")
		}
    }

    const modalRef = useClickOutside(() => {
        if (activeModal == "Register") {
            setUsername("")
			setPassword("")
            setRepeated("")
            setRole("")
            setRegError("")
            setInfoText("")
            setActiveModal("")
        }
    }, "mousedown");

    return (
        // Темный фон
        <div className={`fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-[10] bg-[#000000D9] ${activeModal == "Register" ? styles.active : styles.disabled}`}>

            {/* Модальное окно */}
            <div ref={modalRef} className="w-[630px] max920px:w-[340px] flex flex-col gap-[20px] max920px:gap-[16px] bg-[#FFFFFF] p-[20px] ">

                {/* Заголовок */}
                <div className="flex flex-row justify-between items-center">

                    {/* Текст */}
                    <div className='flex flex-col gap-[8px]'>
                        <span className='text-[40px] leading-[40px] max920px:text-[18px] max920px:leading-[18px] font-mulish font-[900] text-[#313131]'>Регистрация</span>
                        <div className='w-[140px] h-[6px] max920px:h-[3px] bg-[#FF6F0E]'></div>
                    </div>

                    {/* Кнопка закрытия окна */}
                    <button onClick={() => setActiveModal("")} className="w-[42px] h-[42px] max920px:w-[32px] max920px:h-[32px] bg-[#FF6F0E] rounded-[4px] flex justify-center items-center">
                        <span className="text-[16px] leading-[16px] max920px:text-[12px] max920px:leading-[12px] font-[700] text-[#FFFFFF]">X</span>
                    </button>
                </div>

                {/* Враппер инпутов */}
                <div className="flex flex-col gap-[10px] p-[10px] max920px:p-[0]">

                    {/* Поле логина */}
                    <div className="flex flex-col w-[320px] max920px:w-full gap-[8px]">
                        <span className="text-[20px] leading-[20px] max920px:text-[16px] max920px:leading-[16px] font-[500] font-mulish text-[#000000]">Логин <span className="text-[#FF5C35]">*</span></span>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Ваш логин"></input>
                    </div>

                    {/* Поле пароля */}
                    <div className="flex flex-col w-[320px] max920px:w-full gap-[8px]">
                        <span className="text-[20px] leading-[20px] max920px:text-[16px] max920px:leading-[16px] font-[500] font-mulish text-[#000000]">Пароль <span className="text-[#FF5C35]">*</span></span>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Ваш пароль"></input>
                    </div>

                    {/* Поле повторение пароля */}
                    <div className="flex flex-col w-[320px] max920px:w-full gap-[8px]">
                        <span className="text-[20px] leading-[20px] max920px:text-[16px] max920px:leading-[16px] font-[500] font-mulish text-[#000000]">Повторите пароль <span className="text-[#FF5C35]">*</span></span>
                        <input value={repeated} onChange={(e) => setRepeated(e.target.value)} type="password" className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Повторите пароль"></input>
                    </div>

                    <input onChange={() => setRole("employee")} type="radio" id="employee" className={styles.orangeCheckbox} name="who"></input>
                    <label htmlFor="employee" className="text-[16px] leading-[16px] max920px:text-[14px] max920px:leading-[14px] font-[400] font-mulish text-[#000000] select-none hover:cursor-pointer">Я соискатель</label>

                    <input onChange={() => setRole("employer")} type="radio" id="employer" className={styles.orangeCheckbox} name="who"></input>
                    <label htmlFor="employer" className="text-[16px] leading-[16px] max920px:text-[14px] max920px:leading-[14px] font-[400] font-mulish text-[#000000] select-none hover:cursor-pointer">Я работодатель</label>

                    {/* Текст ошибки */}
                    {regError != "" ? <span className="text-[16px] leading-[16px] font-[500] font-mulish text-[#FF5C35]">{regError}</span> : null}

                    {/* Текст информации */}
                    {infoText != "" ? <span className="text-[16px] leading-[16px] font-[500] font-mulish text-[#48be43]">{infoText}</span> : null}
                </div>

                <span className="text-[16px] leading-[16px] max920px:text-[14px] max920px:leading-[14px] font-[400] font-mulish text-[#000000] select-none">Есть аккаунт? <button onClick={() => setActiveModal("Login")} className="text-[#FF6F0E]">Войти</button></span>

                <button onClick={() => sendRegForm()} className="w-[195px] h-[45px] max920px:w-[135px] max920px:h-[32px] bg-[#FF6F0E] rounded-[6px] flex justify-center items-center text-[18px] leading-[18px] max920px:text-[12px] max920px:leading-[12px] font-[700] font-mulish text-[#FFFFFF]">Зарегистрироваться</button>
            </div>
        </div>
    )
}