import { loadImage, normalizeSkin } from "./utils";

let shadingPromise: Promise<HTMLImageElement> | null = null;
let backdropPromise: Promise<HTMLImageElement> | null = null;
let failedPromise: Promise<HTMLImageElement> | null = null;

function getShading(): Promise<HTMLImageElement> {
	shadingPromise ??= loadImage("/20x20pshading.png").catch((err) => {
		shadingPromise = null;
		throw err;
	});
	return shadingPromise;
}

function getBackdrop(): Promise<HTMLImageElement> {
	backdropPromise ??= loadImage("/backdropshading.png").catch((err) => {
		backdropPromise = null;
		throw err;
	});
	return backdropPromise;
}

function getFailed(): Promise<HTMLImageElement> {
	failedPromise ??= loadImage("/PFP/notFound.png").catch((err) => {
		failedPromise = null;
		throw err;
	});
	return failedPromise;
}

async function generatePfp(skin: string | null, ctx: CanvasRenderingContext2D) {
	try {
		if (!skin) {
			await drawFailed(ctx);
			return;
		}
		const [rawSkin, shading, backdrop] = await Promise.all([
			loadImage(skin),
			getShading(),
			getBackdrop()
		]);
		const skinImage = normalizeSkin(rawSkin);

		ctx.clearRect(0, 0, 300, 300);
		ctx.drawImage(backdrop, 0, 0, 20, 20);

		if (skinImage.height === 32) {
			ctx.drawImage(skinImage, 8, 9, 7, 7, 8, 4, 7, 7); // Head (bottom layer)
			ctx.drawImage(skinImage, 5, 9, 3, 7, 5, 4, 3, 7); // Head Side (bottom layer)
			ctx.drawImage(skinImage, 44, 20, 3, 7, 12, 13, 3, 7); // Arm Right Side (bottom layer)
			ctx.drawImage(skinImage, 21, 20, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (bottom layer)
			ctx.drawImage(skinImage, 20, 21, 8, 8, 6, 12, 8, 8); // Chest Other (Bottom layer)
			ctx.drawImage(skinImage, 44, 20, 3, 7, 5, 13, 3, 7); // Arm Left Side (bottom layer)
			ctx.drawImage(skinImage, 40, 9, 7, 7, 8, 4, 7, 7); // Head (top layer)
			ctx.drawImage(skinImage, 33, 9, 3, 7, 5, 4, 3, 7); // Head Side (top layer)
		} else {
			// * BOTTOM LAYER
			ctx.drawImage(skinImage, 8, 9, 7, 7, 8, 4, 7, 7); // Head (bottom layer)
			ctx.drawImage(skinImage, 5, 9, 3, 7, 5, 4, 3, 7); // Head Side (bottom layer)
			ctx.drawImage(skinImage, 36, 52, 3, 7, 12, 13, 3, 7); // Arm Right Side (bottom layer)
			ctx.drawImage(skinImage, 21, 20, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (bottom layer)
			ctx.drawImage(skinImage, 20, 21, 8, 8, 6, 12, 8, 8); // Chest Other (Bottom layer)
			ctx.drawImage(skinImage, 44, 20, 3, 7, 5, 13, 3, 7); // Arm Left Side (bottom layer)

			// * TOP LAYER
			ctx.drawImage(skinImage, 40, 9, 7, 7, 8, 4, 7, 7); // Head (top layer)
			ctx.drawImage(skinImage, 33, 9, 3, 7, 5, 4, 3, 7); // Head Side (top layer)
			ctx.drawImage(skinImage, 52, 52, 3, 7, 12, 13, 3, 7); // Arm Right Side (top layer)
			ctx.drawImage(skinImage, 52, 36, 3, 7, 5, 13, 3, 7); // Arm Left Side (top layer)
			ctx.drawImage(skinImage, 20, 37, 8, 8, 6, 12, 8, 8); // Chest Other (top layer)
			ctx.drawImage(skinImage, 21, 36, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (top layer)
		}

		ctx.drawImage(shading, 0, 0, 20, 20);
	} catch (e) {
		await drawFailed(ctx);
	}
}

async function drawFailed(ctx: CanvasRenderingContext2D) {
	try {
		const [failed, shading, backdrop] = await Promise.all([
			getFailed(),
			getShading(),
			getBackdrop()
		]);

		ctx.clearRect(0, 0, 300, 300);
		ctx.drawImage(backdrop, 0, 0, 20, 20);
		ctx.resetTransform();
		ctx.drawImage(failed, 0, 0, 300, 300);
		ctx.scale(16, 16);
		ctx.drawImage(shading, 0, 0, 20, 20);
	} catch {
		// Fallback clear if even error assets fail
		ctx.clearRect(0, 0, 300, 300);
	}
}

export default generatePfp;
