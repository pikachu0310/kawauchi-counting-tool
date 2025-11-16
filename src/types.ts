export type ResourceType = "fruit" | "meat" | "fish";

export type ResourceVector = Record<ResourceType, number>;

export type ConditionKey = "hasHigherCharRoomPlayer" | "isMinCharPlayer";

export type CardId =
  | "gather_fruit2"
  | "gather_meat2"
  | "gather_fish2"
  | "gather_fruit_meat"
  | "gather_fruit_fish"
  | "gather_meat_fish"
  | "overhunt_fruit2"
  | "overhunt_meat2"
  | "overhunt_fish2"
  | "find_item"
  | "big_find"
  | "buried_treasure"
  | "fruit_hunt"
  | "barbecue"
  | "big_catch"
  | "rescued_fish"
  | "blessing_spring"
  | "basket_with_hole"
  | "harvest_help"
  | "animal_care"
  | "ocean_current_blessing"
  | "big_harvest"
  | "mercy"
  | "scattered_food"
  | "change_shift"
  | "begging"
  | "mysterious_spring"
  | "everyone_favorite"
  | "go_again_fruit"
  | "go_again_meat"
  | "go_again_fish"
  | "season_change";

export type CardGroupId =
  | "general_gather"
  | "general_overhunt"
  | "item_discovery"
  | "mono_resource"
  | "relief_min_char"
  | "relief_higher_char"
  | "power_events"
  | "go_again"
  | "reset";

export type CardGroup = {
  id: CardGroupId;
  title: string;
  description?: string;
};

export type CardDefinition = {
  id: CardId;
  name: string;
  count: number;
  baseGain: ResourceVector;
  conditionalGain?: {
    condition: ConditionKey;
    gain: ResourceVector;
  }[];
  isItemCard?: boolean;
  extraActionCard?: boolean;
  isGoAgain?: boolean;
  imagePath: string;
  groupId: CardGroupId;
};

export type ConditionsState = {
  hasHigherCharRoomPlayer: boolean;
  isMinCharPlayer: boolean;
  distinctPreferences: 1 | 2 | 3;
};

export type DeckState = Record<CardId, number>;

export type CardInstanceId = `${CardId}__${number}`;

export type CardInstanceState = Record<CardInstanceId, boolean>;
