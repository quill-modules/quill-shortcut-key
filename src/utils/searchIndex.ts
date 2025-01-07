import type { MenuItems } from './types';

export class SearchIndex {
  private index: Map<string, Set<MenuItems>> = new Map();
  private items: MenuItems[] = [];
  private readonly SCORE_THRESHOLD = 40;

  constructor(menuItems: MenuItems[]) {
    this.items = menuItems;
    this.buildIndex();
  }

  private buildIndex(): void {
    for (const item of this.items) {
      this.addToIndex(item.name.toLowerCase(), item);
      for (const alias of item.alias) {
        this.addToIndex(alias.toLowerCase(), item);
      }
    }
  }

  private addToIndex(text: string, item: MenuItems): void {
    this.addTermToIndex(text, item);
    for (let i = 0; i < text.length - 1; i++) {
      for (let j = i + 2; j <= Math.min(text.length, i + 5); j++) {
        this.addTermToIndex(text.slice(i, j), item);
      }
    }
  }

  private addTermToIndex(term: string, item: MenuItems): void {
    if (!this.index.has(term)) {
      this.index.set(term, new Set());
    }
    this.index.get(term)!.add(item);
  }

  /**
   * 更快的字符串相似度计算方法
   * 时间复杂度: O(n+m)
   */
  private getQuickSimilarity(str1: string, str2: string): number {
    // 创建字符频率映射
    const freq = new Map<string, number>();

    // 统计第一个字符串中字符出现次数
    for (const char of str1) {
      freq.set(char, (freq.get(char) || 0) + 1);
    }

    // 计算共同字符数
    let common = 0;
    for (const char of str2) {
      const count = freq.get(char);
      if (count && count > 0) {
        common++;
        freq.set(char, count - 1);
      }
    }

    return (common * 2) / (str1.length + str2.length) * 50;
  }

  search(query: string): MenuItems[] {
    query = query.toLowerCase();
    const scores = new Map<MenuItems, number>();
    const seen = new Set<MenuItems>();

    // 精确匹配 (100分)
    const exactMatches = this.index.get(query) || new Set();
    for (const item of exactMatches) {
      scores.set(item, 100);
      seen.add(item);
    }

    // 包含匹配 (60-80分)
    for (const item of this.items) {
      if (seen.has(item)) continue;

      const allTexts = [item.name.toLowerCase(), ...item.alias.map(a => a.toLowerCase())];
      let maxScore = 0;

      for (const text of allTexts) {
        if (text.includes(query)) maxScore = Math.max(maxScore, 80);
        else if (query.includes(text)) maxScore = Math.max(maxScore, 60);
      }

      if (maxScore > 0) {
        scores.set(item, maxScore);
        seen.add(item);
      }
    }

    // 部分匹配 (40-50分)，使用更快的相似度计算
    if (query.length > 1) {
      for (const item of this.items) {
        if (!seen.has(item)) {
          const allTexts = [item.name.toLowerCase(), ...item.alias.map(a => a.toLowerCase())];
          const maxPartialScore = Math.max(
            ...allTexts.map(text => this.getQuickSimilarity(query, text)),
          );

          if (maxPartialScore >= this.SCORE_THRESHOLD) {
            scores.set(item, maxPartialScore);
          }
        }
      }
    }

    return [...scores.entries()]
      .filter(([_, score]) => score >= this.SCORE_THRESHOLD)
      .sort((a, b) => b[1] - a[1])
      .map(([item]) => item);
  }
}
