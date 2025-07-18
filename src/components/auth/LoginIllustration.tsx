import Image from "next/image";
import React from "react";
import Saly from "@/../public/illustrations/Saly-10.png";
import { APP_NAME } from "@/config/config";
import Logo from "@/../public/logo.jpeg";

const LoginIllustration: React.FC = () => {
    return (
        <div className="flex relative flex-col items-center justify-start h-full bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 rounded-2xl p-8">
            <div className="mb-8">
                <div className="flex items-center space-x-2">
                    <Image src={Logo} alt="Logo" width={40} height={40} className="rounded-full" />
                    <span className="text-xl font-bold text-black">{APP_NAME}</span>
                </div>
            </div>

            {/* Ilustração do personagem */}
            <div className="absolute bottom-0  w-full h-1/2 mb-4">
                <Image
                    src={Saly}
                    alt="Ilustração do personagem"
                    layout="fill"
                    objectFit="contain"
                />
            </div>
        </div>
    );
};

export default LoginIllustration;
