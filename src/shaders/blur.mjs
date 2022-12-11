import convolute from './convolute.mjs';

export default function (canvas, ctx, { value } = {}) {
  const ONE_NINTH = 1 / 9;
  let strength = value || 1,
    loop,
    pixelData;

  pixelData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  for (loop = 0; loop < strength; loop++) {
    pixelData = convolute(
      ctx,
      pixelData,
      [
        ONE_NINTH, ONE_NINTH, ONE_NINTH,
        ONE_NINTH, ONE_NINTH, ONE_NINTH,
        ONE_NINTH, ONE_NINTH, ONE_NINTH
      ]
    );
  }

  // Put the new pixel data
  ctx.putImageData(
    pixelData,
    0,
    0
  );
};
