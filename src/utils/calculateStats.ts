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

const favoriteMap: Record<ConditionsState["distinctPreferences"], ResourceVector> =
  {
    1: { fruit: 2, meat: 0, fish: 0 },
    2: { fruit: 2, meat: 2, fish: 0 },
    3: { fruit: 2, meat: 2, fish: 2 },
  };

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

const computeImmediateGain = (
  card: CardDefinition,
  conditions: ConditionsState,
): ResourceVector => {
  const baseVector =
    card.id === "everyone_favorite"
      ? favoriteMap[conditions.distinctPreferences]
      : card.baseGain;

  let gain = { ...baseVector };

  if (card.conditionalGain) {
    for (const entry of card.conditionalGain) {
      if (conditionSatisfied(entry.condition, conditions)) {
        gain = addVectors(gain, entry.gain);
      }
    }
  }

  return gain;
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
): DeckComputationResult => {
  const immediateGains = cards.reduce<Record<CardId, ResourceVector>>(
    (acc, card) => {
      acc[card.id] = computeImmediateGain(card, conditions);
      return acc;
    },
    {} as Record<CardId, ResourceVector>,
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

  for (const card of cards) {
    const remaining = deckState[card.id] ?? 0;
    if (remaining <= 0) continue;
    const probability = remaining / totalCards;
    cardProbabilities[card.id] = probability;
    const gain = immediateGains[card.id];

    const contributionBase = scaleVector(gain, probability);
    expectationBase.fruit += contributionBase.fruit;
    expectationBase.meat += contributionBase.meat;
    expectationBase.fish += contributionBase.fish;

    for (const resource of resourceTypes) {
      const amount = gain[resource];
      for (const threshold of thresholds) {
        if (amount >= threshold) {
          resourceAtLeast[resource][threshold] += probability;
        }
      }
    }
  }

  for (const card of cards) {
    const probability = cardProbabilities[card.id];
    if (!probability) continue;
    const gain = immediateGains[card.id];
    const effectiveGain = card.isGoAgain
      ? addVectors(gain, expectationBase)
      : gain;
    const contributionFinal = scaleVector(effectiveGain, probability);
    expectationFinal.fruit += contributionFinal.fruit;
    expectationFinal.meat += contributionFinal.meat;
    expectationFinal.fish += contributionFinal.fish;
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
  };
};

export const formatPercentage = (value: number): string =>
  `${(value * 100).toFixed(1)}%`;

export const formatResourceValue = (value: number): string =>
  value.toFixed(2);
