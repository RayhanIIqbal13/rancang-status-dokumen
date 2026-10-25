import React from 'react';

export default function AppLogoIcon({ className = 'h-8 w-auto', ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`inline-flex items-center justify-center shrink-0 ${className}`} {...props}>
            <img
                src="/images/logofsti.png"
                alt="FSTI ITK"
                className="max-h-full max-w-full object-contain"
            />
        </div>
    );
}
