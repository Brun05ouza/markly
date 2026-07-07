"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./utils";
import { Sparkles } from "lucide-react";

function usePrevious<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export interface DisplayCardProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  titleClassName?: string;
}

const SLOTS = [
  { base: { x: 0, y: 0 }, active: { x: 0, y: -108 } },
  { base: { x: 56, y: 44 }, active: { x: 56, y: -52 } },
  { base: { x: 112, y: 88 }, active: { x: 112, y: -8 } },
];

const EASE_DOWN = "cubic-bezier(0.4, 0, 0.2, 1)";
const EASE_UP = "cubic-bezier(0.22, 1, 0.36, 1)";

function DisplayCard({
  card,
  slot,
  index,
  activeIndex,
  frontIndex,
  prevActiveIndex,
  onMouseEnter,
}: {
  card: DisplayCardProps;
  slot: (typeof SLOTS)[number];
  index: number;
  activeIndex: number;
  frontIndex: number;
  prevActiveIndex: number;
  onMouseEnter?: () => void;
}) {
  const isActive = index === activeIndex;
  const justRose = isActive && prevActiveIndex !== index;
  const justFell = !isActive && prevActiveIndex === index;
  const {
    icon = <Sparkles className="size-4 text-[#D8D0BF]" />,
    title = "Destaque",
    description = "Conteúdo em destaque",
    date = "Agora",
    titleClassName = "text-[#D8D0BF]",
  } = card;

  const pos = isActive ? slot.active : slot.base;
  const moveMs = justRose ? 1050 : justFell ? 700 : 850;
  const moveEase = justRose ? EASE_UP : EASE_DOWN;
  const isFront = index === frontIndex;

  return (
    <div
      className={cn(
        "relative flex h-44 w-[26rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border px-5 py-4 backdrop-blur-sm [grid-area:stack] will-change-transform",
        "after:absolute after:-right-1 after:top-[-5%] after:z-0 after:h-[110%] after:w-[18rem] after:bg-gradient-to-l after:from-[#020605] after:to-transparent after:content-['']",
        isActive ? "after:opacity-0" : "after:opacity-50",
      )}
      onMouseEnter={onMouseEnter}
      style={{
        zIndex: isActive ? (isFront ? 30 : 12 + index) : 10 + index,
        transform: `translate(${pos.x}px, ${pos.y}px) skewY(-8deg)`,
        background: isActive ? "#0B1D18" : "rgba(8,23,19,0.92)",
        borderColor: isActive ? "rgba(240,237,228,0.28)" : "rgba(240,237,228,0.12)",
        boxShadow: isActive ? "0 18px 60px rgba(0,0,0,0.45), 0 0 30px rgba(0,71,65,0.25)" : "none",
        filter: isActive ? "none" : "grayscale(70%) brightness(0.88)",
        transition: [
          `transform ${moveMs}ms ${moveEase}`,
          `background-color ${moveMs}ms ${moveEase}`,
          `border-color ${moveMs}ms ${moveEase}`,
          `box-shadow ${moveMs}ms ${moveEase}`,
          `filter ${moveMs}ms ${moveEase}`,
        ].join(", "),
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] rounded-xl"
        style={{
          background: "rgba(2,6,5,0.35)",
          opacity: isActive ? 0 : 1,
          transition: `opacity ${moveMs}ms ${moveEase}`,
        }}
      />
      <div className="relative z-10 flex flex-col gap-2.5">
        <span className="inline-flex w-fit items-center justify-center rounded-full border border-[rgba(240,237,228,0.22)] bg-[rgba(0,71,65,0.32)] p-2">
          {icon}
        </span>
        <p className={cn("text-lg font-semibold", titleClassName)} style={{ color: isActive ? "#D8D0BF" : "#F0EDE4" }}>
          {title}
        </p>
      </div>
      <p
        className="relative z-10 whitespace-nowrap text-base font-medium"
        style={{ color: isActive ? "#F0EDE4" : "rgba(240,237,228,0.82)" }}
      >
        {description}
      </p>
      <p className="relative z-10 text-sm" style={{ color: isActive ? "#A9A69C" : "rgba(240,237,228,0.55)" }}>
        {date}
      </p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
  interval?: number;
}

export default function DisplayCards({ cards = [], interval = 2800 }: DisplayCardsProps) {
  const [active, setActive] = useState(0);
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const prevActive = usePrevious(active);
  const count = Math.min(cards.length, SLOTS.length);

  useEffect(() => {
    const id = window.setTimeout(() => setFront(active), 220);
    return () => window.clearTimeout(id);
  }, [active]);

  useEffect(() => {
    if (paused || interval <= 0 || count < 2) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [paused, interval, count]);

  return (
    <div
      className="relative isolate grid min-h-[320px] [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {cards.slice(0, SLOTS.length).map((card, index) => (
        <DisplayCard
          key={index}
          index={index}
          activeIndex={active}
          frontIndex={front}
          prevActiveIndex={prevActive}
          card={card}
          slot={SLOTS[index]}
          onMouseEnter={() => {
            setActive(index);
            setFront(index);
          }}
        />
      ))}
    </div>
  );
}
