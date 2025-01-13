import type { SearchIndexInput } from './types';

function matchScore(input: string, target: string): number {
  const inputLower = input.toLowerCase();
  const targetLower = target.toLowerCase();

  if (inputLower === targetLower) {
    return 2; // 完全匹配
  }
  else if (targetLower.includes(inputLower)) {
    return 1; // 部分匹配
  }
  else {
    return 0; // 不匹配
  }
}

export function searchAndSort<T extends SearchIndexInput[]>(items: T, input: string): T {
  const threshold = 0.5; // 匹配分数阈值

  const scoredItems = items.map((item) => {
    let score = matchScore(input, item.name);

    if (item.alias) {
      for (const alias of item.alias) {
        score = Math.max(score, matchScore(input, alias));
      }
    }

    return { item, score };
  });

  const filteredItems = scoredItems.filter(({ score }) => score >= threshold);
  filteredItems.sort((a, b) => b.score - a.score);
  return filteredItems.map(({ item }) => item) as T;
}
