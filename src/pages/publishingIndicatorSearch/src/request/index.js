import { postJSON } from "@/utils/post";
/**
 * @description 查询表格数据
 * @returns
 */
export const reqTableData = (
    folderId,
    themeCode = "",
    searchType = "1",
    layout,
    measures
) => {
    let measure = [];
    if (searchType === "2") {
        measure = measures;
    }

    return postJSON("/api/dqpublish/v1/relaeseVariable/queryDataGird.do", {
        postData: JSON.stringify({
            data: [
                { vtype: "attr", name: "sjgsd", data: "46" },
                {
                    vtype: "attr",
                    name: "measures",
                    data: measure,
                },
                {
                    vtype: "attr",
                    name: "themeCode",
                    data: themeCode,
                },
                {
                    vtype: "attr",
                    name: "folderId",
                    data: folderId,
                },
                {
                    vtype: "attr",
                    name: "layout",
                    data: layout,
                },
                {
                    vtype: "attr",
                    name: "searchType",
                    data: searchType,
                },
            ],
        }),
    });
};

/**
 *
 * @returns
 */
export const queryShemeList = () => {
    return postJSON("/api/dqpublish/v1/relaeseVariable/queryShemeList.do");
};
/**
 * 查询发布指标数
 * @returns
 */
export const getRelaeseVariableTree = (themeCode) => {
    return postJSON(
        "/api/dqpublish/v1/relaeseVariable/getRelaeseVariableTree.do", {
            postData: JSON.stringify({
                data: [{ vtype: "attr", name: "themeCode", data: themeCode }],
            }),
        }
    );
};
/**
 *
 * @param {String} themeCode 主题信息
 * @param {String} folderId 文件夹id
 * @returns
 */
export const queryVariableByFolderId = (themeCode, folderId) => {
    return postJSON(
        "/api/dqpublish/v1/relaeseVariable/queryVariableByFolderId.do", {
            postData: JSON.stringify({
                data: [
                    { vtype: "attr", name: "themeCode", data: themeCode },
                    { vtype: "attr", name: "folderId", data: folderId },
                ],
            }),
        }
    );
};

export const calculate = (dataGrid, operation) => {
    return postJSON("/api/dqpublish/v1/relaeseVariable/calculate.do", {
        postData: JSON.stringify({
            data: [
                { vtype: "attr", name: "dataGrid", data: dataGrid },
                {
                    vtype: "attr",
                    name: "operation",
                    data: {
                        label: operation[1].split(",")[1],
                        value: operation[1].split(",")[0],
                        calculateType: operation[0],
                    },
                },
            ],
        }),
    });
};