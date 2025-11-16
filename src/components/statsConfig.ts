export const resourceLabels = {
  fruit: "果物",
  meat: "お肉",
  fish: "お魚",
} as const;

export const resourceColors: Record<keyof typeof resourceLabels, string> = {
  fruit: "#22c55e",
  meat: "#ef4444",
  fish: "#3b82f6",
};

export const thresholds = [
  { key: 1, label: "1 枚以上" },
  { key: 2, label: "2 枚以上" },
  { key: 3, label: "3 枚以上" },
] as const;
