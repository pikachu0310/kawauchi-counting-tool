import { describe, expect, it } from "vitest";

import { cardDefinitions, createInitialDeckState } from "../data/cardDefinitions";
import type { DeckState } from "../types";
import { calculateStats } from "./calculateStats";

const baseConditions = {
  hasHigherCharRoomPlayer: false,
  isMinCharPlayer: false,
  favoriteSelection: {
    fruit: true,
    meat: false,
    fish: false,
  },
};

const createEmptyDeck = (): DeckState =>
  cardDefinitions.reduce<DeckState>((acc, card) => {
    acc[card.id] = 0;
    return acc;
  }, {} as DeckState);

describe("calculateStats", () => {
  it("counts initial deck metrics", () => {
    const deck = createInitialDeckState();
    const stats = calculateStats(deck, baseConditions, cardDefinitions);

    expect(stats.totalCards).toBe(48);
    expect(stats.itemCount).toBe(10);
    expect(stats.itemProbability).toBeCloseTo(10 / 48, 6);
    expect(stats.extraActionCount).toBe(1);
    expect(stats.extraActionProbability).toBeCloseTo(1 / 48, 6);
  });

  it("handles go-again cards when computing expectations", () => {
    const deck = createEmptyDeck();
    deck.go_again_fruit = 1;
    deck.gather_meat2 = 1;

    const stats = calculateStats(deck, baseConditions, cardDefinitions);

    expect(stats.totalCards).toBe(2);
    expect(stats.expectationBase.fruit).toBeCloseTo(0.5, 5);
    expect(stats.expectationBase.meat).toBeCloseTo(1, 5);
    expect(stats.expectationFinal.fruit).toBeCloseTo(0.75, 5);
    expect(stats.expectationFinal.meat).toBeCloseTo(1.5, 5);

    expect(stats.resourceAtLeast.fruit[1]).toBeCloseTo(0.5, 5);
    expect(stats.resourceAtLeast.meat[2]).toBeCloseTo(0.5, 5);
  });

  it("returns zeroes for empty deck", () => {
    const stats = calculateStats(createEmptyDeck(), baseConditions, cardDefinitions);

    expect(stats.totalCards).toBe(0);
    expect(stats.itemProbability).toBe(0);
    expect(stats.expectationFinal.fruit).toBe(0);
    expect(stats.resourceAtLeast.fish[1]).toBe(0);
  });
});
