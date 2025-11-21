import "./start.css";
import { useBooking } from "../../store/booking";

export default function StartPage({ onNext }: { onNext: () => void }) {
  const setStep = useBooking(s => s.setStep);

  return (
    <section className="page--start">
      <header className="page__header">
        <div className="start__logo"><img src="/logo.png" alt="fireball" /></div>
        <h1 className="page__title">STRAJK</h1>
      </header>

      <div className="page__content page-start__content">
        <button
          className="btn primary page-start__cta"
          onClick={() => { setStep(1); onNext(); }}
        >
          BOOKING
        </button>
      </div>
    </section>
  );
}
