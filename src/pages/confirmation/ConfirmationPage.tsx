import "./confirmation.css";
import { useBooking } from "../../store/booking";

export default function ConfirmationPage({
  onGoStart,
  onGoBooking,
}: {
  onGoStart: () => void;
  onGoBooking: () => void;
}) {
  const { result, reset } = useBooking();

   if (!result) {
    return (
      <section className="conf-page conf-page--empty">
        <header className="conf-header">
          <div className="conf-logo">
            <img src="/logo.png" alt="Strajk" />
          </div>
          <h1 className="conf-title">SEE YOU SOON!</h1>
        </header>

        <div className="conf-content conf-content--empty">
          <p className="conf-empty-text">Ingen bokning ännu.</p>
          <button className="conf-btn conf-btn--primary conf-btn--wide" onClick={onGoBooking}>
            TILL BOOKING
          </button>
        </div>
      </section>
    );
  }

  const displayWhen = result.when.includes("T")
    ? result.when.replace("T", ", ")
    : result.when;

  return (
    <section className="conf-page conf-page--scroll">
      <header className="conf-header">
        <div className="conf-logo">
          <img src="/logo.png" alt="Strajk" />
        </div>
        <h1 className="conf-title">SEE YOU SOON!</h1>
      </header>

      <div className="conf-content">
        <div className="conf-section-head"><span>BOOKING DETAILS</span></div>

        <div className="conf-detail">
          <div className="conf-detail__label">WHEN</div>
          <div className="conf-detail__value">{displayWhen}</div>
        </div>

        <div className="conf-detail">
          <div className="conf-detail__label">WHO</div>
          <div className="conf-detail__value">{result.people} pers</div>
        </div>

        <div className="conf-detail">
          <div className="conf-detail__label">LANES</div>
          <div className="conf-detail__value">
            {result.lanes} lane{result.lanes > 1 ? "s" : ""}
          </div>
        </div>

        <div className="conf-detail">
          <div className="conf-detail__label">BOOKING NUMBER</div>
          <div className="conf-detail__value">{result.id}</div>
        </div>

        <div className="conf-total-card">
          <strong className="conf-total-card__label">total</strong>
          <strong className="conf-total-card__amount">{result.price}sek</strong>
        </div>

        <div className="conf-cta">
          <button
            className="conf-btn conf-btn--primary conf-btn--wide"
            onClick={() => { reset(); onGoStart(); }}
          >
            SWEET, LETS GO!
          </button>
        </div>
      </div>
    </section>
  );
}
