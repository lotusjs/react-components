---
category: Scrollbar
title: Scrollbar
subtitle: 滚动条

group:
  title: 数据展示
  order: 1
---

## 代码示例

<code src="./demo/basic.tsx">基本</code>
<code src="./demo/horizontal.tsx">横向滚动</code>
<code src="./demo/max-height.tsx">最大高度</code>
<code src="./demo/size.tsx">滚动条尺寸</code>

## API

| 属性          | 说明                                                                 | 类型                 | 默认值    | 版本 |
| ------------- | -------------------------------------------------------------------- | -------------------- | --------- | ---- |
| height        | 滚动容器高度                                                         | number \| string     | --        | --   |
| maxHeight     | 滚动容器最大高度                                                     | number \| string     | --        | --   |
| native        | 是否使用原生滚动条样式                                               | boolean              | `false`   | --   |
| wrapClassName | 容器的自定义类名                                                     | string               | --        | --   |
| wrapStyle     | 容器的自定义样式                                                     | CSSProperties        | --        | --   |
| noresize      | 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能 | boolean              | `false`   | --   |
| always        | 滚动条总是显示或隐藏                                                 | 'show' \| 'hidden'   | `false`   | --   |
| size          | 滚动条尺寸                                                           | 'small' \| 'default' | `default` | --   |
| minSize       | 滚动条最小尺寸                                                       | number               | `20`      | --   |
