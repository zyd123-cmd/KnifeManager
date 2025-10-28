import {createWebHistory, createRouter} from 'vue-router'
/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
 noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
 icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
 breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
 activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
 }
 */

// 公共路由
export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/register'),
        hidden: true
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import('@/views/error/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error/401'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/index',
                component: () => import('@/views/index'),
                name: 'Index',
                meta: {title: '首页', icon: 'dashboard', affix: true}
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'profile/:activeTab?',
                component: () => import('@/views/system/user/profile/index'),
                name: 'Profile',
                meta: {title: '个人中心', icon: 'user'}
            }
        ]
    },
    // 库存管理 - 班组长
    // {
    //     name: "ToolManagement",
    //     path: "/toolManagement",
    //     hidden: false,
    //     redirect: "noRedirect",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "库存",
    //         icon: "system",
    //         noCache: false,
    //         link: null,
    //     },
    //     children: [
    //         // 刀头管理
    //         {
    //             name: "DaoTouManagement",
    //             path: "daoTouManagement",
    //             hidden: false,
    //             component: () => import('@/views/toolManagement/daoTouManagement/index'),
    //             meta: {
    //                 title: "刀头管理",
    //                 icon: "system",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //         // 刀柄管理
    //         {
    //             name: "DaoBingManagement",
    //             path: "daoBingManagement",
    //             hidden: false,
    //             component: () => import('@/views/toolManagement/daoBingManagement/index'),
    //             meta: {
    //                 title: "刀柄管理",
    //                 icon: "system",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //         // 品牌管理
    //         {
    //             name: "BrandInfo",
    //             path: "brandInfo",
    //             hidden: false,
    //             component: () => import('@/views/consumableService/brandInfo/index.vue'),
    //             meta: {
    //                 title: "品牌信息",
    //                 icon: "star",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //         // 预警警告
    //         {
    //             name: "AlarmWarningValve",
    //             path: "index",
    //             hidden: false,
    //             component: () => import('@/views/alarmWarning/index.vue'),
    //             meta: {
    //                 title: "预警阀值设置",
    //                 icon: "warning",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //         // 刀具类型管理
    //         {
    //             name: "CutterType",
    //             path: "cutterType",
    //             hidden: false,
    //             component: () => import('@/views/dataDictionary/cutterType/index.vue'),
    //             meta: {
    //                 title: "刀具类型管理",
    //                 icon: "tools",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },    
    //         //刀具柜管理
    //         {
    //                 name: "CabinetService",
    //                 path: "cabinetService",
    //                 hidden: false,
    //                 redirect: "noRedirect",
    //                 // component: Layout,
    //                 alwaysShow: true,
    //                 meta: {
    //                     title: "刀具柜服务",
    //                     icon: "box",
    //                     noCache: false,
    //                     link: null,
    //                 },
    //                 children: [
    //                     // {
    //                     //     name: "CabinetManagement",
    //                     //     path: "cabinetManagement",
    //                     //     hidden: false,
    //                     //     component: () => import('@/views/cabinetService/cabinetManagement/index'),
    //                     //     meta: {
    //                     //         title: "刀具柜管理",
    //                     //         icon: "grid",
    //                     //         noCache: false,
    //                     //         link: null
    //                     //     }
    //                     // },
    //                     // 刀柜货道管理
    //                     {
    //                     name: "CollectCabinet",
    //                     path: "collectCabinet",
    //                     hidden: false,
    //                     component: () => import('@/views/cabinetChannel/collectCabinet/index'),
    //                     meta: {
    //                         title: "收刀柜",
    //                         icon: "box",
    //                         noCache: false,
    //                         link: null
    //                     }
    //                 },
    //                 {
    //                     name: "TakeCabinet",
    //                     path: "takeCabinet",
    //                     hidden: false,
    //                     component: () => import('@/views/cabinetChannel/takeCabinet/index'),
    //                     meta: {
    //                         title: "取刀柜",
    //                         icon: "shopping-cart",
    //                         noCache: false,
    //                         link: null
    //                     }
    //                 },
    //                 {
    //                     name: "HandleCabinet",
    //                     path: "handleCabinet",
    //                     hidden: false,
    //                     component: () => import('@/views/cabinetChannel/handleCabinet/index.vue'),
    //                     meta: {
    //                         title: "刀柄柜",
    //                         icon: "tools",
    //                         noCache: false,
    //                         link: null
    //                     }
    //                 },
    //                 {
    //                     name: "CollectHandleCabinet",
    //                     path: "collectHandleCabinet",
    //                     hidden: false,
    //                     component: () => import('@/views/cabinetChannel/collectHandleCabinet/index.vue'),
    //                     meta: {
    //                         title: "收刀柄柜",
    //                         icon: "box",
    //                         noCache: false,
    //                         link: null
    //                     }
    //                 },
    //                 ]
    //             },

    //     ]
    // },
    // 取还收刀信息 - 班组长
    // {
    //     name: "BorrowReturnInfo",
    //     path: "/borrowReturnInfo",
    //     hidden: false,
    //     redirect: "noRedirect",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "取还收刀信息",
    //         icon: "refresh",
    //         noCache: false,
    //         link: null
    //     },
    //     children: [
    //         {
    //             name: "RankingStatistics",
    //             path: "rankingStatistics",
    //             hidden: false,
    //             component: () => import('@/views/borrowReturnInfo/rankingStatistics/index'),
    //             meta: {
    //                 title: "排行统计",
    //                 icon: "data-line",
    //                 noCache: false,
    //                 link: null
    //             }
    //         }
    //     ]
    // },

    // 工具管理 - 操作员
    {
        name: "BorrowManagement",
        path: "/borrowManagement",
        hidden: false,
        redirect: "noRedirect",
        component: Layout,
        alwaysShow: true,
        meta: {
            title: "工具管理",
            icon: "shopping-cart",
            noCache: false,
            link: null,
            roles: ['common']  // 操作员可见
        },
        children: [
            {
                name: "DaoTouBorrow",
                path: "daoTouBorrow",
                hidden: false,
                component: () => import('@/views/borrowManagement/daoTouBorrow/index'),
                meta: {
                    title: "刀头借出",
                    icon: "tools",
                    noCache: false,
                    link: null
                }
            },
            {
                name: "DaoBingBorrow",
                path: "daoBingBorrow",
                hidden: false,
                component: () => import('@/views/borrowManagement/daoBingBorrow/index'),
                meta: {
                    title: "刀柄借出",
                    icon: "connection",
                    noCache: false,
                    link: null
                }
            },
            //刀头暂存页面
            {
                name: "DaoTouTemporaryStorage",
                path: "daoTouTemporaryStorage",
                hidden: false,
                component: () => import('@/views/borrowManagement/daoTouTemporaryStorage/index'),
                meta: {
                    title: "刀头暂存",
                    icon: "connection",
                    noCache: false,
                    link: null
                }
            },
            //刀柄暂存页面
            {
                name: "daoBingTemporaryStorage",
                path: "daoBingTemporaryStorage",
                hidden: false,
                component: () => import('@/views/borrowManagement/daoBingTemporaryStorage/index'),
                meta: {
                    title: "刀柄暂存",
                    icon: "connection",
                    noCache: false,
                    link: null
                }
            }
        ]
    },
    
    {
        name: "ProductOrder",
        path: "/productOrder",
        hidden: false,
        redirect: "noRedirect",
        component: Layout,
        alwaysShow: true,
        meta: {
            title: "产品工单",
            icon: "list",
            noCache: false,
            link: null,
        },
        children: [
            {
                name: "ProductOrderList",
                path: "productOrder",
                hidden: false,
                component: () => import('@/views/productOrder/productOrder/index'),
                meta: {
                    title: "产品工单",
                    icon: "document",
                    noCache: false,
                    link: null
                }
            },
        ]
    },
    // 管理员管理
    {
        name:"AdminManagement",
        path: "/adminManagement",
        hidden: false,
        component: Layout,
        redirect: "/adminManagement/adminInfo",
        meta: {
            title: "管理员管理",
            icon: "user",
            noCache: false,
            link: null,
            roles: ['admin']  // 仅管理员角色可见
        },
        children: [
            {
                name: "AdminInfo",
                path: "adminInfo",
                hidden: false,
                component: () => import('@/views/employeeManagement/AdminManagement/index.vue'),
                meta: {
                    title: "管理员管理",
                    icon: "user",
                    noCache: false,
                    link: null
                }
            }
        ]
    },
    // 操作员管理
    {
        name: "EmployeeManagement",
        path: "/employeeManagement",
        hidden: false,
        redirect: "noRedirect",
        component: Layout,
        alwaysShow: true,
        meta: {
            title: "操作员管理",
            icon: "user",
            noCache: false,
            link: null,
            roles: ['admin']  // 仅管理员角色可见
        },
        children: [
            {
                name: "LeaderList",
                path: "LeaderList",
                hidden: false,
                component: () => import('@/views/employeeManagement/employeeInfo/LeaderList.vue'),
                meta: {
                    title: "班组长管理",
                    icon: "user",
                    noCache: false,
                    link: null
                }
            },
            {
                name: "Worker",
                path: "Worker",
                hidden: false,
                component: () => import('@/views/employeeManagement/employeeInfo/WorkerList.vue'),
                meta: {
                    title: "普通员工管理",
                    icon: "user",
                    noCache: false,
                    link: null
                }
            }
        ]
    },
    // 审计员管理
    {
        name:"AuditorManagement",
        path: "/auditorManagement",
        hidden: false,
        component: Layout,
        redirect: "/auditorManagement/auditorInfo",
        meta: {
            title: "审计员管理",
            icon: "user",
            noCache: false,
            link: null,
            roles: ['admin']  // 仅管理员角色可见
        },
        children: [
            {
                name: "AuditorInfo",
                path: "auditorInfo",
                hidden: false,
                component: () => import('@/views/employeeManagement/AuditorManagement/index.vue'),
                meta: {
                    title: "审计员管理",
                    icon: "user",
                    noCache: false,
                    link: null
                }
            }
        ]
    },
                // {
            //     name: "CabinetChannelStats",
            //     path: "cabinetChannelStats",
            //     hidden: false,
            //     redirect: "noRedirect",
            //     meta: {
            //         title: "刀柜货道",
            //         icon: "grid",
            //         noCache: false,
            //         link: null
            //     },
            //     children: [
            //         {
            //             name: "CollectCabinet",
            //             path: "collectCabinet",
            //             hidden: false,
            //             component: () => import('@/views/cabinetChannel/collectCabinet/index'),
            //             meta: {
            //                 title: "收刀柜",
            //                 icon: "box",
            //                 noCache: false,
            //                 link: null
            //             }
            //         },
            //         {
            //             name: "TakeCabinet",
            //             path: "takeCabinet",
            //             hidden: false,
            //             component: () => import('@/views/cabinetChannel/takeCabinet/index'),
            //             meta: {
            //                 title: "取刀柜",
            //                 icon: "shopping-cart",
            //                 noCache: false,
            //                 link: null
            //             }
            //         },
            //         {
            //             name: "HandleCabinet",
            //             path: "handleCabinet",
            //             hidden: false,
            //             component: () => import('@/views/cabinetChannel/handleCabinet/index.vue'),
            //             meta: {
            //                 title: "刀柄柜",
            //                 icon: "tools",
            //                 noCache: false,
            //                 link: null
            //             }
            //         },
            //         {
            //             name: "CollectHandleCabinet",
            //             path: "collectHandleCabinet",
            //             hidden: false,
            //             component: () => import('@/views/cabinetChannel/collectHandleCabinet/index.vue'),
            //             meta: {
            //                 title: "收刀柄柜",
            //                 icon: "box",
            //                 noCache: false,
            //                 link: null
            //             }
            //         }
            //     ]
            // }
    // {
    //     name: "BrandManagement",
    //     path: "/brandManagement",
    //     hidden: false,
    //     component: Layout,
    //     redirect: "/brandManagement/brandInfo",
    //     meta: {
    //         title: "品牌管理",
    //         icon: "star",
    //         noCache: false,
    //         link: null,
    //     },
    //     children: [
            //             {
            //     name: "BrandInfo",
            //     path: "brandInfo",
            //     hidden: false,
            //     component: () => import('@/views/consumableService/brandInfo/index.vue'),
            //     meta: {
            //         title: "品牌信息",
            //         icon: "star",
            //         noCache: false,
            //         link: null
            //     }
            // },
    //     ]
    // }

 
    // 耗材服务
    // {
    //     name: "ConsumableService",
    //     path: "/consumableService",
    //     hidden: false,
    //     redirect: "noRedirect",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "耗材服务",
    //         icon: "goods",
    //         noCache: false,
    //         link: null,
    //     },
    //     children: [
    //         {
    //             name: "CutterConsumable",
    //             path: "cutterConsumable",
    //             hidden: false,
    //             component: () => import('@/views/consumableService/cutterConsumable/index'),
    //             meta: {
    //                 title: "刀具耗材",
    //                 icon: "tools",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //         {
    //             name: "StockInOutInfo",
    //             path: "stockInOutInfo",
    //             hidden: false,
    //             component: () => import('@/views/consumableService/stockInOutInfo/index.vue'),
    //             meta: {
    //                 title: "出入库信息",
    //                 icon: "list",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //     ]
    // },
,
    // 刀具类型管理
    // {
    //     name: "CutterTypeManagement",
    //     path: "/cutterTypeManagement",
    //     hidden: false,
    //     component: Layout,
    //     redirect: "/cutterTypeManagement/cutterType",
    //     meta: {
    //         title: "刀具类型",
    //         icon: "tools",
    //         noCache: false,
    //         link: null,
    //     },
    //     children: [
    //         {
    //             name: "CutterType",
    //             path: "cutterType",
    //             hidden: false,
    //             component: () => import('@/views/dataDictionary/cutterType/index.vue'),
    //             meta: {
    //                 title: "刀具类型管理",
    //                 icon: "tools",
    //                 noCache: false,
    //                 link: null
    //             }
    //         }
    //     ]
    // },
    // 数据字典
    // {
    //     name: "DataDictionary",
    //     path: "/dataDictionary",
    //     hidden: false,
    //     redirect: "noRedirect",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "数据字典",
    //         icon: "document",
    //         noCache: false,
    //         link: null,
    //     },
    //     children: [
    //         {
    //             name: "DictCollection",
    //             path: "dictCollection",
    //             hidden: false,
    //             component: () => import('@/views/dataDictionary/dictCollection/index.vue'),
    //             meta: {
    //                 title: "字典集合",
    //                 icon: "collection",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //         {
    //             name: "PersonalizedSettings",
    //             path: "personalizedSettings",
    //             hidden: false,
    //             component: () => import('@/views/dataDictionary/personalizedSettings/index.vue'),
    //             meta: {
    //                 title: "个性化设置",
    //                 icon: "setting",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //     ]
    // },
    // 历史记录
    // {
    //     name: "HistoryRecord",
    //     path: "/historyRecord",
    //     hidden: false,
    //     redirect: "noRedirect",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: {
    //         title: "历史记录",
    //         icon: "history",
    //         noCache: false,
    //         link: null,
    //     },
    //     children: [
    //         {
    //             name: "OperationLog",
    //             path: "operationLog",
    //             hidden: false,
    //             component: () => import('@/views/historyRecord/operationLog/index'),
    //             meta: {
    //                 title: "操作日志",
    //                 icon: "operation",
    //                 noCache: false,
    //                 link: null
    //             }
    //         },
    //     ]
    // },
    // 车间信息
    {
        name: "Workshop",
        path: "/workshop",
        hidden: false,
        redirect: "/workshop/index",
        component: Layout,
        meta: {
            title: "车间信息",
            icon: "office-building",
            noCache: false,
            link: null
        },
        children: [
            {
                name: "WorkshopIndex",
                path: "index",
                hidden: false,
                component: () => import('@/views/workshop/index'),
                meta: {
                    title: "车间信息",
                    icon: "office-building",
                    noCache: false,
                    link: null
                }
            }
        ]
    },
    // 设备信息
    {
        name: "DeviceInfo",
        path: "/deviceInfo",
        hidden: false,
        redirect: "noRedirect",
        component: Layout,
        alwaysShow: true,
        meta: {
            title: "设备信息",
            icon: "monitor",
            noCache: false,
            link: null
        },
        children: [
            {
                name: "DeviceManagement",
                path: "deviceManagement",
                hidden: false,
                component: () => import('@/views/deviceInfo/deviceManagement/index'),
                meta: {
                    title: "设备管理",
                    icon: "setting",
                    noCache: false,
                    link: null
                }
            }
        ]
    },
    // 文件管理
    {
        name: "FileManagement",
        path: "/fileManagement",
        hidden: false,
        redirect: "noRedirect",
        component: Layout,
        alwaysShow: true,
        meta: {
            title: "文件",
            icon: "folder",
            noCache: false,
            link: null
        },
        children: [
            {
                name: "FileExport",
                path: "fileExport",
                hidden: false,
                component: () => import('@/views/fileManagement/fileExport/index'),
                meta: {
                    title: "文件导出",
                    icon: "download",
                    noCache: false,
                    link: null
                }
            },
            {
                name: "FileAttachment",
                path: "fileAttachment",
                hidden: false,
                component: () => import('@/views/fileManagement/fileAttachment/index'),
                meta: {
                    title: "文件附件",
                    icon: "paperclip",
                    noCache: false,
                    link: null
                }
            }
        ]
    },

    // 系统统计
    {
        name: "SystemStatistics",
        path: "/systemStatistics",
        hidden: false,
        redirect: "noRedirect",
        component: Layout,
        alwaysShow: true,
        meta: {
            title: "系统统计",
            icon: "data-line",
            noCache: false,
            link: null,
            roles: ['auditor']  // 审核员可见
        },
        children: [
            {
                name: "StockRecord",
                path: "stockRecord",
                hidden: false,
                component: () => import('@/views/historyRecord/stockRecord/index'),
                meta: {
                    title: "出入库统计",
                    icon: "box",
                    noCache: false,
                    link: null
                }
            },
            
            {
                name: "YearlyQuantityStatistics",
                path: "yearlyQuantityStatistics",
                hidden: false,
                component: () => import('@/views/borrowReturnInfo/YearlyQuantityStatistics/index.vue'),
                meta: {
                    title: "全年取刀数量统计",
                    icon: "data-line",
                    noCache: false,
                    link: null
                }
            },

            {
                name: "YearlyAmountStatistics",
                path: "yearlyAmountStatistics",
                hidden: false,
                component: () => import('@/views/borrowReturnInfo/YearlyAmountStatistics/index.vue'),
                meta: {
                    title: "全年取刀金额统计",
                    icon: "data-line",
                    noCache: false,
                    link: null
                }
            },

            {
                name: "YearlyUsageStatistics",
                path: "yearlyUsageStatistics",
                hidden: false,
                component: () => import('@/views/borrowReturnInfo/YearlyUsageStatistics/index.vue'),
                meta: {
                    title: "刀具消耗统计",
                    icon: "data-line",
                    noCache: false,
                    link: null
                }
            },

            {
                name: "TotalInventoryStats",
                path: "totalInventoryStats",
                hidden: false,
                component: () => import('@/views/borrowReturnInfo/totalInventoryStats/index.vue'),
                meta: {
                    title: "总库存统计",
                    icon: "data-analysis",
                    noCache: false,
                    link: null
                }
            },

            {
                name: "RestockRecord",
                path: "restockRecord",
                hidden: false,
                component: () => import('@/views/historyRecord/restockRecord/index'),
                meta: {
                    title: "货道库存统计",
                    icon: "goods",
                    noCache: false,
                    link: null
                }
            },

            {
                name: "ScrapKnifeCollectionStatistics",
                path: "scrapKnifeCollectionStatistics",
                hidden: false,
                component: () => import('@/views/borrowReturnInfo/ScrapKnifeCollectionStatistics/index'),
                meta: {
                    title: "废刀回收统计",
                    icon: "data-line",
                    noCache: false,
                    link: null
                }
            },
        ]
    },
    // 系统记录
    {
        name: "SystemRecord",
        path: "/systemRecord",
        hidden: false,
        redirect: "noRedirect",
        component: Layout,
        alwaysShow: true,
        meta: {
            title: "系统记录",
            icon: "document",
            noCache: false,
            link: null,
            roles: ['auditor']  // 审核员可见
        },
        children: [
            // {
            //     name: "RestockRecord",
            //     path: "restockRecord",
            //     hidden: false,
            //     component: () => import('@/views/historyRecord/restockRecord/index'),
            //     meta: {
            //         title: "补货记录",
            //         icon: "goods",
            //         noCache: false,
            //         link: null
            //     }
            // },

            {
                name: "PersonnelManagementRecord",
                path: "personnelManagementRecord",
                hidden: false,
                component: () => import('@/views/PersonnelManagementRecord/index.vue'),
                meta: {
                    title: "人员管理记录",
                    // icon: "user",
                    noCache: false,
                    link: null
                }
            },
            {
                name: "ReplenishmentRecord",
                path: "replenishmentRecord",
                hidden: false,
                component: () => import('@/views/ReplenishmentRecord/index.vue'),
                meta: {
                    title: "补货记录",
                    icon: "goods",
                    noCache: false,
                    link: null
                }
            },

            {
                name: "LendRecord",
                path: "lendRecord",
                hidden: false,
                component: () => import('@/views/historyRecord/lendRecord/index'),
                meta: {
                    title: "领用领出记录",
                    icon: "document",
                    noCache: false,
                    link: null
                }
            },

            {
                name: "PublicStorage",
                path: "publicStorage",
                hidden: false,
                component: () => import('@/views/historyRecord/publicStorage/index'),
                meta: {
                    title: "暂存记录",
                    icon: "files",
                    noCache: false,
                    link: null
                }
            },

            {
                name: "AlarmWarning",
                path: "index",
                hidden: false,
                component: () => import('@/views/alarmWarning/index.vue'),
                meta: {
                    title: "预警警告",
                    icon: "warning",
                    noCache: false,
                    link: null
                }
            },

            // {
            //     name: "ReturnInfo",
            //     path: "returnInfo",
            //     hidden: false,
            //     component: () => import('@/views/borrowReturnInfo/returnInfo/index'),
            //     meta: {
            //         title: "还刀信息",
            //         icon: "refresh-left",
            //         noCache: false,
            //         link: null
            //     }
            // },
            // {
            //     name: "CollectInfo",
            //     path: "collectInfo",
            //     hidden: false,
            //     component: () => import('@/views/borrowReturnInfo/collectInfo/index.vue'),
            //     meta: {
            //         title: "收刀信息",
            //         icon: "collection",
            //         noCache: false,
            //         link: null
            //     }
            // },
            // {
            //     name: "UnreturnedInfo",
            //     path: "unreturnedInfo",
            //     hidden: false,
            //     component: () => import('@/views/borrowReturnInfo/unreturnedInfo/index'),
            //     meta: {
            //         title: "未还信息",
            //         icon: "warning",
            //         noCache: false,
            //         link: null
            //     }
            // }
        ]
    },
    // 系统排行
    {
        name: "SystemRanking",
        path: "/SystemRanking",
        hidden: false,
        redirect: "noRedirect",
        component: Layout,
        alwaysShow: true,
        meta: {
            title: "系统排行",
            icon: "document",
            noCache: false,
            link: null,
            roles: ['auditor']  // 审核员可见
        },
        children: [
            {
                name: "EmployeeRanking",
                path: "employeeRanking",
                hidden: false,
                component: () => import('@/views/leaderBoard/EmployeeRanking/index.vue'),
                meta: {
                    title: "员工领刀排行",
                    icon: "data-line",
                    noCache: false,
                    link: null
                }
            },
            {
                name: "EquipmentKnife",
                path: "equipmentKnife",
                hidden: false,
                component: () => import('@/views/leaderBoard/EquipmentKnife/index.vue'),
                meta: {
                    title: "设备用刀排行",
                    icon: "data-line",
                    noCache: false,
                    link: null
                }
            },
            {
                name: "CutterModelRanking",
                path: "cutterModelRanking",
                hidden: false,
                component: () => import('@/views/leaderBoard/CutterModelRanking/index.vue'),
                meta: {
                    title: "刀具型号排行",
                    icon: "data-line",
                    noCache: false,
                    link: null
                }
            },
            {
                name: "AbnormalReturnRanking",
                path: "abnormalReturnRanking",
                hidden: false,
                component: () => import('@/views/leaderBoard/AbnormalReturnRanking/index.vue'),
                meta: {
                    title: "异常还刀排行",
                    icon: "data-line",
                    noCache: false,
                    link: null
                }
            }

        ]
    },

    // {
    //     path: '/alarmWarning',
    //     component: Layout,
    //     redirect: '/alarmWarning/index',
    //     meta: {
    //         title: "预警警告",
    //         icon: "warning",
    //         noCache: false,
    //         link: null
    //     },
    //     children: [

    //     ]
    // }

]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
    {
        path: '/system/user-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:user:edit'],
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/system/user/authRole'),
                name: 'AuthRole',
                meta: {title: '分配角色', activeMenu: '/system/user'}
            }
        ]
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return {top: 0}
    },
})

export default router