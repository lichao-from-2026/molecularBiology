/**
 * 状态选择器类型定义
 * 描述：定义 StatusSelector 组件相关的 TypeScript 类型
 * 作者：AI Assistant
 * 日期：2026-04-22
 */

/**
 * 状态类型
 * 描述：定义状态的类型
 */
export type StatusType = 'pending' | 'in-progress' | 'completed';

/**
 * 状态项接口
 * 描述：定义状态选择器中的单个项目数据结构
 */
export interface StatusItem {
  id: string; // 唯一标识符
  label: string; // 项目标签
  description?: string; // 可选的项目描述
  status: StatusType; // 项目状态
  filePath?: string; // 可选的文件路径
}

/**
 * 状态选择器属性接口
 * 描述：定义 StatusSelector 组件接收的属性
 */
export interface StatusSelectorProps {
  items: StatusItem[]; // 状态项数组
  storageKey?: string; // 可选的本地存储键名
  showDescription?: boolean; // 是否显示描述
}
