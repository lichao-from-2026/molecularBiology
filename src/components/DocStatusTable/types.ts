/**
 * 文档状态表格类型定义
 * 描述：定义 DocStatusTable 组件相关的 TypeScript 类型
 * 作者：AI Assistant
 * 日期：2026-04-22
 */

/**
 * 文档状态类型
 * 描述：定义文档的不同状态
 */
export type DocStatus = 'pending' | 'in-progress' | 'completed';

/**
 * 文档状态项接口
 * 描述：定义文档状态表格中的单个项目数据结构
 */
export interface DocStatusItem {
  id: string; // 唯一标识符
  title: string; // 项目标题
  description?: string; // 可选的项目描述
  details?: string | string[]; // 可选的项目详情，支持字符串或字符串数组
  filePath?: string; // 可选的文件路径
  status: DocStatus; // 项目状态
}

/**
 * 文档状态表格属性接口
 * 描述：定义 DocStatusTable 组件接收的属性
 */
export interface DocStatusTableProps {
  items: DocStatusItem[]; // 文档状态项数组
  title?: string; // 可选的表格标题
  storageKey?: string; // 可选的本地存储键名
}
