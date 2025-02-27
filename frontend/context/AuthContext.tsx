"use client"

import {
	createContext,
	useContext,
	useState,
	ReactNode,
} from "react";

// Типизация пользователя
interface User {
	user_id: number;
	username: string;
	role: string;
}

// Типизация контекста
interface AuthContextType {
	user: User | null;
	login: (username: string, password: string) => Promise<string>;
    register: (username: string, password: string, repeated: string, role: string) => Promise<string>;
	logout: () => Promise<void>;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | null>(null);

// Хук для использования контекста
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Провайдер для авторизации
export function AuthProvider({ children, serverUser  }: { children: ReactNode, serverUser: User | null }) {
	const [user, setUser] = useState<User | null>(serverUser);

	// Функция входа
	const login = async (username: string, password: string) => {
		const form = {
			username: username,
			password: password,
		};

		try {
			const response = await fetch("/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});
			const response_data = await response.json();

			if (response_data.status != 200) {
				return response_data.payload;
			} else {
				setUser(response_data.payload)
				window.location.reload();
                return "Success"
			}
		} catch (error) {
			console.error("Ошибка входа:", error);
            return "Ошибка входа"
		}
	};

    // Функция регистрации
	const register = async (username: string, password: string, repeated: string, role: string) => {
        const form = {
            username: username,
            password: password,
            repeated: repeated,
            role: role
        }

		try {
			const response = await fetch("/auth/register", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(form)
			});
			const response_data = await response.json();

			if (response_data.status != 200) {
				return response_data.payload;
			} else {
				setUser(response_data.payload)
                return "Success"
			}
		} catch (error) {
			console.error("Ошибка регистрации:", error);
            return "Ошибка регистрации"
		}
	};

	// Функция выхода
	const logout = async () => {
		try {
			const response = await fetch("/auth/logout", {
				method: "POST",
			});
            const response_data = await response.json()

			if (response_data.status == 200) {
				setUser(null)
				window.location.reload();
			}
		} catch (error) {
			console.error("Ошибка выхода:", error);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
