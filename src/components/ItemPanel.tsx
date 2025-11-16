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
  const { tiles, activeCount } = useMemo(() => {
    const mapped = itemDefinitions.flatMap((item) =>
      Array.from({ length: item.count }).map((_, index) => {
        const instanceId = `${item.id}__${index}` as ItemInstanceId;
        const active = itemState[instanceId];
        return {
          instanceId,
          item,
          active,
        };
      }),
    );

    const remaining = mapped.filter((tile) => tile.active).length;
    return {
      tiles: mapped,
      activeCount: remaining,
    };
  }, [itemState]);

  const totalCount = tiles.length;

  return (
    <section className={styles.panel}>
      <header className={styles.panelHeader}>
        <div>
          <p className={styles.panelEyebrow}>アイテムトラッカー</p>
          <h2>アイテム管理</h2>
          <p className={styles.panelDescription}>
            引いた・使用したアイテムをタップして状態を切り替え、期待値を常に最新に保ちます。
          </p>
        </div>
        <div className={styles.panelStats}>
          <div className={styles.panelStat}>
            <span>山札</span>
            <strong>{activeCount}</strong>
          </div>
          <div className={styles.panelStat}>
            <span>使用済</span>
            <strong>{totalCount - activeCount}</strong>
          </div>
        </div>
      </header>
      <div className={styles.grid}>
        {tiles.map(({ instanceId, item, active }) => (
          <ItemTile
            key={instanceId}
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
