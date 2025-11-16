import { useMemo, useState } from "react";

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

type CardImageProps = {
  path: string;
  name: string;
};

const CardImage = ({ path, name }: CardImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={styles.imagePlaceholder} aria-label={`${name}（画像未設定）`}>
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
      draggable={false}
    />
  );
};

const CardInstanceButton = ({
  cardName,
  imagePath,
  isActive,
  onToggle,
}: {
  cardName: string;
  imagePath: string;
  isActive: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    className={`${styles.instanceButton} ${isActive ? styles.instanceActive : styles.instanceInactive}`}
    onClick={onToggle}
    aria-pressed={isActive}
    aria-label={`${cardName} / ${isActive ? "山札に残す" : "引き済み"}`}
  >
    <CardImage path={imagePath} name={cardName} />
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
        <p>各シリーズごとに 1 枚ずつトグルできます。明るい = 山札に残り / 暗い = 引き済み。</p>
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
                      <CardInstanceButton
                        key={instanceId}
                        cardName={card.name}
                        imagePath={card.imagePath}
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
