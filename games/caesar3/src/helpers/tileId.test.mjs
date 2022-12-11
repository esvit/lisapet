import { getIdByTile, getTileById } from './tileId.mjs';

describe('tileId', () => {
  const TEST_CASES = {
    244: ['plateau', 44],
    2779: ["housng1a", 1],
    2801: ["housng1a", 23],
    2829: ["housng1a", 51],
    2872: ["commerce", 1],
    3038: ["commerce", 167],
    3165: ["security", 1],
    3209: ["security", 45],
    3225: ["security", 61],
    2830: ["utilitya", 1],
    2863: ["utilitya", 34], // резервуар
    2871: ["utilitya", 42],
    3119: ["entertainment", 81],
    3154: ["entertainment", 116], // сенат
    3158: ["govt", 4], // сенат
    3226: ["transport", 1],
    3281: ["transport", 56], // пост інженера
    3318: ["transport", 93],
  };

  test('getTileById', () => {
    for (const tileId in TEST_CASES) {
      expect(getTileById(Number(tileId))).toEqual(TEST_CASES[tileId]);
    }
  });

  test('getTileById', () => {
    for (const tileId in TEST_CASES) {
      expect(getIdByTile(TEST_CASES[tileId])).toEqual(Number(tileId));
    }
  });
});
