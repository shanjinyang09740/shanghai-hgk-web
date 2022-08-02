import Layout from "@/pages/Layout";
import IndexPage from "@/pages/indexPage";
import PublishingIndicatorSearch from "@/pages/publishingIndicatorSearch";
import AllTables from "@/pages/allTables";
import AllTablesDetail from "@/pages/allTables/detail";
import Statistics from "@/pages/statistics";
import InformationVisual from "@/pages/informationVisual";
import InformationVisualdetail from "@/pages/informationVisual/module/detail";
import KeyWordQuery from "@/pages/keyWordQuery";
import KeyWordQuerydetail from "@/pages/keyWordQuery/detail";

export default [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    name: "首页",
    children: [
      {
        path: "home",
        name: "首页",
        component: IndexPage,
        meta: { title: "首页", icon: "" },
      },
    ],
  },
  {
    path: "/publishingIndicatorSearch",
    component: Layout,
    redirect: "/publishingIndicatorSearch/ndsj",
    name: "年度数据",
    children: [
      {
        path: "ndsj",
        name: "年度数据",
        component: PublishingIndicatorSearch,
        meta: { title: "年度数据", name: "ndsj" },
      },
    ],
  },
  {
    path: "/publishingIndicatorSearch",
    component: Layout,
    redirect: "/publishingIndicatorSearch/jdsj",
    name: "进度数据",
    children: [
      {
        path: "jdsj",
        name: "进度数据",
        component: PublishingIndicatorSearch,
        meta: { title: "进度数据", name: "jdsj" },
      },
    ],
  },
  {
    path: "/allTablesQuery",
    component: Layout,
    redirect: "/allTablesQuery/zbsj",
    name: "整表数据",
    children: [
      {
        path: "zbsj",
        name: "整表数据",
        component: AllTables,
        meta: { title: "整表数据", name: "zbsj", icon: "" },
      },
      {
        path: "zbsjDetail",
        name: "instrumentDetail",
        component: AllTablesDetail,
        meta: { title: "整表数据", icon: "" },
      },
    ],
  },
  {
    path: "/allTablesQuery2",
    component: Layout,
    redirect: "/allTablesQuery2/pcsj",
    name: "普查数据",
    children: [
      {
        path: "pcsj",
        name: "普查数据",
        component: AllTables,
        meta: { title: "普查数据", name: "pcsj", icon: "" },
      },
      {
        path: "pcsjDetail",
        name: "pcsjDetail",
        component: AllTablesDetail,
        meta: { title: "普查数据", icon: "" },
      },
    ],
  },
  {
    path: "/statisticsQuery",
    component: Layout,
    redirect: "/statisticsQuery/tjxx",
    name: "分析资料",
    children: [
      {
        path: "tjxx",
        name: "统计信息",
        component: Statistics,
        meta: { title: "统计信息", icon: "" },
      },
    ],
  },
  {
    path: "/informationVisual",
    component: Layout,
    redirect: "/informationVisual/kshxx",
    name: "可视化信息",
    children: [
      {
        path: "kshxx",
        name: "可视化信息",
        component: InformationVisual,
        meta: { title: "可视化信息", icon: "" },
      },
      {
        path: "kshxxDetail",
        name: "kshxxDetail",
        component: InformationVisualdetail,
        meta: { title: "可视化信息", icon: "" },
      },
    ],
  },
  {
    path: "/keyWordQuery",
    component: Layout,
    redirect: "/keyWordQuery/search",
    name: "检索",
    children: [
      {
        path: "search",
        name: "检索",
        component: KeyWordQuery,
        meta: { title: "检索", icon: "" },
      },
      {
        path: "keyDetail",
        name: "检索",
        component: KeyWordQuerydetail,
        meta: { title: "检索", icon: "" },
      },
    ],
  },
];
