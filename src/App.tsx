import { useMemo, useState } from "react";

import styles from "./App.module.css";
import { CardGrid } from "./components/CardGrid";
import { ConditionPanel } from "./components/ConditionPanel";
import { StatsPanel } from "./components/StatsPanel";
import { cardDefinitions, createInitialDeckState } from "./data/cardDefinitions";
import { calculateStats } from "./utils/calculateStats";
import type { CardId, ConditionsState, DeckState } from "./types";

const initialConditions: ConditionsState = {
  hasHigherCharRoomPlayer: false,
  isMinCharPlayer: false,
  distinctPreferences: 1,
};

const cardMaxById = cardDefinitions.reduce<Record<CardId, number>>(
  (acc, card) => {
    acc[card.id] = card.count;
    return acc;
  },
  {} as Record<CardId, number>,
);

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const App = () => {
  const [conditions, setConditions] = useState<ConditionsState>(initialConditions);
  const [deckState, setDeckState] = useState<DeckState>(() => createInitialDeckState());

  const stats = useMemo(
    () => calculateStats(deckState, conditions, cardDefinitions),
    [deckState, conditions],
  );

  const handleDraw = (cardId: CardId) => {
    setDeckState((prev) => {
      const remaining = prev[cardId];
      if (!remaining) return prev;
      return { ...prev, [cardId]: remaining - 1 };
    });
  };

  const handleAdjust = (cardId: CardId, delta: number) => {
    setDeckState((prev) => {
      const current = prev[cardId];
      const max = cardMaxById[cardId] ?? 0;
      const next = clamp(current + delta, 0, max);
      if (next === current) {
        return prev;
      }
      return { ...prev, [cardId]: next };
    });
  };

  const handleConditionChange = (update: Partial<ConditionsState>) => {
    setConditions((prev) => ({ ...prev, ...update }));
  };

  const handleResetDeck = () => {
    setDeckState(createInitialDeckState());
  };

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.tag}>React + TypeScript / CSS Modules</p>
            <h1>カードカウンティングツール</h1>
            <p className={styles.lead}>
              山札の残り構成を追跡し、次の1枚で得られる資源期待値や各種確率をリアルタイム表示します。
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
            deckState={deckState}
            onDraw={handleDraw}
            onAdjust={handleAdjust}
          />
          <div className={styles.panelStack}>
            <ConditionPanel conditions={conditions} onChange={handleConditionChange} />
            <StatsPanel stats={stats} />
          </div>
        </div>
        <footer className={styles.footer}>
          <p>
            画像はプレースホルダー表示です。最適な結果を得るにはゲーム中にカードをクリックして引いた枚数を反映させてください。
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
