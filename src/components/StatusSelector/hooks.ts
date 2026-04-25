/**
 * 状态选择器 Hook
 * 描述：封装 StatusSelector 组件的状态管理和业务逻辑
 * 作者：AI Assistant
 * 日期：2026-04-22
 */
import { useState, useEffect } from 'react';
import type { StatusItem, StatusType, StatusSelectorProps } from './types'; // 导入类型定义

/**
 * 状态循环顺序
 * 描述：定义状态切换的循环顺序
 */
const statusOrder: StatusType[] = ['pending', 'in-progress', 'completed'];

/**
 * Hook 选项接口
 * 描述：定义 useStatusSelector Hook 接收的参数
 */
interface UseStatusSelectorOptions {
  items: StatusSelectorProps['items']; // 状态项数组
  storageKey?: string; // 本地存储键名
}

/**
 * 状态选择器 Hook
 * 描述：管理状态选择器的状态和逻辑
 * @param {UseStatusSelectorOptions} options - Hook 选项
 * @returns {Object} 状态和方法
 */
export function useStatusSelector({ items: initialItems, storageKey = 'knowledge-base-status' }: UseStatusSelectorOptions) {
  // 状态定义
  const [items, setItems] = useState<StatusItem[]>(initialItems); // 状态项

  /**
   * 副作用：从本地存储加载状态
   * 描述：当 storageKey 变化时，从本地存储加载保存的状态
   */
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems((current) =>
          current.map((item) => ({
            ...item,
            status: (parsed[item.id] as StatusType) || 'pending',
          }))
        );
      } catch (e) {
        console.warn('Failed to parse saved status:', e);
      }
    }
  }, [storageKey]);

  /**
   * 状态切换处理函数
   * 描述：处理状态切换逻辑，循环切换状态并保存到本地存储
   * @param {string} id - 项目 ID
   */
  const handleStatusChange = (id: string) => {
    setItems((current) => {
      const newItems = current.map((item) => {
        if (item.id === id) {
          // 循环切换状态
          const currentIndex = statusOrder.indexOf(item.status);
          const nextIndex = (currentIndex + 1) % statusOrder.length;
          return { ...item, status: statusOrder[nextIndex] };
        }
        return item;
      });

      // 保存状态到本地存储
      const statusMap: Record<string, StatusType> = {};
      newItems.forEach((item) => {
        statusMap[item.id] = item.status;
      });
      localStorage.setItem(storageKey, JSON.stringify(statusMap));

      return newItems;
    });
  };

  /**
   * 进度信息
   * 描述：计算项目的进度信息
   */
  const progress = {
    total: items.length, // 总项目数
    completed: items.filter((i) => i.status === 'completed').length, // 已完成项目数
    inProgress: items.filter((i) => i.status === 'in-progress').length, // 进行中项目数
    pending: items.filter((i) => i.status === 'pending').length, // 待完成项目数
  };

  /**
   * 进度百分比
   * 描述：计算完成进度百分比
   */
  const progressPercent = items.length > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return {
    items, // 状态项
    handleStatusChange, // 状态切换处理函数
    progress, // 进度信息
    progressPercent, // 进度百分比
  };
}
