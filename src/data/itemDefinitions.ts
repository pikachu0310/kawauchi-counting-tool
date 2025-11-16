import type {
  ItemDefinition,
  ItemId,
  ItemInstanceId,
  ItemInstanceState,
} from "../types";

export const itemDefinitions: ItemDefinition[] = [
  {
    id: "preserved_food",
    name: "保存食",
    count: 2,
    description: "食材を5個手に入れる",
    foodGain: 5,
    color: "#f59e0b",
  },
  {
    id: "fair_scale",
    name: "公正な天秤",
    count: 3,
    description: "食材を2個手に入れる",
    foodGain: 2,
    color: "#facc15",
  },
  {
    id: "energy_drink",
    name: "エナジードリンク",
    count: 2,
    description: "もう1回行動できる",
    foodGain: 0,
    extraDraws: 1,
    color: "#38bdf8",
  },
  {
    id: "thief_bundle",
    name: "泥棒のふろしき",
    count: 2,
    description: "食材を3個手に入れる",
    foodGain: 3,
    color: "#fb7185",
  },
  {
    id: "blueprint",
    name: "設計図",
    count: 2,
    description: "食材を6個手に入れる",
    foodGain: 6,
    color: "#a78bfa",
  },
  {
    id: "expedition_pack",
    name: "探検リュック",
    count: 2,
    description: "1回カードを引く",
    foodGain: 0,
    extraDraws: 1,
    color: "#7dd3fc",
  },
  {
    id: "island_badge",
    name: "島主のバッジ",
    count: 1,
    description: "食材を6個手に入れる",
    foodGain: 6,
    color: "#f472b6",
  },
  {
    id: "hungry_knife",
    name: "腹ペコツールナイフ",
    count: 1,
    description: "食材を6個手に入れる",
    foodGain: 6,
    color: "#fb7185",
  },
  {
    id: "help_ticket",
    name: "1日お手伝い券",
    count: 1,
    description: "食材を6個手に入れる",
    foodGain: 6,
    color: "#34d399",
  },
  {
    id: "thief_wallet",
    name: "泥棒のお財布",
    count: 1,
    description: "食材を4個手に入れる",
    foodGain: 4,
    color: "#f97316",
  },
  {
    id: "underground_set",
    name: "地下探検セット",
    count: 1,
    description: "2回カードを引く",
    foodGain: 0,
    extraDraws: 2,
    color: "#60a5fa",
  },
];

export const createInitialItemState = (): ItemInstanceState => {
  const state = {} as ItemInstanceState;
  for (const item of itemDefinitions) {
    for (let i = 0; i < item.count; i += 1) {
      const id = `${item.id}__${i}` as ItemInstanceId;
      state[id] = true;
    }
  }
  return state;
};

export const deriveItemCounts = (state: ItemInstanceState) => {
  const counts: Record<ItemId, number> = {
    preserved_food: 0,
    fair_scale: 0,
    energy_drink: 0,
    thief_bundle: 0,
    blueprint: 0,
    expedition_pack: 0,
    island_badge: 0,
    hungry_knife: 0,
    help_ticket: 0,
    thief_wallet: 0,
    underground_set: 0,
  };

  for (const item of itemDefinitions) {
    for (let i = 0; i < item.count; i += 1) {
      const id = `${item.id}__${i}` as ItemInstanceId;
      if (state[id]) {
        counts[item.id] += 1;
      }
    }
  }

  return counts;
};
