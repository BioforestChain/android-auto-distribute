import { getAllHandle } from "./handle/index.tsx";
import { getAllMetadata } from "./metadata/index.tsx";
import { getAllResource } from "./resource/index.tsx";
import { getAllScreenshot } from "./screenshot/index.tsx";

export const APP_METADATA = await getAllMetadata();

export const UpdateHandle = await getAllHandle();

/**静态文件资源地址 */
export const RESOURCES = await getAllResource();
console.log(RESOURCES);

export const SCREENSHOTS = (await getAllScreenshot()).screenshots;
