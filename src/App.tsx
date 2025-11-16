import { useMemo, useState } from "react";

import styles from "./App.module.css";
import { CardGrid } from "./components/CardGrid";
import { ConditionPanel } from "./components/ConditionPanel";
import { StatsPanel } from "./components/StatsPanel";
import { resourceColors, resourceLabels } from "./components/statsConfig";
import { resourceLabels, resourceColors } from "./components/StatsPanel";
import {
  cardDefinitions,
  cardGroups,
  createInitialInstanceState,
  deriveDeckStateFromInstances,
} from "./data/cardDefinitions";
import { calculateStats, formatPercentage, formatResourceValue } from "./utils/calculateStats";
import type { CardInstanceId, CardInstanceState, ConditionsState } from "./types";

const initialConditions: ConditionsState = {
  hasHigherCharRoomPlayer: false,
  isMinCharPlayer: false,
  favoriteSelection: {
    fruit: true,
    meat: false,
    fish: false,
  },
};

export const App = () => {
  const [conditions, setConditions] = useState<ConditionsState>(initialConditions);
  const [instanceState, setInstanceState] = useState<CardInstanceState>(() =>
    createInitialInstanceState(),
  );
  const deckState = useMemo(
    () => deriveDeckStateFromInstances(instanceState),
    [instanceState],
  );

  const stats = useMemo(
    () => calculateStats(deckState, conditions, cardDefinitions),
    [deckState, conditions],
  );

  const handleToggleInstance = (instanceId: CardInstanceId) => {
    setInstanceState((prev) => ({
      ...prev,
      [instanceId]: !prev[instanceId],
    }));
  };

  const handleConditionChange = (update: Partial<ConditionsState>) => {
    setConditions((prev) => ({ ...prev, ...update }));
  };

  const handleResetDeck = () => {
    setInstanceState(createInitialInstanceState());
  };

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>
            <a
              href="https://leftonbo.github.io/kawauchi/"
              target="_blank"
              rel="noreferrer"
              className={styles.brandLink}
            >
              かわうち
            </a>{" "}
            カウンティングツール
          </h1>
        </header>
        <div className={styles.layout}>
          <CardGrid
            cards={cardDefinitions}
            groups={cardGroups}
            instanceState={instanceState}
            onToggle={handleToggleInstance}
          />
          <div className={styles.panelStack}>
            <ConditionPanel
              conditions={conditions}
              onChange={handleConditionChange}
              onReset={handleResetDeck}
              remainingCards={stats.totalCards}
            />
            <StatsPanel stats={stats} />
          </div>
        </div>
        <footer className={styles.footer}>
          <p>
            色付きカードをタップして残り枚数を調整し、右側で条件と確率を確認してください。季節の変わり目は強力イベント欄のボタンからリセットできます。
          </p>
          <div className={styles.footerExtra}>
            <section>
              <h3>次の 1 枚で獲得できる期待値</h3>
              <div className={styles.footerExpectationGrid}>
                {(Object.entries(resourceLabels) as [keyof typeof resourceLabels, string][]).map(
                  ([key, label]) => {
                    const color = resourceColors[key];
                    return (
                      <div key={key} className={styles.footerExpectationItem}>
                        <span style={{ color }}>{label}</span>
                        <strong style={{ color }}>
                          {formatResourceValue(stats.expectationFinal[key])}
                        </strong>
                      </div>
                    );
                  },
                )}
              </div>
            </section>
            <section>
              <h3>特殊カードの確率</h3>
              <div className={styles.footerSpecialGrid}>
                <div>
                  <p className={styles.footerSpecialLabel}>アイテムカード</p>
                  <strong>
                    {stats.itemCount} 枚 / {stats.totalCards} 枚
                  </strong>
                  <span>{formatPercentage(stats.itemProbability)}</span>
                </div>
                <div>
                  <p className={styles.footerSpecialLabel}>不思議な湧き水</p>
                  <strong>
                    {stats.extraActionCount} 枚 / {stats.totalCards} 枚
                  </strong>
                  <span>{formatPercentage(stats.extraActionProbability)}</span>
                </div>
              </div>
            </section>
          </div>
          <p className={styles.footerCredits}>
            作者:
            {" "}
            <a href="https://x.com/pikachu0310VRC" target="_blank" rel="noreferrer">
              pikachu0310
            </a>
            {" / "}
            <a
              href="https://github.com/pikachu0310/kawauchi-counting-tool"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
