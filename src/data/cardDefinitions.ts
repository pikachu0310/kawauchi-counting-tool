import type { CardDefinition, DeckState } from "../types";
import type { ResourceVector } from "../types";

const resource = (fruit: number, meat: number, fish: number): ResourceVector => ({
  fruit,
  meat,
  fish,
});

export const cardDefinitions: CardDefinition[] = [
  {
    id: "gather_fruit2",
    name: "採集：果物果物",
    count: 2,
    baseGain: resource(2, 0, 0),
    imagePath: "/cards/gather_fruit2.png",
  },
  {
    id: "gather_meat2",
    name: "採集：お肉お肉",
    count: 2,
    baseGain: resource(0, 2, 0),
    imagePath: "/cards/gather_meat2.png",
  },
  {
    id: "gather_fish2",
    name: "採集：魚魚",
    count: 2,
    baseGain: resource(0, 0, 2),
    imagePath: "/cards/gather_fish2.png",
  },
  {
    id: "gather_fruit_meat",
    name: "採集：果物肉",
    count: 3,
    baseGain: resource(1, 1, 0),
    imagePath: "/cards/gather_fruit_meat.png",
  },
  {
    id: "gather_fruit_fish",
    name: "採集：果物魚",
    count: 3,
    baseGain: resource(1, 0, 1),
    imagePath: "/cards/gather_fruit_fish.png",
  },
  {
    id: "gather_meat_fish",
    name: "採集：肉魚",
    count: 3,
    baseGain: resource(0, 1, 1),
    imagePath: "/cards/gather_meat_fish.png",
  },
  {
    id: "overhunt_fruit2",
    name: "乱獲：果物果物",
    count: 1,
    baseGain: resource(2, 0, 0),
    imagePath: "/cards/overhunt_fruit2.png",
  },
  {
    id: "overhunt_meat2",
    name: "乱獲：お肉お肉",
    count: 1,
    baseGain: resource(0, 2, 0),
    imagePath: "/cards/overhunt_meat2.png",
  },
  {
    id: "overhunt_fish2",
    name: "乱獲：魚魚",
    count: 1,
    baseGain: resource(0, 0, 2),
    imagePath: "/cards/overhunt_fish2.png",
  },
  {
    id: "find_item",
    name: "発見",
    count: 8,
    baseGain: resource(0, 0, 0),
    isItemCard: true,
    imagePath: "/cards/find_item.png",
  },
  {
    id: "big_find",
    name: "大発見",
    count: 1,
    baseGain: resource(0, 0, 0),
    isItemCard: true,
    imagePath: "/cards/big_find.png",
  },
  {
    id: "buried_treasure",
    name: "埋蔵金",
    count: 1,
    baseGain: resource(0, 0, 0),
    isItemCard: true,
    imagePath: "/cards/buried_treasure.png",
  },
  {
    id: "fruit_hunt",
    name: "フルーツ狩り",
    count: 1,
    baseGain: resource(3, 0, 0),
    imagePath: "/cards/fruit_hunt.png",
  },
  {
    id: "barbecue",
    name: "バーベキュー",
    count: 1,
    baseGain: resource(0, 3, 0),
    imagePath: "/cards/barbecue.png",
  },
  {
    id: "big_catch",
    name: "大漁！",
    count: 1,
    baseGain: resource(0, 0, 3),
    imagePath: "/cards/big_catch.png",
  },
  {
    id: "rescued_fish",
    name: "取り逃した魚",
    count: 1,
    baseGain: resource(1, 1, 0),
    conditionalGain: [
      {
        condition: "isMinCharPlayer",
        gain: resource(0, 0, 1),
      },
    ],
    imagePath: "/cards/rescued_fish.png",
  },
  {
    id: "blessing_spring",
    name: "恵みの泉",
    count: 1,
    baseGain: resource(1, 0, 1),
    conditionalGain: [
      {
        condition: "isMinCharPlayer",
        gain: resource(0, 1, 0),
      },
    ],
    imagePath: "/cards/blessing_spring.png",
  },
  {
    id: "basket_with_hole",
    name: "穴の空いたカゴ",
    count: 1,
    baseGain: resource(0, 1, 1),
    conditionalGain: [
      {
        condition: "isMinCharPlayer",
        gain: resource(1, 0, 0),
      },
    ],
    imagePath: "/cards/basket_with_hole.png",
  },
  {
    id: "harvest_help",
    name: "収穫のお手伝い",
    count: 1,
    baseGain: resource(1, 1, 0),
    conditionalGain: [
      {
        condition: "hasHigherCharRoomPlayer",
        gain: resource(1, 0, 0),
      },
    ],
    imagePath: "/cards/harvest_help.png",
  },
  {
    id: "animal_care",
    name: "動物たちのお世話",
    count: 1,
    baseGain: resource(0, 1, 1),
    conditionalGain: [
      {
        condition: "hasHigherCharRoomPlayer",
        gain: resource(0, 1, 0),
      },
    ],
    imagePath: "/cards/animal_care.png",
  },
  {
    id: "ocean_current_blessing",
    name: "海流の恩恵",
    count: 1,
    baseGain: resource(1, 0, 1),
    conditionalGain: [
      {
        condition: "hasHigherCharRoomPlayer",
        gain: resource(0, 0, 1),
      },
    ],
    imagePath: "/cards/ocean_current_blessing.png",
  },
  {
    id: "big_harvest",
    name: "大豊作",
    count: 1,
    baseGain: resource(2, 2, 2),
    imagePath: "/cards/big_harvest.png",
  },
  {
    id: "mercy",
    name: "お慈悲",
    count: 1,
    baseGain: resource(1, 1, 1),
    imagePath: "/cards/mercy.png",
  },
  {
    id: "scattered_food",
    name: "散らばる食糧",
    count: 1,
    baseGain: resource(1, 1, 1),
    imagePath: "/cards/scattered_food.png",
  },
  {
    id: "change_shift",
    name: "交代のチャイム",
    count: 1,
    baseGain: resource(1, 1, 1),
    imagePath: "/cards/change_shift.png",
  },
  {
    id: "begging",
    name: "おねだり",
    count: 1,
    baseGain: resource(1, 1, 1),
    imagePath: "/cards/begging.png",
  },
  {
    id: "mysterious_spring",
    name: "不思議な湧き水",
    count: 1,
    baseGain: resource(0, 0, 0),
    extraActionCard: true,
    imagePath: "/cards/mysterious_spring.png",
  },
  {
    id: "everyone_favorite",
    name: "みんなの大好物",
    count: 1,
    baseGain: resource(0, 0, 0),
    imagePath: "/cards/everyone_favorite.png",
  },
  {
    id: "go_again_fruit",
    name: "いってきまーす！（果物）",
    count: 1,
    baseGain: resource(1, 0, 0),
    isGoAgain: true,
    imagePath: "/cards/go_again_fruit.png",
  },
  {
    id: "go_again_meat",
    name: "いってきまーす！（お肉）",
    count: 1,
    baseGain: resource(0, 1, 0),
    isGoAgain: true,
    imagePath: "/cards/go_again_meat.png",
  },
  {
    id: "go_again_fish",
    name: "いってきまーす！（魚）",
    count: 1,
    baseGain: resource(0, 0, 1),
    isGoAgain: true,
    imagePath: "/cards/go_again_fish.png",
  },
  {
    id: "season_change",
    name: "季節の変わり目",
    count: 1,
    baseGain: resource(0, 0, 0),
    imagePath: "/cards/season_change.png",
  },
];

export const createInitialDeckState = (): DeckState =>
  cardDefinitions.reduce<DeckState>((acc, card) => {
    acc[card.id] = card.count;
    return acc;
  }, {} as DeckState);
