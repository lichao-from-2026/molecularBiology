/**
 * 状态选择器组件
 * 描述：显示学习进度和状态切换界面
 * 作者：AI Assistant
 * 日期：2026-04-22
 */
import React from 'react';
import type { StatusSelectorProps } from './types'; // 导入组件属性类型
import { useStatusSelector } from './hooks'; // 导入组件专用 Hook
import { statusConfig } from './constants'; // 导入状态配置
import styles from './StatusSelector.module.css'; // 导入组件样式

/**
 * 状态选择器组件
 * @param {StatusSelectorProps} props - 组件属性
 * @returns {React.ReactElement} 渲染后的 React 元素
 */
export function StatusSelector({
  items: initialItems,
  storageKey = 'knowledge-base-status',
  showDescription = true,
}: StatusSelectorProps) {
  // 使用组件专用 Hook 管理状态和逻辑
  const {
    items,
    handleStatusChange,
    progress,
    progressPercent,
  } = useStatusSelector({ items: initialItems, storageKey });

  /**
   * 获取状态样式类名
   * 描述：根据状态返回对应的样式类名
   * @param {string} status - 状态
   * @returns {string} 样式类名
   */
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.pending;
      case 'in-progress':
        return styles.inProgress;
      case 'completed':
        return styles.completed;
      default:
        return '';
    }
  };

  return (
    <div className={styles.statusSelector}>
      {/* 头部 */}
      <div className={styles.statusSelectorHeader}>
        <h4 className={styles.statusSelectorTitle}>📊 学习进度</h4>
        <div className={styles.statusSelectorStats}>
          <span className={`${styles.stat} ${styles.completed}`}>✅ {progress.completed}</span>
          <span className={`${styles.stat} ${styles.inProgress}`}>🔄 {progress.inProgress}</span>
          <span className={`${styles.stat} ${styles.pending}`}>⬜ {progress.pending}</span>
        </div>
      </div>

      {/* 进度条 */}
      <div className={styles.statusSelectorProgress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className={styles.progressText}>{progressPercent}% 完成</span>
      </div>

      {/* 项目列表 */}
      <div className={styles.statusSelectorList}>
        {items.map((item) => {
          const config = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className={`${styles.statusItem} ${getStatusClass(item.status)}`}
              onClick={() => handleStatusChange(item.id)}
            >
              <div className={styles.statusItemIcon}>{config.icon}</div>
              <div className={styles.statusItemContent}>
                <div className={styles.statusItemLabel}>{item.label}</div>
                {showDescription && item.description && (
                  <div className={styles.statusItemDescription}>{item.description}</div>
                )}
                {item.filePath && (
                  <div className={styles.statusItemPath}>{item.filePath}</div>
                )}
              </div>
              <div
                className={styles.statusItemBadge}
                style={{ backgroundColor: config.bgColor, color: config.color }}
              >
                {config.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 页脚 */}
      <div className={styles.statusSelectorFooter}>
        <div className={styles.statusLegend}>
          <span className={styles.legendItem}>
            <span className={styles.legendIcon}>○</span> 待完成
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendIcon}>◐</span> 进行中
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendIcon}>●</span> 已完成
          </span>
        </div>
        <div className={styles.statusHint}>点击可切换状态</div>
      </div>
    </div>
  );
}

export default StatusSelector;
