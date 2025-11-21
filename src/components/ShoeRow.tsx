export default function ShoeRow({
  index, value, onChange, onRemove
}: { index: number; value: number; onChange: (v:number)=>void; onRemove: ()=>void }) {
  return (
    <div className="shoe-row">
      <div className="field">
        <label>SHOE SIZE / PERSON {index + 1}</label>
        <div className="input-wrap">
          <select
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 20 }, (_, i) => i + 34).map(n => (
              <option key={n} value={n}>Euro {n}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        className="btn icon minus"
        onClick={onRemove}
        aria-label={`Remove shoe ${index + 1}`}
      >
        -
      </button>
    </div>
  );
}
