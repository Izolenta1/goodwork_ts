interface ArrowProps {
	svg_className?: string;
	path_className?: string;
}

export default function Arrow({svg_className, path_className}: ArrowProps) {
    return (
        <svg viewBox="0 0 15 15" fill="none" className={svg_className} xmlns="http://www.w3.org/2000/svg">
            <path d="M10.3125 7.5C10.3125 7.38012 10.2667 7.26012 10.1752 7.16859L5.48769 2.48109C5.30452 2.29793 5.00792 2.29793 4.82487 2.48109C4.64183 2.66426 4.64171 2.96086 4.82487 3.1439L9.18097 7.5L4.82487 11.8561C4.64171 12.0393 4.64171 12.3359 4.82487 12.5189C5.00804 12.702 5.30464 12.7021 5.48769 12.5189L10.1752 7.8314C10.2667 7.73988 10.3125 7.61988 10.3125 7.5Z" className={path_className}/>
        </svg>
    )
}