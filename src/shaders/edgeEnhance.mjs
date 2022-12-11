import convolute from './convolute.mjs';

export default function (canvas, ctx) {
  // Apply the filter and then put the new pixel data
  ctx.putImageData(
    convolute(
      ctx,
      ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ),
      [
        0, 0, 0,
        -1,  1, 0,
        0, 0, 0
      ],
      true
    ),
    0,
    0
  );
};
