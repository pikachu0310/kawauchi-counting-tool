import type { DeckComputationResult } from "../utils/calculateStats";
import { formatPercentage } from "../utils/calculateStats";
import styles from "./StatsPanel.module.css";
import { resourceColors, resourceLabels, thresholds } from "./statsConfig";

type StatsPanelProps = {
  stats: DeckComputationResult & { foodExpectation: number };
};

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  const isDeckEmpty = stats.totalCards === 0;

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>1探検で資源がx枚以上得られる確率</h2>
      </div>
      {isDeckEmpty && (
        <p className={styles.warning}>デッキが空です。季節の変わり目でリセットしてください。</p>
      )}
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
      <p className={styles.foodExpectation}>
        1探検で得られる期待食材: {stats.foodExpectation.toFixed(2)} 個
      </p>
    </section>
  );
};
