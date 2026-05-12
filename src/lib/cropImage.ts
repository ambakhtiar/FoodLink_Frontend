export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    targetSize = 320
): Promise<Blob | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return null;
    }

    // 1. First, draw the rotated image on a safe-area canvas
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = safeArea;
    tempCanvas.height = safeArea;
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) return null;

    tempCtx.translate(safeArea / 2, safeArea / 2);
    tempCtx.rotate((rotation * Math.PI) / 180);
    tempCtx.translate(-safeArea / 2, -safeArea / 2);

    tempCtx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    );

    // 2. Extract the cropped area and scale it to the targetSize
    canvas.width = targetSize;
    canvas.height = targetSize;

    ctx.drawImage(
        tempCanvas,
        Math.round(safeArea / 2 - image.width * 0.5 + pixelCrop.x),
        Math.round(safeArea / 2 - image.height * 0.5 + pixelCrop.y),
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetSize,
        targetSize
    );

    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            resolve(file);
        }, "image/jpeg", 0.95);
    });
}
