"use client"

import React from "react"

interface LogoLoadingProps {
    size?: number;
    className?: string;
}

export function LogoLoading({ size = 100, className = "" }: LogoLoadingProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    viewBox="0 0 375 375"
                    className="w-full h-full animate-pulse"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <style>
                        {`
                        @keyframes partPulse {
                            0%, 100% { opacity: 0.4; transform: scale(0.9) rotate(-3deg); }
                            50% { opacity: 1; transform: scale(1.1) rotate(3deg); }
                        }
                        @keyframes float {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-15px); }
                        }
                        .animate-float { animation: float 3s ease-in-out infinite; }
                        .logo-part { transform-origin: center; animation: partPulse 2.5s ease-in-out infinite; }
                        .logo-part-1 { animation-delay: 0s; }
                        .logo-part-2 { animation-delay: 0.4s; }
                        .logo-part-3 { animation-delay: 0.8s; }
                        .logo-part-4 { animation-delay: 1.2s; }
                        `}
                    </style>
                    <g className="animate-float">
                        <path
                            className="logo-part logo-part-1"
                            fill="#4d1480"
                            d="M 195.8125 198.613281 L 206.828125 198.613281 L 206.828125 201 L 195.8125 201 Z M 195.8125 203.390625 L 206.828125 203.390625 L 206.828125 205.722656 L 195.8125 205.722656 Z"
                        />
                        <g className="logo-part logo-part-2">
                            <path
                                fill="#4d1480"
                                d="M 210.148438 161.59375 L 188.609375 161.59375 L 188.609375 186.285156 L 213.371094 186.285156 L 213.371094 164.800781 C 213.375 164.371094 213.292969 163.960938 213.128906 163.566406 C 212.96875 163.171875 212.734375 162.824219 212.429688 162.523438 C 212.128906 162.21875 211.777344 161.988281 211.382812 161.828125 C 210.988281 161.667969 210.574219 161.589844 210.148438 161.59375 Z M 208.132812 175.59375 L 194.503906 175.59375 L 194.503906 173.261719 L 208.132812 173.261719 Z"
                            />
                        </g>
                        <g className="logo-part logo-part-3">
                            <path
                                fill="#4d1480"
                                d="M 161.539062 164.800781 L 161.539062 186.28125 L 186.246094 186.28125 L 186.246094 161.585938 L 164.746094 161.585938 C 164.320312 161.585938 163.910156 161.664062 163.515625 161.828125 C 163.121094 161.988281 162.773438 162.222656 162.472656 162.523438 C 162.167969 162.824219 161.9375 163.171875 161.777344 163.566406 C 161.613281 163.960938 161.535156 164.375 161.539062 164.800781 Z M 166.765625 173.261719 L 172.355469 173.261719 L 172.355469 167.613281 L 174.757812 167.613281 L 174.757812 173.261719 L 180.339844 173.261719 L 180.339844 175.59375 L 174.757812 175.59375 L 174.757812 181.242188 L 172.367188 181.242188 L 172.367188 175.59375 L 166.765625 175.59375 Z"
                            />
                        </g>
                        <g className="logo-part logo-part-4">
                            <path
                                fill="#4d1480"
                                d="M 161.539062 210.199219 C 161.535156 210.628906 161.613281 211.039062 161.777344 211.433594 C 161.9375 211.828125 162.171875 212.175781 162.472656 212.476562 C 162.773438 212.777344 163.121094 213.011719 163.515625 213.171875 C 163.910156 213.335938 164.320312 213.414062 164.746094 213.414062 L 186.246094 213.414062 L 186.246094 188.679688 L 161.539062 188.679688 Z M 167.925781 198.199219 L 169.605469 196.515625 L 173.546875 200.515625 L 177.546875 196.515625 L 179.226562 198.199219 L 175.230469 202.195312 L 179.230469 206.136719 L 177.546875 207.816406 L 173.550781 203.875 L 169.609375 207.816406 L 167.929688 206.136719 L 171.867188 202.195312 Z"
                            />
                        </g>
                    </g>
                </svg>
            </div>
            <p className="text-primary font-bold tracking-widest text-sm animate-bounce opacity-70">
                <span className="text-muted-foreground/80">Carregando...</span>
            </p>
        </div>
    )
}
