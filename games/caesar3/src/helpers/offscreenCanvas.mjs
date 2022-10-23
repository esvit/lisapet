export
function createOffscreenCanvas(w, h) {
    const isOffscreen = typeof OffscreenCanvas !== 'undefined';
    let canvas;
    if (typeof document === 'undefined') {
        canvas = {
            getContext: () => ({})
        };
    } else {
        canvas = isOffscreen ? new OffscreenCanvas(w, h) : document.createElement('canvas');
    }
    canvas.width = w;
    canvas.height = h;
    canvas.isOffscreen = isOffscreen;

    return {
        width: w,
        height: h,
        getContext: canvas.getContext.bind(canvas),
        getImage() {
            if (isOffscreen) {
                return canvas.transferToImageBitmap();
            }
            return canvas;
        }
    };
}
