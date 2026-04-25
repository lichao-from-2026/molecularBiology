/**
 * 状态选择器导出文件
 * 描述：集中导出 StatusSelector 组件及其相关类型、Hook 和常量
 * 作者：AI Assistant
 * 日期：2026-04-22
 */

// 导出组件本身和默认导出
export { StatusSelector, default } from './StatusSelector';

// 导出类型定义
export type { StatusItem, StatusSelectorProps, StatusType } from './types';

// 导出组件专用 Hook
export { useStatusSelector } from './hooks';

// 导出组件专用常量
export { statusConfig } from './constants';
