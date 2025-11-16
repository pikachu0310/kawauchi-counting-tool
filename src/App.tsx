import { useMemo, useState } from "react";

import styles from "./App.module.css";
import { CardGrid } from "./components/CardGrid";
import { ConditionPanel } from "./components/ConditionPanel";
import { StatsPanel } from "./components/StatsPanel";
import {
  cardDefinitions,
  cardGroups,
  createInitialInstanceState,
  deriveDeckStateFromInstances,
} from "./data/cardDefinitions";
import { calculateStats } from "./utils/calculateStats";
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
            />
            <StatsPanel stats={stats} />
          </div>
        </div>
        <footer className={styles.footer}>
          <p>
            色付きカードをタップして残り枚数を調整し、右側で条件と確率を確認してください。季節の変わり目は強力イベント欄のボタンからリセットできます。
          </p>
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
