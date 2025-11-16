import type { DeckComputationResult } from "../utils/calculateStats";
import { formatPercentage, formatResourceValue } from "../utils/calculateStats";
import styles from "./StatsPanel.module.css";

type StatsPanelProps = {
  stats: DeckComputationResult;
};

const resourceLabels = {
  fruit: "果物",
  meat: "お肉",
  fish: "お魚",
} as const;

const resourceColors: Record<keyof typeof resourceLabels, string> = {
  fruit: "#22c55e",
  meat: "#ef4444",
  fish: "#3b82f6",
};

const thresholds = [
  { key: 1, label: "1 枚以上" },
  { key: 2, label: "2 枚以上" },
  { key: 3, label: "3 枚以上" },
] as const;

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  const isDeckEmpty = stats.totalCards === 0;

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>期待値 &amp; 確率</h2>
        <p>残り {stats.totalCards} 枚</p>
      </div>
      {isDeckEmpty && (
        <p className={styles.warning}>デッキが空です。季節の変わり目でリセットしてください。</p>
      )}
      <div className={styles.statGroup}>
        <h3>次の 1 枚で獲得できる期待値</h3>
        <div className={styles.expectationGrid}>
          {(Object.entries(resourceLabels) as [keyof typeof resourceLabels, string][]).map(
            ([key, label]) => {
              const color = resourceColors[key];
              return (
                <div key={key} className={styles.expectationItem}>
                  <span style={{ color }}>{label}</span>
                  <strong style={{ color }}>
                    {formatResourceValue(stats.expectationFinal[key])}
                  </strong>
                </div>
              );
            },
          )}
        </div>
      </div>
      <div className={styles.statGroup}>
        <h3>特殊カードの確率</h3>
        <div className={styles.specialGrid}>
          <div>
            <p className={styles.specialLabel}>アイテムカード</p>
            <strong>
              {stats.itemCount} 枚 / {stats.totalCards} 枚
            </strong>
            <span>{formatPercentage(stats.itemProbability)}</span>
          </div>
          <div>
            <p className={styles.specialLabel}>不思議な湧き水</p>
            <strong>
              {stats.extraActionCount} 枚 / {stats.totalCards} 枚
            </strong>
            <span>{formatPercentage(stats.extraActionProbability)}</span>
          </div>
        </div>
      </div>
      <div className={styles.statGroup}>
        <h3>資源が x 枚以上得られる確率（カード単体）</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>資源</th>
                {thresholds.map((threshold) => (
                  <th key={threshold.key}>{threshold.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.entries(resourceLabels) as [keyof typeof resourceLabels, string][]).map(
                ([key, label]) => (
                  <tr key={key}>
                    <td style={{ color: resourceColors[key] }}>{label}</td>
                    {thresholds.map((threshold) => (
                      <td key={threshold.key}>
                        {formatPercentage(stats.resourceAtLeast[key][threshold.key])}
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
