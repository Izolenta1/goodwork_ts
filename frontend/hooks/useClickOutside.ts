"use client"

import { useEffect, useRef } from "react";

export default function useClickOutside(callback: () => void, type: "mouseup" | "mousedown") {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener(type, handleClickOutside);

		return () => {
			document.removeEventListener(type, handleClickOutside);
		};
	}, [callback]);

	return ref;
};
