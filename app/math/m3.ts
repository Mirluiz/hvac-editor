export const m3 = {
  identity: (): Array<number> => {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  },
  projection: (width: number, height: number): Array<number> => {
    // prettier-ignore
    return [
      2 / width, 0, 0,
      0, -2 / height, 0, //
      -1, 1, 1, //
    ];
  },

  translation: (tx: number, ty: number): Array<number> => {
    // prettier-ignore
    return [
      1, 0, 0,
      0, 1, 0, //
      tx, ty, 1, //
    ];
  },

  multiply: (a: Array<number>, b: Array<number>): Array<number> => {
    return a.map((number, index) => {
      let offsetX = 3 * Math.floor(index / 3);

      let offsetY = index % 3;
      return (
        a[offsetX] * b[offsetY] +
        a[offsetX + 1] * b[3 + offsetY] +
        a[offsetX + 2] * b[6 + offsetY]
      );
    });
  },
};
