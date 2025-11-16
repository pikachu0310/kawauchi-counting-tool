import { useMemo } from "react";

import { createInstanceId } from "../data/cardDefinitions";
import type {
  CardDefinition,
  CardGroup,
  CardGroupId,
  CardInstanceId,
  CardInstanceState,
} from "../types";
import styles from "./CardGrid.module.css";

type CardGridProps = {
  cards: CardDefinition[];
  groups: CardGroup[];
  instanceState: CardInstanceState;
  onToggle: (instanceId: CardInstanceId) => void;
};

type CardInstanceTileProps = {
  card: CardDefinition;
  isActive: boolean;
  onToggle: () => void;
};

const resourceColorMap: { keyword: string; color: string }[] = [
  { keyword: "果物", color: "#166534" },
  { keyword: "お肉", color: "#991b1b" },
  { keyword: "肉", color: "#991b1b" },
  { keyword: "お魚", color: "#1d4ed8" },
  { keyword: "魚", color: "#1d4ed8" },
];

const highlightResourceText = (text: string) => {
  const tokens = text.split(/(果物|お肉|肉|お魚|魚)/g);
  return tokens.map((token, index) => {
    const match = resourceColorMap.find((entry) => entry.keyword === token);
    if (match) {
      return (
        <span key={`${token}-${index}`} style={{ color: match.color }}>
          {token}
        </span>
      );
    }
    return <span key={`${token}-${index}`}>{token}</span>;
  });
};

const CardInstanceTile = ({ card, isActive, onToggle }: CardInstanceTileProps) => (
  <button
    type="button"
    className={`${styles.instanceButton} ${isActive ? styles.instanceActive : styles.instanceInactive}`}
    style={{ backgroundColor: card.color }}
    onClick={onToggle}
    aria-pressed={isActive}
    aria-label={`${card.name} / ${isActive ? "山札に残す" : "引き済み"}`}
  >
    <span className={styles.buttonLabel}>{highlightResourceText(card.name)}</span>
    <span className={styles.buttonDesc}>{highlightResourceText(card.shortDescription)}</span>
  </button>
);

export const CardGrid = ({ cards, groups, instanceState, onToggle }: CardGridProps) => {
  const cardsByGroup = useMemo(() => {
    return cards.reduce<Record<CardGroupId, CardDefinition[]>>((acc, card) => {
      acc[card.groupId] = acc[card.groupId] ?? [];
      acc[card.groupId].push(card);
      return acc;
    }, {} as Record<CardGroupId, CardDefinition[]>);
  }, [cards]);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>カード ON / OFF</h2>
        <p>色付きボタンをクリックして ON（明）/OFF（暗）を切り替えてください。</p>
      </div>
      <div className={styles.groupStack}>
        {groups.map((group) => {
          const groupCards = cardsByGroup[group.id] ?? [];
          if (groupCards.length === 0) {
            return null;
          }

          return (
            <article key={group.id} className={styles.group}>
              <header className={styles.groupHeader}>
                <h3>{group.title}</h3>
                {group.description && <p>{group.description}</p>}
              </header>
              <div className={styles.instanceGrid}>
                {groupCards.flatMap((card) =>
                  Array.from({ length: card.count }).map((_, index) => {
                    const instanceId = createInstanceId(card.id, index);
                    const isActive = instanceState[instanceId];
                    return (
                      <CardInstanceTile
                        key={instanceId}
                        card={card}
                        isActive={isActive}
                        onToggle={() => onToggle(instanceId)}
                      />
                    );
                  }),
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
