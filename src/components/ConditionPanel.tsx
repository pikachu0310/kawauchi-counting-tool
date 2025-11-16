import type { ConditionsState } from "../types";
import styles from "./ConditionPanel.module.css";

type ConditionPanelProps = {
  conditions: ConditionsState;
  onChange: (update: Partial<ConditionsState>) => void;
};

export const ConditionPanel = ({ conditions, onChange }: ConditionPanelProps) => {
  const handleCheckbox = (key: keyof Omit<ConditionsState, "distinctPreferences">) => {
    onChange({ [key]: !conditions[key] } as Partial<ConditionsState>);
  };

  const handlePreferenceChange = (value: 1 | 2 | 3) => {
    onChange({ distinctPreferences: value });
  };

  return (
    <section className={styles.panel}>
      <h2>卓の状況</h2>
      <div className={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            checked={conditions.hasHigherCharRoomPlayer}
            onChange={() => handleCheckbox("hasHigherCharRoomPlayer")}
          />
          自分よりキャラ+部屋の数が多いプレイヤーが 1 人以上いる
        </label>
        <label>
          <input
            type="checkbox"
            checked={conditions.isMinCharPlayer}
            onChange={() => handleCheckbox("isMinCharPlayer")}
          />
          自分はキャラクター数が最も少ないグループにいる
        </label>
      </div>
      <div className={styles.preferenceGroup}>
        <p>みんなの大好物：好みの種類</p>
        <div className={styles.radioRow}>
          {[1, 2, 3].map((value) => (
            <label key={value} className={styles.radioLabel}>
              <input
                type="radio"
                name="distinctPreferences"
                value={value}
                checked={conditions.distinctPreferences === value}
                onChange={() => handlePreferenceChange(value as 1 | 2 | 3)}
              />
              {value} 種類
            </label>
          ))}
        </div>
      </div>
      <p className={styles.hint}>
        ※ 条件は「季節の変わり目」リセット後も維持されます。最小人数や格差状況が変わったら、ここで更新してください。
      </p>
    </section>
  );
};
