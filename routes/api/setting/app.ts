import { getAllHandle } from "./handle/index.tsx";
import { getAllMetadata } from "./metadata/index.tsx";
import { getAllResource } from "./resource/index.tsx";
import { getAllScreenshot } from "./screenshot/index.tsx";

/**配置资源地址，现在将从用户的配置中读取 */

export const APP_METADATA = await getAllMetadata();

export const UpdateHandle = await getAllHandle();

export const RESOURCES = await getAllResource();

export const SCREENSHOTS = (await getAllScreenshot()).screenshots;
