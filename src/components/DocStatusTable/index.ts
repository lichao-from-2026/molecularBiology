/**
 * 文档状态表格导出文件
 * 描述：集中导出 DocStatusTable 组件及其相关类型、Hook 和常量
 * 作者：AI Assistant
 * 日期：2026-04-22
 */

// 导出组件本身和默认导出
export { DocStatusTable, default } from './DocStatusTable';

// 导出类型定义
export type { DocStatusItem, DocStatusTableProps, DocStatus } from './types';

// 导出组件专用 Hook
export { useDocStatusTable } from './hooks';

// 导出组件专用常量
export { statusConfig } from './constants';
