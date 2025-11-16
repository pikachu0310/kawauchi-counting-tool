import { useMemo, useState } from "react";

import styles from "./App.module.css";
import { CardGrid } from "./components/CardGrid";
import { ConditionPanel } from "./components/ConditionPanel";
import { StatsPanel } from "./components/StatsPanel";
import { ItemPanel } from "./components/ItemPanel";
import { resourceColors, resourceLabels } from "./components/statsConfig";
import {
  cardDefinitions,
  cardGroups,
  createInitialDeckState,
  createInitialInstanceState,
  deriveDeckStateFromInstances,
} from "./data/cardDefinitions";
import {
  itemDefinitions,
  createInitialItemState,
} from "./data/itemDefinitions";
import { calculateStats, formatPercentage, formatResourceValue } from "./utils/calculateStats";
import { calculateItemStats } from "./utils/calculateItemStats";
import type {
  CardInstanceId,
  CardInstanceState,
  ConditionsState,
  ItemInstanceId,
  ItemInstanceState,
} from "./types";

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
  const [itemState, setItemState] = useState<ItemInstanceState>(() => createInitialItemState());
  const deckState = useMemo(
    () => deriveDeckStateFromInstances(instanceState),
    [instanceState],
  );

  const seasonStatsBase = useMemo(
    () =>
      calculateStats(createInitialDeckState(), conditions, cardDefinitions, {
        itemFoodValue: 0,
      }),
    [conditions],
  );

  const statsWithoutItems = useMemo(
    () =>
      calculateStats(deckState, conditions, cardDefinitions, {
        itemFoodValue: 0,
        seasonExpectation: {
          vector: seasonStatsBase.expectationFinal,
          food: seasonStatsBase.foodExpectation,
        },
      }),
    [deckState, conditions, seasonStatsBase],
  );

  const itemStats = useMemo(
    () => calculateItemStats(itemState, itemDefinitions, statsWithoutItems.foodExpectation),
    [itemState, statsWithoutItems.foodExpectation],
  );

  const seasonStatsWithItems = useMemo(
    () =>
      calculateStats(createInitialDeckState(), conditions, cardDefinitions, {
        itemFoodValue: itemStats.expectedFoodGain,
      }),
    [conditions, itemStats.expectedFoodGain],
  );

  const stats = useMemo(
    () =>
      calculateStats(deckState, conditions, cardDefinitions, {
        itemFoodValue: itemStats.expectedFoodGain,
        seasonExpectation: {
          vector: seasonStatsWithItems.expectationFinal,
          food: seasonStatsWithItems.foodExpectation,
        },
      }),
    [deckState, conditions, itemStats.expectedFoodGain, seasonStatsWithItems],
  );

  const handleToggleInstance = (instanceId: CardInstanceId) => {
    setInstanceState((prev) => ({
      ...prev,
      [instanceId]: !prev[instanceId],
    }));
  };

  const handleToggleItem = (instanceId: ItemInstanceId) => {
    setItemState((prev) => ({
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
          <div className={styles.heroIntro}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleAccent}>かわうち</span>
              <span className={styles.heroTitleMain}>カウンティングツール</span>
            </h1>
            <p className={styles.heroDescription}>
              <a
                href="https://leftonbo.github.io/kawauchi/"
                target="_blank"
                rel="noreferrer"
                className={styles.heroGameLink}
              >
                「かわいい子たちとおうちを建てるゲーム」
              </a>
              というボードゲームの、カウンティング及び期待値の直感的な把握に焦点を置いたファンメイドのツールです。
            </p>
          </div>
          <div className={styles.heroAuthorCard}>
            <p className={styles.heroMetaLabel}>作者</p>
            <p className={styles.heroAuthorName}>pikachu0310</p>
            <div className={styles.heroAuthorLinks}>
              <a
                href="https://x.com/pikachu0310VRC"
                target="_blank"
                rel="noreferrer"
                className={styles.heroButton}
              >
                Twitter
              </a>
              <a
                href="https://github.com/pikachu0310/kawauchi-counting-tool"
                target="_blank"
                rel="noreferrer"
                className={styles.heroGhostButton}
              >
                GitHub
              </a>
            </div>
          </div>
        </header>
        <div className={styles.layout}>
          <div className={styles.leftColumn}>
            <CardGrid
              cards={cardDefinitions}
              groups={cardGroups}
              instanceState={instanceState}
              onToggle={handleToggleInstance}
            />
            <ItemPanel itemState={itemState} onToggle={handleToggleItem} />
          </div>
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
                <div className={styles.footerItemBlock}>
                  <p className={styles.footerSpecialLabel}>アイテム使用時の期待食材</p>
                  <strong>{itemStats.expectedFoodGain.toFixed(2)} 個</strong>
                </div>
              </div>
            </section>
          </div>
        <section className={styles.notes}>
          <h3>留意点</h3>
          <ul>
            <li>
              1探検で資源がx枚以上得られる確率は、各カードの獲得量に「もう一度行動」(いってきまーす！・不思議な湧き水・地下探検セットなど)で引く追加1枚ぶんの平均資源を加えた上で確率加重して近似しています。
            </li>
            <li>
              1探検で得られる期待食材は、カード自身の獲得量 + 「みんなの大好物」や conditional 反映後の値 + 発見系で得たアイテムを即使用した場合の期待食材 + 追加ドローぶんの平均値から算出しています。
            </li>
            <li>
              季節の変わり目は「初期デッキに戻してから 1 枚引く」ものとして初期状態の期待値を使用した近似になっています。アイテム状態はリセットされません。
            </li>
            <li>
              アイテムの効果は簡単のため記載の通りで計算しています。また、同色大量シリーズは簡単のため固定値で計算しています。
            </li>
            <li>
              主要な箇所が1画面で収まるように努力しました。VRから扱いやすいようにボタンは大きめにしています。バグ報告や問題点などがありましたら、XのDMもしくはGithub上で連絡をお願いします。
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default App;
