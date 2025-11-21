import "./booking.css";
import ShoeRow from "../../components/ShoeRow";
import { useBooking } from "../../store/booking";
import { useEffect, useState } from "react";

export default function BookingPage({ onConfirm }: { onConfirm: () => void }) {
  const {
    date, time, lanes, people, shoes, submitting, error,
    setDate, setTime, setLanes, setPeople, setShoeAt, addShoe, removeShoe,
    isShoeCountValid, isCapacityValid, submit
  } = useBooking();

  // Local string states for editable numeric inputs
  const [peopleStr, setPeopleStr] = useState(String(people));
  const [lanesStr,  setLanesStr]  = useState(String(lanes));

  useEffect(() => {
    const id = setTimeout(() => setPeopleStr(String(people)), 0);
    return () => clearTimeout(id);
  }, [people]);

  useEffect(() => {
    const id = setTimeout(() => setLanesStr(String(lanes)), 0);
    return () => clearTimeout(id);
  }, [lanes]);

  const onPeopleChange = (v: string) => { if (/^\d*$/.test(v)) setPeopleStr(v); };
  const onLanesChange  = (v: string) => { if (/^\d*$/.test(v)) setLanesStr(v); };

  const commitPeople = () => {
    const n = Math.max(1, Math.min(20, Number(peopleStr || "0")));
    setPeople(Number.isFinite(n) ? n : 1);
  };
  const commitLanes = () => {
    const n = Math.max(1, Math.min(10, Number(lanesStr || "0")));
    setLanes(Number.isFinite(n) ? n : 1);
  };

  const canSubmit = !!date && !!time && isShoeCountValid() && isCapacityValid() && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await submit(); onConfirm(); } catch { /* Handled in store */ }
  };

   return (
    <section className="page booking-scroll">
      <header className="page__header booking-header">
        <div className="logo"><img src="/logo.png" alt="fireball" /></div>
        <h1 className="page__title booking-title">BOOKING</h1>
      </header>

      <div className="page__content">
        <div className="section-head">
          <span>WHEN, WHAT & WHO</span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row two">
            <div className="field">
              <label>DATE</label>
              <div className="input-wrap">
                <input
                  type="date"
                  value={date}
                  onChange={(e)=>setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>TIME</label>
              <div className="input-wrap input--accent">
                <input
                  type="time"
                  value={time}
                  onChange={(e)=>setTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row two">
            <div className="field">
              <label>NUMBER OF AWESOME BOWLERS</label>
              <div className="input-wrap">
                <input
                  inputMode="numeric"
                  pattern="\d*"
                  value={peopleStr}
                  onChange={(e)=>onPeopleChange(e.target.value)}
                  onBlur={commitPeople}
                  onKeyDown={(e)=> e.key === "Enter" && (e.currentTarget.blur(), e.preventDefault())}
                  placeholder="3"
                />
                <span className="suffix">pers</span>
              </div>
            </div>

            <div className="field">
              <label>NUMBER OF LANES</label>
              <div className="input-wrap">
                <input
                  inputMode="numeric"
                  pattern="\d*"
                  value={lanesStr}
                  onChange={(e)=>onLanesChange(e.target.value)}
                  onBlur={commitLanes}
                  onKeyDown={(e)=> e.key === "Enter" && (e.currentTarget.blur(), e.preventDefault())}
                  placeholder="1"
                />
                <span className="suffix">lane</span>
              </div>
            </div>
          </div>

          <div className="section-head">
            <span>SHOES</span>
          </div>

          <ul className="shoes">
            {shoes.map((size, i) => (
              <li key={i}>
                <ShoeRow
                  index={i}
                  value={size}
                  onChange={(v)=>setShoeAt(i, v)}
                  onRemove={()=> removeShoe(i)}
                />
              </li>
            ))}
          </ul>

          <div className="add-wrap">
            <button type="button" className="btn circle add" onClick={addShoe}>+</button>
          </div>

          {!isShoeCountValid() && (
            <p className="note warn"> Antal skor måste vara exakt {people}.</p>
          )}
          {!isCapacityValid() && (
            <p className="note warn"> Max 4 spelare per bana (just nu {people} / {lanes} banor).</p>
          )}
          {error && (
            <div className="note error" aria-live="assertive">
               Servern är upptagen just nu. Försök igen.
              <div className="retry">
                <button
                  type="button"
                  className="btn primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  Försök igen
                </button>
              </div>
            </div>
          )}

             <div className="cta-wrap">
            <button className="btn primary block strike" disabled={!canSubmit}>
              STRIIIIIKE!
            </button>
          </div>
        </form>
      </div>

      <div className="bottom-gap" aria-hidden="true" />
    </section>
  );
}