import { useState } from "react";

import type { CardDefinition, CardId, DeckState } from "../types";
import styles from "./CardGrid.module.css";

type CardGridProps = {
  cards: CardDefinition[];
  deckState: DeckState;
  onDraw: (cardId: CardId) => void;
  onAdjust: (cardId: CardId, delta: number) => void;
};

type CardTileProps = {
  card: CardDefinition;
  remaining: number;
  onDraw: () => void;
  onAdjust: (delta: number) => void;
};

const CardImage = ({ path, name }: { path: string; name: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={styles.imagePlaceholder}>
        <span className={styles.imagePlaceholderLabel}>画像未設定</span>
        <span className={styles.imagePlaceholderPath}>{path}</span>
      </div>
    );
  }

  return (
    <img
      className={styles.image}
      src={path}
      alt={`${name}のカード`}
      onError={() => setHasError(true)}
    />
  );
};

const CardTile = ({ card, remaining, onDraw, onAdjust }: CardTileProps) => {
  const isDepleted = remaining === 0;

  return (
    <article className={`${styles.card} ${isDepleted ? styles.depleted : ""}`}>
      <button
        type="button"
        className={styles.cardButton}
        onClick={onDraw}
        disabled={isDepleted}
      >
        <CardImage path={card.imagePath} name={card.name} />
        <div className={styles.cardBody}>
          <div className={styles.cardTitleRow}>
            <h3>{card.name}</h3>
            {card.isItemCard && <span className={styles.tag}>アイテム</span>}
            {card.extraActionCard && <span className={styles.tag}>再行動</span>}
            {card.isGoAgain && <span className={styles.tag}>もう1枚</span>}
          </div>
          <p className={styles.cardCount}>
            残り <strong>{remaining}</strong> / {card.count}
          </p>
        </div>
      </button>
      <div className={styles.adjustRow}>
        <button
          type="button"
          onClick={() => onAdjust(-1)}
          disabled={remaining <= 0}
          aria-label={`${card.name} を 1 枚戻す`}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onAdjust(1)}
          disabled={remaining >= card.count}
          aria-label={`${card.name} を 1 枚増やす`}
        >
          ＋
        </button>
      </div>
    </article>
  );
};

export const CardGrid = ({ cards, deckState, onDraw, onAdjust }: CardGridProps) => (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2>カード一覧</h2>
      <p>カードをクリックして「1 枚引いた」ことを記録できます。</p>
    </div>
    <div className={styles.grid}>
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          remaining={deckState[card.id] ?? 0}
          onDraw={() => onDraw(card.id)}
          onAdjust={(delta) => onAdjust(card.id, delta)}
        />
      ))}
    </div>
  </section>
);
