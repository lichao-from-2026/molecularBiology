/**
 * 文档状态表格组件
 * 描述：显示文档状态列表，支持状态切换和详情展开
 * 作者：AI Assistant
 * 日期：2026-04-22
 */
import React from 'react';
import type { DocStatusTableProps } from './types'; // 导入组件属性类型
import { useDocStatusTable } from './hooks'; // 导入组件专用 Hook
import { statusConfig } from './constants'; // 导入状态配置
import styles from './DocStatusTable.module.css'; // 导入组件样式

/**
 * 文档状态表格组件
 * @param {DocStatusTableProps} props - 组件属性
 * @returns {React.ReactElement} 渲染后的 React 元素
 */
export function DocStatusTable({
  items: initialItems,
  title,
  storageKey,
}: DocStatusTableProps) {
  // 使用组件专用 Hook 管理状态和逻辑
  const {
    items,
    animatingId,
    expandedIds,
    handleStatusToggle,
    handleExpandToggle,
    stats,
    progressPercent,
  } = useDocStatusTable({ items: initialItems, storageKey });

  /**
   * 行点击处理函数
   * 描述：处理行点击事件，切换状态
   * @param {React.MouseEvent} e - 鼠标事件
   * @param {string} id - 项目 ID
   */
  const handleRowClick = (e: React.MouseEvent, id: string) => {
    const target = e.target as HTMLElement;
    // 避免点击展开按钮或状态徽章时触发状态切换
    if (target.closest(`.${styles.expandButton}`) || target.closest(`.${styles.statusBadge}`)) {
      return;
    }
    e.preventDefault();
    handleStatusToggle(id);
  };

  /**
   * 展开按钮点击处理函数
   * 描述：处理展开/收起详情的点击事件
   * @param {React.MouseEvent} e - 鼠标事件
   * @param {string} id - 项目 ID
   */
  const handleExpandClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleExpandToggle(id);
  };

  /**
   * 获取行状态样式类名
   * 描述：根据状态返回对应的样式类名
   * @param {string} status - 状态
   * @returns {string} 样式类名
   */
  const getRowStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.rowStatusPending;
      case 'in-progress':
        return styles.rowStatusInProgress;
      case 'completed':
        return styles.rowStatusCompleted;
      default:
        return '';
    }
  };

  /**
   * 获取状态样式类名
   * 描述：根据状态返回对应的样式类名
   * @param {string} status - 状态
   * @returns {string} 样式类名
   */
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'in-progress':
        return styles.statusInProgress;
      case 'completed':
        return styles.statusCompleted;
      default:
        return '';
    }
  };

  return (
    <div className={styles.docStatusTable}>
      {/* 表头部分 */}
      {title && (
        <div className={styles.docStatusHeader}>
          <div className={styles.docStatusHeaderTop}>
            <h4 className={styles.docStatusTitle}>
              <svg className={styles.titleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              {title}
            </h4>
            <span className={styles.docStatusCount}>{stats.completed}/{stats.total}</span>
          </div>
          <div className={styles.docStatusProgress}>
            <div className={styles.docStatusProgressBar}>
              <div
                className={styles.docStatusProgressFill}
                style={{
                  width: `${progressPercent}%`,
                  background: progressPercent === 100
                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                }}
              />
            </div>
            <span className={styles.docStatusProgressText}>{progressPercent}%</span>
          </div>
        </div>
      )}

      {/* 项目列表 */}
      <div className={styles.docStatusList}>
        {items.map((item, index) => (
          <div key={item.id}>
            {/* 项目行 */}
            <div
              className={`${styles.docStatusItem} ${getRowStatusClass(item.status)} ${animatingId === item.id ? styles.animating : ''}`}
              onClick={(e) => handleRowClick(e, item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                // 支持键盘 Enter 和 Space 键切换状态
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStatusToggle(item.id);
                }
              }}
              style={{ animationDelay: `${index * 50}ms` }} // 错开动画延迟，提高视觉效果
            >
              <div className={styles.docStatusItemLeft}>
                {/* 状态图标 */}
                <span
                  className={`${styles.statusIconWrapper} ${getStatusClass(item.status)}`}
                >
                  {statusConfig[item.status].icon}
                </span>
                <div className={styles.docStatusItemContent}>
                  <div className={styles.docStatusItemHeader}>
                    {/* 项目标题 */}
                    <span className={`${styles.docStatusItemTitle} ${item.status === 'completed' ? styles.completed : ''}`}>
                      {item.title}
                    </span>
                    {/* 展开按钮 */}
                    {item.details && (
                      <button
                        className={`${styles.expandButton} ${expandedIds.has(item.id) ? styles.expanded : ''}`}
                        onClick={(e) => handleExpandClick(e, item.id)}
                        title={expandedIds.has(item.id) ? '收起详情' : '展开详情'}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {/* 项目描述 */}
                  {item.description && !expandedIds.has(item.id) && (
                    <span className={styles.docStatusItemDesc}>{item.description}</span>
                  )}
                </div>
              </div>
              <div className={styles.docStatusItemRight}>
                {/* 文件路径 */}
                {item.filePath && (
                  <code className={styles.docStatusItemPath}>{item.filePath}</code>
                )}
                {/* 状态徽章 */}
                <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                  {statusConfig[item.status].icon}
                  <span>{statusConfig[item.status].text}</span>
                </span>
              </div>
            </div>

            {/* 详情展开区域 */}
            {item.details && expandedIds.has(item.id) && (
              <div className={styles.docStatusDetails}>
                <div className={styles.docStatusDetailsContent}>
                  {/* 详情内容，支持数组或字符串 */}
                  {Array.isArray(item.details) ? (
                    <ul className={styles.docStatusDetailsList}>
                      {item.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.details}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 页脚部分 */}
      <div className={styles.docStatusFooter}>
        <div className={styles.docStatusLegend}>
          {/* 状态图例 */}
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: statusConfig.pending.color }} />
            待完成 {stats.pending}
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: statusConfig['in-progress'].color }} />
            进行中 {stats.inProgress}
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: statusConfig.completed.color }} />
            已完成 {stats.completed}
          </span>
        </div>
        <span className={styles.docStatusHint}>
          <svg className={styles.hintIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
          </svg>
          点击切换状态 | 点击 ▶ 展开详情
        </span>
      </div>
    </div>
  );
}

export default DocStatusTable;
