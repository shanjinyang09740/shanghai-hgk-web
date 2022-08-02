export * from "./modules/globalIdentification";
import { postJSON } from "@/utils/post";
import { REQ } from "./requestUrl";

const queryData = (codeListId) => postJSON(`${REQ.queryDataUrl}${codeListId}`);
export { queryData };
