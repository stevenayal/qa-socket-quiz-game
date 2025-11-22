import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
    initialSeconds: number;
    onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds, onComplete }) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (seconds <= 0) {
            onComplete?.();
            return;
        }

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds, onComplete]);

    return (
        <div className="text-4xl font-bold font-mono text-yellow-400">
            {seconds}s
        </div>
    );
};
