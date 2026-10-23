import { describe, it, expect } from 'vitest';
import { searchKaggas } from '../src/search/ranker';
import { GOLDEN_SEARCH_TEST_SET } from './goldenSearchCases';

describe('Search Quality & Relevance Benchmark', () => {
  it('executes the full golden search test set with verified metrics', () => {
    let top1Hits = 0;
    let top1Tested = 0;

    let inTop5Hits = 0;
    let inTop5Tested = 0;

    let inTop10Hits = 0;
    let inTop10Tested = 0;

    let zeroResultHits = 0;
    let zeroResultTested = 0;

    const latencies: number[] = [];

    for (const testCase of GOLDEN_SEARCH_TEST_SET) {
      const startTime = performance.now();
      const results = searchKaggas(testCase.query, 10);
      const elapsed = performance.now() - startTime;
      latencies.push(elapsed);
      if (testCase.expectedInTop10) {
        console.log(`[${testCase.id}] query: "${testCase.query}", top 10 IDs:`, results.map(r => r.kagga.id));
      }


      // Verify exact count if expected (e.g. 0 for invalid or nonsense)
      if (testCase.expectedCount !== undefined) {
        zeroResultTested++;
        if (results.length === testCase.expectedCount) {
          zeroResultHits++;
        }
        expect(results.length).toBe(testCase.expectedCount);
      }

      // Verify Top 1 accuracy
      if (testCase.expectedTopId !== undefined) {
        top1Tested++;
        const topResult = results[0];
        const isMatch = topResult && topResult.kagga.id === testCase.expectedTopId;
        if (isMatch) top1Hits++;
        expect(topResult?.kagga.id).toBe(testCase.expectedTopId);
      }

      // Verify Precision in Top 5
      if (testCase.expectedInTop5 !== undefined) {
        inTop5Tested++;
        const top5Ids = results.slice(0, 5).map((r) => r.kagga.id);
        const hasAny = testCase.expectedInTop5.some((id) => top5Ids.includes(id));
        if (hasAny) inTop5Hits++;
        expect(hasAny).toBe(true);
      }

      // Verify Recall in Top 10
      if (testCase.expectedInTop10 !== undefined) {
        inTop10Tested++;
        const top10Ids = results.slice(0, 10).map((r) => r.kagga.id);
        const hasAny = testCase.expectedInTop10.some((id) => top10Ids.includes(id));
        if (hasAny) inTop10Hits++;
        expect(hasAny).toBe(true);
      }

      // Verify theme query consistency
      if (testCase.mustHaveTheme) {
        for (const res of results) {
          expect(res.kagga.themes).toContain(testCase.mustHaveTheme);
        }
      }
    }

    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const top1Accuracy = (top1Hits / top1Tested) * 100;
    const zeroAccuracy = (zeroResultHits / zeroResultTested) * 100;

    console.log('\n--- SEARCH BENCHMARK RESULTS ---');
    console.log(`Total test queries: ${GOLDEN_SEARCH_TEST_SET.length}`);
    console.log(`Top-1 Accuracy: ${top1Accuracy.toFixed(1)}% (${top1Hits}/${top1Tested})`);
    console.log(`Zero-Result Accuracy: ${zeroAccuracy.toFixed(1)}% (${zeroResultHits}/${zeroResultTested})`);
    console.log(`Average Query Latency: ${avgLatency.toFixed(2)} ms`);

    // Quality gate assertions
    expect(top1Accuracy).toBe(100); // 100% Top-1 accuracy on golden set
    expect(zeroAccuracy).toBe(100);
    expect(avgLatency).toBeLessThan(25); // Latency must be < 25ms
  });
});
