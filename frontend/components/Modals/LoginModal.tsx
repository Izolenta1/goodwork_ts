import { useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import styles from "@/styles/Header/Modals.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface LoginModalProps {
	activeModal: string;
	setActiveModal: React.Dispatch<React.SetStateAction<string>>
}

export default function LoginModal({ activeModal, setActiveModal }: LoginModalProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [loginError, setLoginError] = useState("");
	const { login } = useAuth();

	// Хук для получения путя и редиректа
	const router = useRouter();
	const pathname = usePathname()

	async function sendLoginForm() {
		const login_result = await login(username, password);
		if (login_result != "Success") {
			setLoginError(login_result);
		}
		else {
			setUsername("")
			setPassword("")
			setLoginError("")
			setActiveModal("")

			if (pathname.includes("verify") || pathname.includes("recovery")) {
				router.push('/');
			}
			else {
				location.reload()
			}
		}
	}

	const modalRef = useClickOutside(() => {
		if (activeModal == "Login") {
			setUsername("")
			setPassword("")
			setLoginError("")
			setActiveModal("")
		}
	}, "mousedown");

	return (
		// Темный фон
		<div className={`fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-[10] bg-[#000000D9] ${activeModal == "Login" ? styles.active : styles.disabled}`}>
			{/* Модальное окно */}
			<div ref={modalRef} className="w-[630px] max920px:w-[340px] flex flex-col gap-[20px] max920px:gap-[16px] bg-[#FFFFFF] p-[20px] ">
				{/* Заголовок */}
				<div className="flex flex-row justify-between items-center">
					{/* Текст */}
					<div className="flex flex-col gap-[8px]">
						<span className="text-[40px] leading-[40px] max920px:text-[18px] max920px:leading-[18px] font-mulish font-[900] text-[#313131]">
							Авторизация
						</span>
						<div className="w-[140px] h-[6px] max920px:h-[3px] bg-[#FF6F0E]"></div>
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
						<span className="text-[20px] leading-[20px] max920px:text-[16px] max920px:leading-[16px] font-[500] font-mulish text-[#000000]">
							Логин <span className="text-[#FF5C35]">*</span>
						</span>
						<input value={username} onChange={(e) => setUsername(e.target.value)} className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Ваш логин"></input>
					</div>

					{/* Поле пароля */}
					<div className="flex flex-col w-[320px] max920px:w-full gap-[8px]">
						<span className="text-[20px] leading-[20px] max920px:text-[16px] max920px:leading-[16px] font-[500] font-mulish text-[#000000]">
							Пароль <span className="text-[#FF5C35]">*</span>
						</span>
						<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="relative w-full h-[30px] rounded-[8px] outline-none pl-[12px] bg-[#dddddd] text-[14px] leading-[14px] font-[500] font-mulish text-[#222231] opacity-50" placeholder="Ваш пароль"></input>
					</div>

					{/* Текст ошибки */}
					{loginError != "" ? <span className="text-[16px] leading-[16px] font-[500] font-mulish text-[#FF5C35]">{loginError}</span> : null}
				</div>

				<span className="text-[16px] leading-[16px] max920px:text-[14px] max920px:leading-[14px] font-[400] font-mulish text-[#000000] select-none">
					Нет аккаунта?{" "}
					<button onClick={() => setActiveModal("Register")} className="text-[#FF6F0E]">
						Зарегистрироваться
					</button>
				</span>
				<span className="text-[16px] leading-[16px] max920px:text-[14px] max920px:leading-[14px] font-[400] font-mulish text-[#000000] select-none">
					Забыли пароль?{" "}
					<button onClick={() => setActiveModal("Recovery")} className="text-[#FF6F0E]">
						Восстановить
					</button>
				</span>

				<button onClick={() => sendLoginForm()} className="w-[195px] h-[45px] max920px:w-[135px] max920px:h-[32px] bg-[#FF6F0E] rounded-[6px] flex justify-center items-center text-[18px] leading-[18px] max920px:text-[12px] max920px:leading-[12px] font-[700] font-mulish text-[#FFFFFF]">
					Войти
				</button>
			</div>
		</div>
	);
}
