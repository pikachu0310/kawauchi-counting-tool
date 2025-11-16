import type {
  CardDefinition,
  CardId,
  ConditionsState,
  DeckState,
  ResourceType,
  ResourceVector,
} from "../types";

const resourceTypes: ResourceType[] = ["fruit", "meat", "fish"];
const thresholds = [1, 2, 3] as const;

const zeroVector = (): ResourceVector => ({ fruit: 0, meat: 0, fish: 0 });

const addVectors = (a: ResourceVector, b: ResourceVector): ResourceVector => ({
  fruit: a.fruit + b.fruit,
  meat: a.meat + b.meat,
  fish: a.fish + b.fish,
});

const scaleVector = (vec: ResourceVector, scalar: number): ResourceVector => ({
  fruit: vec.fruit * scalar,
  meat: vec.meat * scalar,
  fish: vec.fish * scalar,
});

const buildFavoriteVector = (selection: ConditionsState["favoriteSelection"]): ResourceVector => ({
  fruit: selection.fruit ? 2 : 0,
  meat: selection.meat ? 2 : 0,
  fish: selection.fish ? 2 : 0,
});

const conditionSatisfied = (
  condition: NonNullable<CardDefinition["conditionalGain"]>[number]["condition"],
  conditions: ConditionsState,
): boolean => {
  switch (condition) {
    case "hasHigherCharRoomPlayer":
      return conditions.hasHigherCharRoomPlayer;
    case "isMinCharPlayer":
      return conditions.isMinCharPlayer;
    default:
      return false;
  }
};

const sumVector = (vec: ResourceVector): number => vec.fruit + vec.meat + vec.fish;

const subtractVectors = (a: ResourceVector, b: ResourceVector): ResourceVector => ({
  fruit: a.fruit - b.fruit,
  meat: a.meat - b.meat,
  fish: a.fish - b.fish,
});

type GainInfo = {
  vector: ResourceVector;
  food: number;
};

type StatsOptions = {
  itemFoodValue?: number;
  seasonExpectation?: GainInfo;
};

const computeImmediateGain = (
  card: CardDefinition,
  conditions: ConditionsState,
  options: StatsOptions,
): GainInfo => {
  const baseVector =
    card.id === "everyone_favorite"
      ? buildFavoriteVector(conditions.favoriteSelection)
      : card.baseGain;

  let gain = { ...baseVector };

  if (card.conditionalGain) {
    for (const entry of card.conditionalGain) {
      if (conditionSatisfied(entry.condition, conditions)) {
        gain = addVectors(gain, entry.gain);
      }
    }
  }

  const foodGain =
    card.isItemCard && options.itemFoodValue !== undefined
      ? options.itemFoodValue
      : sumVector(gain);

  return { vector: gain, food: foodGain };
};

export type ResourceThresholdMap = Record<
  ResourceType,
  Record<(typeof thresholds)[number], number>
>;

export type DeckComputationResult = {
  totalCards: number;
  itemCount: number;
  itemProbability: number;
  extraActionCount: number;
  extraActionProbability: number;
  expectationBase: ResourceVector;
  expectationFinal: ResourceVector;
  resourceAtLeast: ResourceThresholdMap;
  immediateGains: Record<CardId, ResourceVector>;
};

export const calculateStats = (
  deckState: DeckState,
  conditions: ConditionsState,
  cards: CardDefinition[],
  options: StatsOptions = {},
): DeckComputationResult & { foodExpectation: number } => {
  const immediateGains = cards.reduce<Record<CardId, GainInfo>>(
    (acc, card) => {
      if (card.id === "season_change" && options.seasonExpectation) {
        acc[card.id] = options.seasonExpectation;
      } else {
        acc[card.id] = computeImmediateGain(card, conditions, options);
      }
      return acc;
    },
    {} as Record<CardId, GainInfo>,
  );

  const totalCards = cards.reduce(
    (sum, card) => sum + (deckState[card.id] ?? 0),
    0,
  );

  const itemCount = cards.reduce(
    (sum, card) =>
      sum + (card.isItemCard ? (deckState[card.id] ?? 0) : 0),
    0,
  );

  const extraActionCount = cards.reduce(
    (sum, card) =>
      sum + (card.extraActionCard ? (deckState[card.id] ?? 0) : 0),
    0,
  );

  const expectationBase = zeroVector();
  const expectationFinal = zeroVector();
  let foodExpectationFinal = 0;
  const resourceAtLeast: ResourceThresholdMap = resourceTypes.reduce(
    (acc, resource) => {
      acc[resource] = { 1: 0, 2: 0, 3: 0 };
      return acc;
    },
    {} as ResourceThresholdMap,
  );

  if (totalCards === 0) {
    return {
      totalCards,
      itemCount,
      itemProbability: 0,
      extraActionCount,
      extraActionProbability: 0,
      expectationBase,
      expectationFinal,
      resourceAtLeast,
      immediateGains,
    };
  }

  const cardProbabilities: Partial<Record<CardId, number>> = {};
  const totalVector = zeroVector();
  let totalFood = 0;

  for (const card of cards) {
    const remaining = deckState[card.id] ?? 0;
    if (remaining <= 0) continue;
    const probability = remaining / totalCards;
    cardProbabilities[card.id] = probability;
    const gain = immediateGains[card.id];
    totalVector.fruit += gain.vector.fruit * remaining;
    totalVector.meat += gain.vector.meat * remaining;
    totalVector.fish += gain.vector.fish * remaining;
    totalFood += gain.food * remaining;
  }

  expectationBase.fruit = totalVector.fruit / totalCards;
  expectationBase.meat = totalVector.meat / totalCards;
  expectationBase.fish = totalVector.fish / totalCards;

  for (const card of cards) {
    const probability = cardProbabilities[card.id];
    if (!probability) continue;
    const gain = immediateGains[card.id];

    const restCards = totalCards - 1;
    const restVectorAvg =
      restCards > 0
        ? scaleVector(subtractVectors(totalVector, gain.vector), 1 / restCards)
        : zeroVector();
    const restFoodAvg = restCards > 0 ? (totalFood - gain.food) / restCards : 0;

    const useExtra = card.isGoAgain || card.extraActionCard;
    const effectiveVector = useExtra ? addVectors(gain.vector, restVectorAvg) : gain.vector;
    const effectiveFood = useExtra ? gain.food + restFoodAvg : gain.food;

    const contributionFinal = scaleVector(effectiveVector, probability);
    expectationFinal.fruit += contributionFinal.fruit;
    expectationFinal.meat += contributionFinal.meat;
    expectationFinal.fish += contributionFinal.fish;
    foodExpectationFinal += effectiveFood * probability;

    for (const resource of resourceTypes) {
      const amount = effectiveVector[resource];
      for (const threshold of thresholds) {
        if (amount >= threshold) {
          resourceAtLeast[resource][threshold] += probability;
        }
      }
    }
  }

  return {
    totalCards,
    itemCount,
    itemProbability: itemCount / totalCards,
    extraActionCount,
    extraActionProbability: extraActionCount / totalCards,
    expectationBase,
    expectationFinal,
    resourceAtLeast,
    immediateGains,
    foodExpectation: foodExpectationFinal,
  };
};

export const formatPercentage = (value: number): string =>
  `${(value * 100).toFixed(1)}%`;

export const formatResourceValue = (value: number): string =>
  value.toFixed(2);
