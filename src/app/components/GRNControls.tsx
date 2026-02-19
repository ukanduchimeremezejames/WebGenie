// components/GRNControls.tsx
import { FC } from "react";

interface Props {
  algorithms: string[];
  selected: string[];
  setSelected: (algos: string[]) => void;
  minSupport: number;
  setMinSupport: (v: number) => void;
  scoreThreshold: number;
  setScoreThreshold: (v: number) => void;
}

export const GRNControls: FC<Props> = ({
  algorithms, selected, setSelected, minSupport, setMinSupport, scoreThreshold, setScoreThreshold
}) => {
  return (
    <div className="controls">
      <h3>Filters</h3>
      <div>
        <strong>Algorithms:</strong>
        {algorithms.map(a => (
          <label key={a}>
            <input
              type="checkbox"
              checked={selected.includes(a)}
              onChange={e => {
                if (e.target.checked) setSelected([...selected, a]);
                else setSelected(selected.filter(s => s !== a));
              }}
            />
            {a}
          </label>
        ))}
      </div>
      <div>
        <label>
          Min Support:
          <input
            type="number"
            value={minSupport}
            onChange={e => setMinSupport(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Score Threshold:
          <input
            type="number"
            step={0.01}
            value={scoreThreshold}
            onChange={e => setScoreThreshold(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};
