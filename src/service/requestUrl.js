export const REQ = {
  //首页
  hotListUrl: "/api/dqpublish/fbk/queryHotWord.do", //热词列表
  getItemCounts: "/api/macrodata/v1/hgk/mdservice/queryMdItemCounts.do", //元数据数量查询
  getHomePageVisualProduct:
    "/api/macrodata/v1/hgk/visualProduct/getHomePageVisualProduct.do", //查询首页用到的可视化分析产品
  getSjjdObj:
    "/api/macrodata/v1/hgk/dareport/getPublishReportInfoBySubjectType.do?type=3_6", //首页数据解读接口
  getTjfxObj:
    "/api/macrodata/v1/hgk/dareport/getPublishReportInfoBySubjectType.do?type=2_4", //首页统计分析接口
  getTjzsObj:
    "/api/macrodata/v1/hgk/dareport/getPublishReportInfoBySubjectType.do?type=7_8", //首页统计知识接口
  getZxsjObj:
    "/api/macrodata/v1/hgk/dareport/getPublishReportInfoBySubjectType.do?type=1_9", //首页最新数据接口
  //整表页面
  tjxxUrl: "/api/dqpublish/v1/dataInterpretation/pageQueryHGKSjjd.do", //数据解读列表
  getSurveySystem: "/api/dqpublish/v1/fulltable/queryInvestigationSystem.do", //调查制度接口
  queryBGQ: "/api/macrodata/v1/macroReportController/queryBGQ.do", //报告期下拉查询
  queryBGQ1: "“/api/dqpublish/v1/fulltable/queryBgq.do”", //报告期下拉查询
  getSurveyGroup:
    "/api/dqpublish/v1/fulltable/queryInvestigationTaskBySystem.do", //调查任务查询接口
  getSurveyTask: "/api/dqpublish/v1/fulltable/queryReportGroupingByTask.do", //报告分组查询接口
  searchAllTable: "/api/dqpublish/v1/fulltable/queryFullTableList.do", //整表查询接口
  //热词搜索页面
  queryHtmlByLable: "/api/dqpublish/v1/relaeseVariable/queryHtmlByWord.do", //通过指标名模糊查询发布指标所在整表信息
  queryVariableHtmlByLable:
    "/api/dqpublish/v1/relaeseVariable/queryVariableHtmlByLable.do", //通过指标名模糊查询发布指标信息
  //统计页面
  pageQueryHGKSjjd: "/api/dqpublish/v1/dataInterpretation/pageQueryHGKSjjd.do", //统计列表页
  queryCqHGKSjjdTypeList:
    "/api/dqpublish/v1/dataInterpretation/queryCqHGKSjjdTypeList.do", //统计左侧菜单栏
  themeListUrl: "/api/dqpublish/v1/fulltable/queryIndexclassificationList.do", //数据主题列表
  visualListUrl: "/api/bi/v1/dataview/dataviewlist.do", //可视化产品列表
  macroListUrl: "/api/dqpublish/mainIndicator/queryList.do", //宏观指标图解---指标列表
  macroPicDataUrl: "/api/dqpublish/mainIndicator/queryData.do", //宏观指标图解---图形数据
  downLoadBb: "/api/dqpublish/v1/fulltable/downLoadBb.do", //报表下载
  getReportHtmlByCondition:
    "/api/dqpublish/v1/fulltable/getReportHtmlByCondition.do", //整表查询html页面---切换报告期
  queryInstrumentBGQ: "/api/dqpublish/v1/fulltable/queryBgq.do", //整表详情报告期下拉查询
};
