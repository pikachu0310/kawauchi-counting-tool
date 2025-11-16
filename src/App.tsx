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
  distinctPreferences: 1,
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
          <div>
            <p className={styles.tag}>React + TypeScript / CSS Modules</p>
            <h1>カードカウンティングツール</h1>
            <p className={styles.lead}>
              山札の残り構成を追跡し、次の1枚で得られる資源期待値や各種確率をリアルタイム表示します。各カード画像を点灯/消灯させて残り枚数を管理してください。
            </p>
          </div>
          <div className={styles.summaryRow}>
            <div className={styles.counterCard}>
              <p>デッキ残り枚数</p>
              <strong>{stats.totalCards}</strong>
            </div>
            <button type="button" className={styles.resetButton} onClick={handleResetDeck}>
              季節の変わり目（カウンティングリセット）
            </button>
          </div>
        </header>
        <div className={styles.layout}>
          <CardGrid
            cards={cardDefinitions}
            groups={cardGroups}
            instanceState={instanceState}
            onToggle={handleToggleInstance}
          />
          <div className={styles.panelStack}>
            <ConditionPanel conditions={conditions} onChange={handleConditionChange} />
            <StatsPanel stats={stats} />
          </div>
        </div>
        <footer className={styles.footer}>
          <p>
            画像はプレースホルダー表示です。1 枚 1 枚をクリックして ON（明るい）/OFF（暗い）を切り替え、引いたカードを即座に反映させてください。
            条件チェックボックスは「季節の変わり目」のリセットでは保持されます。
          </p>
          <div className={styles.footerLinks}>
            <span>手順: npm install → npm run dev</span>
            <span>スタイル: CSS Modules</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
