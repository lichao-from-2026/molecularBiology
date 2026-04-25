/**
 * 文档状态表格常量
 * 描述：定义 DocStatusTable 组件使用的常量和配置
 * 作者：AI Assistant
 * 日期：2026-04-22
 */
import React from 'react';
import type { DocStatus } from './types'; // 导入状态类型

/**
 * 状态配置
 * 描述：定义不同状态的显示文本、图标和颜色
 */
export const statusConfig: Record<DocStatus, {
  text: string; // 状态显示文本
  icon: React.ReactNode; // 状态图标
  color: string; // 状态颜色
}> = {
  /**
   * 待完成状态
   */
  pending: {
    text: '待完成',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    color: '#94a3b8',
  },
  /**
   * 进行中状态
   */
  'in-progress': {
    text: '进行中',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: '#f59e0b',
  },
  /**
   * 已完成状态
   */
  completed: {
    text: '已完成',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    color: '#10b981',
  },
};
