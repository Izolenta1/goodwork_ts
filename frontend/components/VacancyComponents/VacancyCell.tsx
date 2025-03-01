import Image from "next/image";
import Link from "next/link";

interface VacancyCellProps {
    vacancy_id: number,
    title: string,
    salary: number,
    exp: number,
    description: string,
    url?: string,
    type?: string,
    currency?: string,
}

export default function VacancyCell({ vacancy_id, title, salary, exp, description, url, type, currency }: VacancyCellProps) {
    if (type == "HHRU") {
        return (
            <div className="flex gap-[12px] w-full p-[12px] border-l-[6px] max750px:border-l-[3px] border-l-[#D6001C] rounded-[6px] max750px:rounded-[3px] hover:bg-[#ffdadf] transition ease-in-out duration-300">
                <div className="flex flex-col gap-[12px] max750px:gap-[6px]">
                    <div className="flex items-center gap-[8px] max750px:gap-[4px]">
                        <Image src={`/vacancy_icons/hhru.png`} alt={"hhru_icon"} width={256} height={256} className="w-[32px] h-[32px] max750px:w-[20px] max750px:h-[20px]" />
                        <div className="table table-fixed break-words w-fit">
                            <Link href={url!} target="_blank" className='text-[32px] max750px:text-[20px] font-mulish font-[900] text-[#313131] line-clamp-1'>{title}</Link>
                        </div>
                    </div>

                    <span className="text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[700] text-[#313131]">{salary} {getCurrencyIcon(currency!)}</span>
                    <span className="text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[700] text-[#313131]">Необходимо лет опыта: {exp == 0 ? "Без опыта" : exp}</span>
                    <div className="table table-fixed break-words w-fit">
                        <span className="text-[16px] leading-[20px] max750px:text-[12px] max750px:leading-[14px] font-mulish font-[400] text-[#313131] line-clamp-[5]">{description}</span>
                    </div>
    
                    <Link href={url!} className="h-[50px] w-[150px] max750px:w-[135px] max750px:h-[32px] flex justify-center items-center bg-[#D6001C] rounded-[4px] text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-mulish font-[600] text-[#FFFFFF]">Подробнее</Link>
                </div>
            </div>
        ); 
    }

    return (
        <div className="flex gap-[12px] w-full p-[12px] border-l-[6px] max750px:border-l-[3px] border-l-[#FF6F0E] rounded-[6px] max750px:rounded-[3px] hover:bg-[#ffebde] transition ease-in-out duration-300">
            <div className="flex flex-col gap-[12px] max750px:gap-[6px]">
                <div className="flex items-center gap-[8px] max750px:gap-[4px]">
                    <Image src={`/vacancy_icons/gw.png`} alt={"gw_icon"} width={256} height={256} className="w-[32px] h-[32px] max750px:w-[20px] max750px:h-[20px]" />
                    <div className="table table-fixed break-words w-fit">
                        <Link href={`/vacancy/${vacancy_id}`} target="_blank" className='text-[32px] max750px:text-[20px] font-mulish font-[900] text-[#313131] line-clamp-1'>{title}</Link>
                    </div>
                </div>

                <span className="text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[700] text-[#313131]">{salary} ₽</span>
                <span className="text-[24px] leading-[24px] max750px:text-[16px] max750px:leading-[16px] font-mulish font-[700] text-[#313131]">Необходимо лет опыта: {exp == 0 ? "Без опыта" : exp}</span>
                <div className="table table-fixed break-words w-fit">
                    <span className="text-[16px] leading-[20px] max750px:text-[12px] max750px:leading-[14px] font-mulish font-[400] text-[#313131] line-clamp-[5]">{description}</span>
                </div>

                <Link href={`/vacancy/${vacancy_id}`} className="h-[50px] w-[150px] max750px:w-[135px] max750px:h-[32px] flex justify-center items-center bg-[#FF6F0E] rounded-[4px] text-[16px] leading-[16px] max750px:text-[12px] max750px:leading-[12px] font-mulish font-[600] text-[#FFFFFF]">Подробнее</Link>
            </div>
        </div>
    );
}




function getCurrencyIcon(currency: string): string {
    switch (currency) {
        case "RUR":
            return "₽"
        case "USD":
            return "$"
        case "EUR":
            return "€"
        case "AZN":
            return "₼"
        case "BYR":
            return "Br"
        case "GEL":
            return "₾"
        case "KGS":
            return "Сом"
        case "KZT":
            return "₸"
        case "UAH":
            return "₴"
        case "UZS":
            return "So’m"
        default:
            return "unknown"
    }
}