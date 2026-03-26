"use client";

import { useEffect, useRef, useState } from "react";

type IntroGateProps = {
    children: React.ReactNode;
};

export default function IntroGate({ children }: IntroGateProps) {
    const [showIntro, setShowIntro] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const alreadyPlayed = sessionStorage.getItem("introPlayed");

        if (alreadyPlayed === "true") {
            setShowIntro(false);
        }
    }, []);

    const handleVideoEnd = () => {
        sessionStorage.setItem("introPlayed", "true");
        setShowIntro(false);
    };

    if (showIntro) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                >
                    <source src="/intro.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    return <>{children}</>;
}