import { postJSON } from "@/utils/post";
import { REQ } from "../requestUrl";
import { get } from "@/utils/get";

/**=========================test========================== */
/**
 * @description test
 * @param {主题表单} data
 */
const getVariableTree = function queryVariableTreeWithProject(data) {
  return postJSON(
    `/meta/api/sdlmeta/v1/sdl/mit/queryVariableTreeWithProject.do?ddiUrn=${data}&bgqb=`,
    {
      postData: JSON.stringify({
        data: [],
      }),
    }
  );
};

const queryIndicator = (data) => get(REQ.queryIndicatorUrl + data);
export {
  getVariableTree,
};
