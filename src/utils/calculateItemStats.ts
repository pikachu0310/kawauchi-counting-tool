import type { ItemDefinition, ItemId, ItemInstanceState } from "../types";

export type ItemStats = {
  remaining: number;
  expectedFoodGain: number;
};

export const calculateItemStats = (
  itemState: ItemInstanceState,
  items: ItemDefinition[],
  expectedFoodPerCard: number,
): ItemStats => {
  let remaining = 0;
  let expectedFoodGain = 0;

  const getAvailable = (itemId: ItemId, count: number) => {
    let available = 0;
    for (let i = 0; i < count; i += 1) {
      const id = `${itemId}__${i}` as const;
      if (itemState[id]) {
        available += 1;
      }
    }
    return available;
  };

  for (const item of items) {
    remaining += getAvailable(item.id, item.count);
  }

  if (remaining === 0) {
    return { remaining: 0, expectedFoodGain: 0 };
  }

  for (const item of items) {
    const available = getAvailable(item.id, item.count);
    if (available === 0) continue;
    const probability = available / remaining;
    const extraFood = (item.extraDraws ?? 0) * expectedFoodPerCard;
    expectedFoodGain += probability * (item.foodGain + extraFood);
  }

  return { remaining, expectedFoodGain };
};
