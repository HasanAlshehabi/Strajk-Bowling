import "./menu.css";
import { useEffect, useRef, useState } from "react";
import { useBooking } from "../../store/booking";

export default function Menu({ onNavigate }: { onNavigate: (i:number)=>void }) {
  const [open, setOpen] = useState(false);
  const setStep = useBooking(s => s.setStep);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.classList.add("menu-open"); // lock scroll
      // focus first item after mount
      requestAnimationFrame(() => firstItemRef.current?.focus());
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  const goto = (i: number) => {
    setOpen(false);
    setStep(i as 0|1|2);
    onNavigate(i);
  };

  return (
    <>
      <button
        className={`navicon ${open ? "navicon--active" : ""}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Open menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="app-menu"
      >
        <span className="navicon__bar" />
        <span className="navicon__bar" />
        <span className="navicon__bar" />
      </button>

      {open && (
        <div
          className="menu-overlay"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            id="app-menu"
            role="menu"
            aria-label="Main menu"
            className="menu-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="menu-panel__header">
              <img className="menu-panel__logo" src="/logo.png" alt="" />
              <strong className="menu-panel__title">STRAJK</strong>
            </div>

            <div className="menu-panel__list">
              <button
                ref={firstItemRef}
                role="menuitem"
                className="menu-item"
                onClick={() => goto(1)}
              >
          
                <span className="menu-item__text">Booking</span>
              </button>

              <button
                role="menuitem"
                className="menu-item"
                onClick={() => goto(2)}
              >
              
                <span className="menu-item__text">Confirmation</span>
              </button>
            </div>

            <div className="menu-panel__footer">
              <button
                className="menu-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
