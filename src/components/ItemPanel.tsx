import { useMemo } from "react";

import { itemDefinitions } from "../data/itemDefinitions";
import type { ItemInstanceId, ItemInstanceState } from "../types";
import styles from "./ItemPanel.module.css";

type ItemPanelProps = {
  itemState: ItemInstanceState;
  onToggle: (id: ItemInstanceId) => void;
};

const ItemTile = ({
  name,
  description,
  color,
  active,
  onToggle,
}: {
  name: string;
  description: string;
  color: string;
  active: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    className={`${styles.tile} ${active ? styles.active : styles.inactive}`}
    style={{ backgroundColor: color }}
    onClick={onToggle}
    aria-pressed={active}
    aria-label={`${name} / ${active ? "まだ山札にある" : "使用済み"}`}
  >
    <span className={styles.title}>{name}</span>
    <span className={styles.description}>{description}</span>
  </button>
);

export const ItemPanel = ({ itemState, onToggle }: ItemPanelProps) => {
  const tiles = useMemo(() => {
    return itemDefinitions.flatMap((item) =>
      Array.from({ length: item.count }).map((_, index) => {
        const instanceId = `${item.id}__${index}` as ItemInstanceId;
        return {
          instanceId,
          item,
          active: itemState[instanceId],
        };
      }),
    );
  }, [itemState]);

  return (
    <section className={styles.panel}>
      <h2>アイテムカウンティング</h2>
      <div className={styles.grid}>
        {tiles.map(({ instanceId, item, active }) => (
          <ItemTile
            key={instanceId}
            id={instanceId}
            name={item.name}
            description={item.description}
            color={item.color}
            active={active}
            onToggle={() => onToggle(instanceId)}
          />
        ))}
      </div>
    </section>
  );
};
