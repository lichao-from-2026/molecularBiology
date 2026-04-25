/**
 * 环境类型声明文件
 * 描述：声明全局环境类型和模块类型，如 CSS Modules、图片等
 * 作者：AI Assistant
 * 日期：2026-04-22
 */

/**
 * CSS Modules 类型声明
 * 描述：为 .module.css 文件提供类型支持
 */
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

/**
 * 图片资源类型声明
 * 描述：为常见图片格式提供类型支持
 */
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

/**
 * 其他资源类型声明
 * 描述：为其他静态资源提供类型支持
 */
declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.txt' {
  const content: string;
  export default content;
}

/**
 * 全局类型声明
 * 描述：项目通用的全局类型定义
 */

/**
 * 基础状态类型
 * 描述：通用的三状态类型
 */
type BaseStatus = 'pending' | 'in-progress' | 'completed';
