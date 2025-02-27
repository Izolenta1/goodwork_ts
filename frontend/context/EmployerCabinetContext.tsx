"use client"

import {
	createContext,
	useContext,
	useState,
	ReactNode,
} from "react";

// Типизация вакансии
interface Vacancy {
	vacancy_id: number,
    title: string,
    salary: number,
    experience: number,
    description: string,
    user_id: number
}

// Типизация контекста
interface EmployerCabinetContextType {
	vacancies: Vacancy[],
    setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>
}

// Создаем контекст
const EmployerCabinetContext = createContext<EmployerCabinetContextType | null>(null);

// Хук для использования контекста
export function useEmployerCabinet() {
    const context = useContext(EmployerCabinetContext);
    if (!context) {
        throw new Error("useEmployerCabinet must be used within an EmployerCabinetProvider");
    }
    return context;
}

// Провайдер для авторизации
export function EmployerCabinetProvider({ children  }: { children: ReactNode }) {
    const [vacancies, setVacancies] = useState<Vacancy[]>([])

    return (
        <EmployerCabinetContext.Provider value={{ vacancies, setVacancies }}>
            {children}
        </EmployerCabinetContext.Provider>
    );
}
