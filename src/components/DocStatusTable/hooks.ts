/**
 * 文档状态表格 Hook
 * 描述：封装 DocStatusTable 组件的状态管理和业务逻辑
 * 作者：AI Assistant
 * 日期：2026-04-22
 */
import { useState, useEffect, useCallback } from 'react';
import type { DocStatusItem, DocStatus, DocStatusTableProps } from './types'; // 导入类型定义

/**
 * 状态循环顺序
 * 描述：定义状态切换的循环顺序
 */
const statusCycle: DocStatus[] = ['pending', 'in-progress', 'completed'];

/**
 * Hook 选项接口
 * 描述：定义 useDocStatusTable Hook 接收的参数
 */
interface UseDocStatusTableOptions {
  items: DocStatusTableProps['items']; // 文档状态项数组
  storageKey?: string; // 本地存储键名
}

/**
 * 文档状态表格 Hook
 * 描述：管理文档状态表格的状态和逻辑
 * @param {UseDocStatusTableOptions} options - Hook 选项
 * @returns {Object} 状态和方法
 */
export function useDocStatusTable({ items: initialItems, storageKey }: UseDocStatusTableOptions) {
  // 状态定义
  const [items, setItems] = useState<DocStatusItem[]>(initialItems); // 文档状态项
  const [animatingId, setAnimatingId] = useState<string | null>(null); // 正在动画的项目 ID
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()); // 展开的项目 ID 集合

  /**
   * 副作用：初始化展开状态
   * 描述：根据初始项目状态设置展开状态，未完成的项目默认展开
   */
  useEffect(() => {
    const expanded = new Set<string>();
    initialItems.forEach(item => {
      if (item.status !== 'completed') {
        expanded.add(item.id);
      }
    });
    setExpandedIds(expanded);
  }, [initialItems]);

  /**
   * 副作用：从本地存储加载状态
   * 描述：当 storageKey 变化时，从本地存储加载保存的状态
   */
  useEffect(() => {
    if (!storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 更新项目状态
        const updatedItems = initialItems.map((item) => ({
          ...item,
          status: (parsed[item.id] as DocStatus) || 'pending',
        }));
        setItems(updatedItems);

        // 更新展开状态
        const expanded = new Set<string>();
        updatedItems.forEach(item => {
          if (item.status !== 'completed') {
            expanded.add(item.id);
          }
        });
        setExpandedIds(expanded);
      } catch (e) {
        console.warn('Failed to parse saved status:', e);
      }
    }
  }, [storageKey, initialItems]);

  /**
   * 状态切换处理函数
   * 描述：处理状态切换逻辑，循环切换状态并保存到本地存储
   * @param {string} id - 项目 ID
   */
  const handleStatusToggle = useCallback((id: string) => {
    setAnimatingId(id); // 设置动画状态
    setItems((current) => {
      const newItems = current.map((item) => {
        if (item.id === id) {
          // 循环切换状态
          const currentIndex = statusCycle.indexOf(item.status);
          const nextIndex = (currentIndex + 1) % statusCycle.length;
          return { ...item, status: statusCycle[nextIndex] };
        }
        return item;
      });

      // 更新展开状态
      const item = newItems.find(i => i.id === id);
      if (item) {
        setExpandedIds((current) => {
          const newSet = new Set(current);
          if (item.status === 'completed') {
            newSet.delete(id); // 已完成项目自动收起
          } else {
            newSet.add(id); // 未完成项目自动展开
          }
          return newSet;
        });
      }

      // 保存状态到本地存储
      if (storageKey) {
        const statusMap: Record<string, DocStatus> = {};
        newItems.forEach((item) => {
          statusMap[item.id] = item.status;
        });
        localStorage.setItem(storageKey, JSON.stringify(statusMap));
      }

      return newItems;
    });

    // 300ms 后清除动画状态
    setTimeout(() => setAnimatingId(null), 300);
  }, [storageKey]);

  /**
   * 展开/收起处理函数
   * 描述：处理项目详情的展开和收起
   * @param {string} id - 项目 ID
   */
  const handleExpandToggle = useCallback((id: string) => {
    setExpandedIds((current) => {
      const newSet = new Set(current);
      if (newSet.has(id)) {
        newSet.delete(id); // 已展开则收起
      } else {
        newSet.add(id); // 未展开则展开
      }
      return newSet;
    });
  }, []);

  /**
   * 统计信息
   * 描述：计算项目的统计信息
   */
  const stats = {
    total: items.length, // 总项目数
    completed: items.filter((i) => i.status === 'completed').length, // 已完成项目数
    inProgress: items.filter((i) => i.status === 'in-progress').length, // 进行中项目数
    pending: items.filter((i) => i.status === 'pending').length, // 待完成项目数
  };

  /**
   * 进度百分比
   * 描述：计算完成进度百分比
   */
  const progressPercent = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return {
    items, // 文档状态项
    animatingId, // 正在动画的项目 ID
    expandedIds, // 展开的项目 ID 集合
    handleStatusToggle, // 状态切换处理函数
    handleExpandToggle, // 展开/收起处理函数
    stats, // 统计信息
    progressPercent, // 进度百分比
  };
}
