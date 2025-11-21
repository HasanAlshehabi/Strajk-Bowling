import "./dotpager.css";

export default function DotPager({
  current, total, onGo,
}: { current: number; total: number; onGo: (index: number) => void }) {
  return (
    <nav className="dots" aria-label="Stegnavigering">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        return (
          <button
            key={i}
            className={`dot ${isActive ? "dot--active" : ""}`}
            aria-label={`Gå till steg ${i + 1}`}
            aria-current={isActive ? "step" : undefined}
            onClick={() => onGo(i)}
          />
        );
      })}
    </nav>
  );
}
