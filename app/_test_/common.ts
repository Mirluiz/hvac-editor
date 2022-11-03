import Pipe from "../2d/models/heating/pipe.model";
import { IVec, Vector } from "../geometry/vect";
import CanvasModel from "../2d/models/canvas.model";
import Line from "../2d/models/geometry/line.model";

export const fittingModel = (model: CanvasModel) => {
  let pipes = model.pipes;
  let step = model.config.net.step / 2;

  // _2Pipes(model, pipes, step);
  _3Pipes(model, pipes, step);
};

const _2Pipes = (model: CanvasModel, pipes: Array<Pipe>, step: number) => {
  /**
   * 90 angle from right to left
   * ------ *
   *        |
   *        |
   *        |
   *
   * Y+ is bottom
   */
  let arraysRL90 = [
    /*
      1 - from left to right
      2 - from top to bottom
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4,
      },
      {
        x1: 10,
        y1: 4,
        x2: 10,
        y2: 10,
      },
    ],
    /*
      1 - from right to left
      2 - from top to bottom
     */
    [
      {
        x1: 10,
        y1: 4,
        x2: 4,
        y2: 4,
      },
      {
        x1: 10,
        y1: 4,
        x2: 10,
        y2: 10,
      },
    ],
    /*
      1 - from left to right
      2 - from bottom to top
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4,
      },
      {
        x1: 10,
        y1: 10,
        x2: 10,
        y2: 4,
      },
    ],
    /*
      1 - from right to left
      2 - from bottom to top
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4,
      },
      {
        x1: 10,
        y1: 10,
        x2: 10,
        y2: 4,
      },
    ],
  ];

  /**
   *  90 angle from left to right
   *    * -------
   *    |
   *    |
   *    |
   */
  let arraysLR90 = [
    /*
      2 - from left to right
      1 - from top to bottom
     */
    [
      {
        x1: 10,
        y1: 4,
        x2: 4,
        y2: 4,
      },
      {
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 10,
      },
    ],
    /*
      1 - from left top to right
      2 - from top to bottom
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4,
      },
      {
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 10,
      },
    ],
    /*
      1 - from right to left
      2 - from bottom to top
     */
    [
      {
        x1: 10,
        y1: 4,
        x2: 4,
        y2: 4,
      },
      {
        x1: 4,
        y1: 10,
        x2: 4,
        y2: 4,
      },
    ],
    /*
      1 - from left to right
      2 - from bottom to top
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4,
      },
      {
        x1: 4,
        y1: 10,
        x2: 4,
        y2: 4,
      },
    ],
  ];

  /**
   *  Down V from 90 angle
   *           *
   *          / \
   *        /    \
   *      /       \
   *    /          \
   */
  let arraysV90Down = [
    /*
      1 - from left to right,
      2 - from left to right
     */
    [
      {
        x1: 4,
        y1: 6,
        x2: 8,
        y2: 2,
      },
      {
        x1: 8,
        y1: 2,
        x2: 12,
        y2: 6,
      },
    ],
    /*
      1 - from right to left,
      2 - from left to right,
     */
    [
      {
        x1: 8,
        y1: 2,
        x2: 4,
        y2: 6,
      },
      {
        x1: 8,
        y1: 2,
        x2: 12,
        y2: 6,
      },
    ],
    /*
     1 - from left to right,
     2 - from right to left,
    */
    [
      {
        x1: 4,
        y1: 6,
        x2: 8,
        y2: 2,
      },
      {
        x1: 12,
        y1: 6,
        x2: 8,
        y2: 2,
      },
    ],
    /*
     1 - from right to left,
     2 - from right to left,
    */
    [
      {
        x1: 8,
        y1: 2,
        x2: 4,
        y2: 6,
      },
      {
        x1: 12,
        y1: 6,
        x2: 8,
        y2: 2,
      },
    ],
  ];

  /**
   *  V form 90 angle
   *   \       /
   *    \     /
   *     \   /
   *      \ /
   *       *
   */
  let arraysV90Up = [
    /*
      1 - from left to right,
      2 - from left to right
     */
    [
      {
        x1: 4,
        y1: 2,
        x2: 8,
        y2: 6,
      },
      {
        x1: 8,
        y1: 6,
        x2: 12,
        y2: 2,
      },
    ],
    /*
      1 - from right to left,
      2 - from left to right,
     */
    [
      {
        x1: 8,
        y1: 6,
        x2: 4,
        y2: 2,
      },
      {
        x1: 8,
        y1: 6,
        x2: 12,
        y2: 2,
      },
    ],
    /*
     1 - from left to right,
     2 - from right to left,
    */
    [
      {
        x1: 4,
        y1: 2,
        x2: 8,
        y2: 6,
      },
      {
        x1: 12,
        y1: 2,
        x2: 8,
        y2: 6,
      },
    ],
    /*
     1 - from right to left,
     2 - from right to left,
    */
    [
      {
        x1: 8,
        y1: 6,
        x2: 4,
        y2: 2,
      },
      {
        x1: 12,
        y1: 2,
        x2: 8,
        y2: 6,
      },
    ],
  ];

  /**
   * Horizontal same angle
   *  --------- * ----------
   */
  let arrays90H = [
    /*
      1 - from left to right
      2 - from left to right,
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 8,
        y2: 4,
      },
      {
        x1: 8,
        y1: 4,
        x2: 12,
        y2: 4,
      },
    ],
    /*
      1 - from right to left
      2 - from left to right,
     */
    [
      {
        x1: 8,
        y1: 4,
        x2: 4,
        y2: 4,
      },
      {
        x1: 8,
        y1: 4,
        x2: 12,
        y2: 4,
      },
    ],
    /*
      1 - from left to right
      2 - from right to left,
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 8,
        y2: 4,
      },
      {
        x1: 12,
        y1: 4,
        x2: 8,
        y2: 4,
      },
    ],
    /*
      1 - from right to left
      2 - from right to left,
     */
    [
      {
        x1: 8,
        y1: 4,
        x2: 4,
        y2: 4,
      },
      {
        x1: 12,
        y1: 4,
        x2: 8,
        y2: 4,
      },
    ],
  ];

  /**
   *  Vertical same angle
   *    |
   *    |
   *    |
   *    *
   *    |
   *    |
   *    |
   */
  let arrays90V = [
    /*
      1 - from top to bottom
      2 - from top to bottom
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 8,
      },
      {
        x1: 4,
        y1: 8,
        x2: 4,
        y2: 12,
      },
    ],
    /*
      1 - from bottom to top
      2 - from top to bottom
     */
    [
      {
        x1: 4,
        y1: 8,
        x2: 4,
        y2: 4,
      },
      {
        x1: 4,
        y1: 8,
        x2: 4,
        y2: 12,
      },
    ],
    /*
      1 - from top to bottom
      2 - from bottom to top
     */
    [
      {
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 8,
      },
      {
        x1: 4,
        y1: 12,
        x2: 4,
        y2: 8,
      },
    ],
    /*
      1 - from bottom to top
      2 - from bottom to top
     */
    [
      {
        x1: 4,
        y1: 8,
        x2: 4,
        y2: 4,
      },
      {
        x1: 4,
        y1: 12,
        x2: 4,
        y2: 8,
      },
    ],
  ];

  [...arraysRL90, ...arraysLR90].map((lines, index) => {
    lines.map((line) => {
      pipes.push(
        new Pipe(
          model,
          new Vector(100 * index + line.x1 * step, line.y1 * step),
          new Vector(100 * index + line.x2 * step, line.y2 * step)
        )
      );
    });
  });

  [...arraysV90Down, ...arraysV90Up].map((lines, index) => {
    lines.map((line) => {
      pipes.push(
        new Pipe(
          model,
          new Vector(100 * index + line.x1 * step, 12 * step + line.y1 * step),
          new Vector(100 * index + line.x2 * step, 12 * step + line.y2 * step)
        )
      );
    });
  });

  arrays90H.map((lines, index) => {
    lines.map((line) => {
      pipes.push(
        new Pipe(
          model,
          new Vector(100 * index + line.x1 * step, 18 * step + line.y1 * step),
          new Vector(100 * index + line.x2 * step, 18 * step + line.y2 * step)
        )
      );
    });
  });

  arrays90V.map((lines, index) => {
    lines.map((line) => {
      pipes.push(
        new Pipe(
          model,
          new Vector(100 * index + line.x1 * step, 22 * step + line.y1 * step),
          new Vector(100 * index + line.x2 * step, 22 * step + line.y2 * step)
        )
      );
    });
  });

  [0, 30, 60, 90].map((a, index) => {
    let pV1 = new Vector(4, 4);
    let pV2 = new Vector(8, 4).rotate(a, pV1);

    let v1 = new Vector(pV2.x, pV2.y);
    let v2 = new Vector(pV2.x + 4, pV2.y).rotate(a, v1);

    pipes.push(
      new Pipe(
        model,
        new Vector(400 + 100 * index + pV1.x * step, 22 * step + pV1.y * step),
        new Vector(400 + 100 * index + pV2.x * step, 22 * step + pV2.y * step)
      )
    );

    pipes.push(
      new Pipe(
        model,
        new Vector(400 + 100 * index + v1.x * step, 22 * step + v1.y * step),
        new Vector(400 + 100 * index + v2.x * step, 22 * step + v2.y * step)
      )
    );
  });

  // horizontal line with angles
  [0, 30, 60, 90, 120, 150, 180].map((a, index) => {
    let pV1 = new Vector(4, 4);
    let pV2 = new Vector(8, 4);

    let v1 = new Vector(8, 4);
    let v2 = new Vector(12, 4).rotate(a, v1);

    pipes.push(
      new Pipe(
        model,
        new Vector(100 * index + pV1.x * step, 32 * step + pV1.y * step),
        new Vector(100 * index + pV2.x * step, 32 * step + pV2.y * step)
      )
    );

    pipes.push(
      new Pipe(
        model,
        new Vector(100 * index + v1.x * step, 32 * step + v1.y * step),
        new Vector(100 * index + v2.x * step, 32 * step + v2.y * step)
      )
    );
  });

  [0, -30, -60, -90, -120, -150, -180].map((a, index) => {
    let pV1 = new Vector(4, 4);
    let pV2 = new Vector(8, 4);

    let v1 = new Vector(8, 4);
    let v2 = new Vector(12, 4).rotate(a, v1);

    pipes.push(
      new Pipe(
        model,
        new Vector(100 * index + pV1.x * step, 42 * step + pV1.y * step),
        new Vector(100 * index + pV2.x * step, 42 * step + pV2.y * step)
      )
    );

    pipes.push(
      new Pipe(
        model,
        new Vector(100 * index + v1.x * step, 42 * step + v1.y * step),
        new Vector(100 * index + v2.x * step, 42 * step + v2.y * step)
      )
    );
  });
};

const _3Pipes = (model: CanvasModel, pipes: Array<Pipe>, step: number) => {
  let combinationGroupOffset = step * 2;
  let yOffsetStep = 10;
  /**
   *   90 angle down
   *
   *   --------- * ----------
   *             |
   *             |
   *             |
   */
  [
    [1, 1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, 1],
    [-1, -1, -1],
  ].map((combination, combinationIndex) => {
    if (combinationIndex > 0) return;
    combination.map((direction, index) => {
      let vec1: IVec;
      let vec2: IVec;

      if (index === 0) {
        if (direction === 1) {
          vec1 = new Vector(4, 4);
          vec2 = new Vector(8, 4);
        } else {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(4, 4);
        }
      } else if (index === 1) {
        if (direction === 1) {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(8, 8);
        } else {
          vec1 = new Vector(8, 8);
          vec2 = new Vector(8, 4);
        }
      } else {
        if (direction === 1) {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(12, 4);
        } else {
          vec1 = new Vector(12, 4);
          vec2 = new Vector(8, 4);
        }
      }

      let offsetX = 100 * (combinationIndex % 8);
      let offsetY = combinationGroupOffset;

      vec1.x = offsetX + vec1.x * step;
      vec1.y = offsetY + vec1.y * step;
      vec2.x = offsetX + vec2.x * step;
      vec2.y = offsetY + vec2.y * step;

      pipes.push(new Pipe(model, vec1, vec2));
    });
  });
  return;
  combinationGroupOffset += yOffsetStep * step;

  /**
   *   90 angle up
   *
   *             |
   *             |
   *             |
   *   --------- * ----------
   */
  [
    [1, 1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, 1],
    [-1, -1, -1],
  ].map((combination, combinationIndex) => {
    combination.map((direction, index) => {
      let vec1: IVec;
      let vec2: IVec;

      if (index === 0) {
        if (direction === 1) {
          vec1 = new Vector(4, 4);
          vec2 = new Vector(8, 4);
        } else {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(4, 4);
        }
      } else if (index === 1) {
        if (direction === 1) {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(8, 0);
        } else {
          vec1 = new Vector(8, 0);
          vec2 = new Vector(8, 4);
        }
      } else {
        if (direction === 1) {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(12, 4);
        } else {
          vec1 = new Vector(12, 4);
          vec2 = new Vector(8, 4);
        }
      }

      let offsetX = 100 * (combinationIndex % 8);
      let offsetY = combinationGroupOffset;

      vec1.x = offsetX + vec1.x * step;
      vec1.y = offsetY + vec1.y * step;
      vec2.x = offsetX + vec2.x * step;
      vec2.y = offsetY + vec2.y * step;

      pipes.push(new Pipe(model, vec1, vec2));
    });
  });

  combinationGroupOffset += yOffsetStep * step;

  /**
   *   90 angle left
   *
   *              |
   *              |
   *    --------- *
   *              |
   *              |
   *
   */
  [
    [1, 1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, 1],
    [-1, -1, -1],
  ].map((combination, combinationIndex) => {
    combination.map((direction, index) => {
      let vec1: IVec;
      let vec2: IVec;

      if (index === 0) {
        if (direction === 1) {
          vec1 = new Vector(8, 0);
          vec2 = new Vector(8, 4);
        } else {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(8, 0);
        }
      } else if (index === 1) {
        if (direction === 1) {
          vec1 = new Vector(4, 4);
          vec2 = new Vector(8, 4);
        } else {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(4, 4);
        }
      } else {
        if (direction === 1) {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(8, 8);
        } else {
          vec1 = new Vector(8, 8);
          vec2 = new Vector(8, 4);
        }
      }

      let offsetX = 100 * (combinationIndex % 8);
      let offsetY = combinationGroupOffset;

      vec1.x = offsetX + vec1.x * step;
      vec1.y = offsetY + vec1.y * step;
      vec2.x = offsetX + vec2.x * step;
      vec2.y = offsetY + vec2.y * step;

      pipes.push(new Pipe(model, vec1, vec2));
    });
  });

  combinationGroupOffset += yOffsetStep * step;
  /**
   *   90 angle right
   *
   *    |
   *    |
   *    *---------
   *    |
   *    |
   *
   */
  [
    [1, 1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, 1],
    [-1, -1, -1],
  ].map((combination, combinationIndex) => {
    combination.map((direction, index) => {
      let vec1: IVec;
      let vec2: IVec;

      if (index === 0) {
        if (direction === 1) {
          vec1 = new Vector(4, 0);
          vec2 = new Vector(4, 4);
        } else {
          vec1 = new Vector(4, 4);
          vec2 = new Vector(4, 0);
        }
      } else if (index === 1) {
        if (direction === 1) {
          vec1 = new Vector(4, 4);
          vec2 = new Vector(8, 4);
        } else {
          vec1 = new Vector(8, 4);
          vec2 = new Vector(4, 4);
        }
      } else {
        if (direction === 1) {
          vec1 = new Vector(4, 4);
          vec2 = new Vector(4, 8);
        } else {
          vec1 = new Vector(4, 8);
          vec2 = new Vector(4, 4);
        }
      }

      let offsetX = 100 * (combinationIndex % 8);
      let offsetY = combinationGroupOffset;

      vec1.x = offsetX + vec1.x * step;
      vec1.y = offsetY + vec1.y * step;
      vec2.x = offsetX + vec2.x * step;
      vec2.y = offsetY + vec2.y * step;

      pipes.push(new Pipe(model, vec1, vec2));
    });
  });

  combinationGroupOffset += yOffsetStep * step;
};
