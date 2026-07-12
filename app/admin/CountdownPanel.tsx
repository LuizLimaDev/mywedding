"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  targetIsoDate: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function calculateTimeLeft(targetIsoDate: string): TimeLeft {
  const target = new Date(targetIsoDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, done: false };
}

export default function CountdownPanel({ targetIsoDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetIsoDate));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetIsoDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetIsoDate]);

  const text = useMemo(() => {
    if (timeLeft.done) {
      return "Evento iniciado";
    }

    const dd = String(timeLeft.days).padStart(2, "0");
    const hh = String(timeLeft.hours).padStart(2, "0");
    const mm = String(timeLeft.minutes).padStart(2, "0");
    const ss = String(timeLeft.seconds).padStart(2, "0");

    return `${dd}d ${hh}h ${mm}m ${ss}s`;
  }, [timeLeft]);

  return <p className="text-xl font-bold tracking-wide text-red-800">{text}</p>;
}
