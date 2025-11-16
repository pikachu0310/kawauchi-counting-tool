import type { ConditionsState, ResourceType } from "../types";
import styles from "./ConditionPanel.module.css";

type ConditionPanelProps = {
  conditions: ConditionsState;
  onChange: (update: Partial<ConditionsState>) => void;
  onReset: () => void;
};

const favoriteLabels: Record<ResourceType, string> = {
  fruit: "果物",
  meat: "お肉",
  fish: "お魚",
};

export const ConditionPanel = ({ conditions, onChange, onReset }: ConditionPanelProps) => {
  const handleCheckbox = (
    key: keyof Omit<ConditionsState, "favoriteSelection">,
  ) => {
    onChange({ [key]: !conditions[key] } as Partial<ConditionsState>);
  };

  const handleFavoriteToggle = (resource: ResourceType) => {
    onChange({
      favoriteSelection: {
        ...conditions.favoriteSelection,
        [resource]: !conditions.favoriteSelection[resource],
      },
    });
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
        <p>みんなの大好物: チェックした食材ごとに +2</p>
        <div className={styles.favoriteGrid}>
          {(Object.keys(favoriteLabels) as ResourceType[]).map((resource) => (
            <label key={resource} className={styles.favoriteItem}>
              <input
                type="checkbox"
                checked={conditions.favoriteSelection[resource]}
                onChange={() => handleFavoriteToggle(resource)}
              />
              {favoriteLabels[resource]}
            </label>
          ))}
        </div>
      </div>
      <button type="button" className={styles.resetButton} onClick={onReset}>
        季節の変わり目 (リセット)
      </button>
    </section>
  );
};
