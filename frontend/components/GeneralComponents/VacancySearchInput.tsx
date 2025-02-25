"use client"

import { useState } from "react";
import SearchLens from "@/svg/SearchLens";
import Link from "next/link";

export default function VacancySearchInput() {
    const [value, setValue] = useState("")

    return (
        <div className="flex">
            <input value={value} onChange={(e) => setValue(e.target.value)} className="w-[350px] max750px:w-[200px] h-[50px] max750px:h-[40px] pl-[25px] rounded-l-[50px] border-y-[1px] border-l-[1px] border-[#D9D9D9] outline-none text-[12px] leading-[12px] font-[400] font-mulish text-[#000000]" placeholder="Поиск"></input>
            <Link href={`/vacancy?search=${value}`} className="flex justify-center items-center w-[50px] h-[50px] max750px:w-[40px] max750px:h-[40px] bg-[#FFFFFF] rounded-r-[50px] border-y-[1px] border-r-[1px] border-[#D9D9D9]">
                <SearchLens className="w-[16px] h-[16px] max750px:w-[12px] max750px:h-[12px] fill-[#000000]" />
            </Link>
        </div>
    );
}