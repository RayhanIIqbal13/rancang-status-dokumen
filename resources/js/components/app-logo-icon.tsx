import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#09090b" />
            <path
                d="M19 10v12a3 3 0 1 0 3-3H10a3 3 0 1 0 3 3V10a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
