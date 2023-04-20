import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useMemo,
  useState,
  forwardRef
} from 'react';
import { classNames, isNumber } from '@pansy/shared';
import { useEventListener, useSize } from '@pansy/react-hooks';
import { Bar } from './Bar';
import { addUnit } from './utils';
import { GAP } from './constants';

export type ScrollbarSize = 'small' | 'default';
export type Always = 'show' | 'hidden';
export interface ScrollbarProps {
  prefixCls?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 滚动容器高度 */
  height?: number | string;
  /** 滚动容器最大高度 */
  maxHeight?: number | string;
  /**
   * 是否使用原生滚动条样式
   * @default false
   */
  native?: boolean;
  /** 容器的自定义类名 */
  wrapClassName?: string;
  /** 容器的自定义样式 */
  wrapStyle?: React.CSSProperties;
  /**
   * 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能
   * @default false
   */
  noResize?: boolean;
  /** 滚动条总是显示/隐藏 */
  always?: Always;
  /**
   * 滚动条尺寸
   * @default 'default'
   */
  size?: ScrollbarSize;
  /**
   * 滚动条最小尺寸
   * @default 20
   */
  minSize?: number;
  onScroll?: (e: { scrollLeft: number; scrollTop: number }) => void;
  children?: React.ReactNode;
}

export interface ScrollbarRef {
  /**
   * 滚动到一组特定坐标
   * @param xCoord
   * @param yCoord
   * @returns
   */
  scrollTo: (xCoord: ScrollToOptions | number, yCoord?: number) => void;
  /**
   * 设置滚动条到顶部的距离
   * @param value
   * @returns
   */
  setScrollTop: (value: number) => void;
  /**
   * 设置滚动条到左边的距离
   * @param value
   * @returns
   */
  setScrollLeft: (value: number) => void;
  /**
   * 手动更新滚动条状态
   * @returns
   */
  update: () => void;
  /**
   * 触发滚动事件
   * @returns
   */
  onScroll: () => void;
}

export const InternalScrollbar: React.ForwardRefRenderFunction<ScrollbarRef, ScrollbarProps> = (
  props,
  ref
) => {
  const {
    prefixCls = 'l-scrollbar',
    className,
    style,
    native = false,
    always,
    height,
    maxHeight,
    wrapClassName,
    wrapStyle,
    size: customizeSize,
    minSize = 20,
    children,
    onScroll
  } = props;
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const size = useSize(wrapRef);

  // ===================== Style =====================
  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-small`]: customizeSize === 'small'
    },
    className
  );
  const wrapClasses = classNames(
    `${prefixCls}-wrap`,
    {
      [`${prefixCls}-wrap-native-hidden`]: !props.native
    },
    wrapClassName
  );
  const mergeWrapStyle = useMemo(() => {
    const style: React.CSSProperties = {
      ...wrapStyle
    };

    if (height) {
      style.height = addUnit(height);
    }

    if (maxHeight) {
      style.maxHeight = addUnit(maxHeight);
    }

    return style;
  }, [wrapStyle, height, maxHeight]);

  const [sizeHeight, setSizeHeight] = useState<number | undefined>(0);
  const [sizeWidth, setSizeWidth] = useState<number | undefined>(0);

  const [ratioY, setRatioY] = useState<number>(1);
  const [ratioX, setRatioX] = useState<number>(1);

  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);

  useEffect(() => {
    update();
  }, [size]);

  const update = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const offsetHeight = wrap.offsetHeight - GAP;
    const offsetWidth = wrap.offsetWidth - GAP;
    const scrollHeight = wrap.scrollHeight;
    const scrollWidth = wrap.scrollWidth;

    // 计算滚动条尺寸
    const originalHeight = offsetHeight ** 2 / scrollHeight;
    const originalWidth = offsetWidth ** 2 / scrollWidth;
    const height = Math.max(originalHeight, minSize);
    const width = Math.max(originalWidth, minSize);

    setSizeHeight(height + GAP < offsetHeight ? height : undefined);
    setSizeWidth(width + GAP < offsetWidth ? width : undefined);

    const ratioY =
      originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
    const ratioX = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));

    setRatioY(ratioY);
    setRatioX(ratioX);
  };

  useEventListener('resize', update);

  // ===================== ref function =====================
  useImperativeHandle(
    ref,
    () => {
      return {
        scrollTo,
        setScrollTop,
        setScrollLeft,
        update,
        onScroll: handleScroll
      };
    },
    []
  );

  const handleScroll = () => {
    const wrap = wrapRef.current;

    if (wrap) {
      const offsetHeight = wrap.offsetHeight - GAP;
      const offsetWidth = wrap.offsetWidth - GAP;

      setMoveY(((wrap.scrollTop * 100) / offsetHeight) * ratioY);
      setMoveX(((wrap.scrollLeft * 100) / offsetWidth) * ratioX);

      onScroll?.({
        scrollTop: wrap.scrollTop,
        scrollLeft: wrap.scrollLeft
      });
    }
  };

  const scrollTo = (xCoord: ScrollToOptions | number, yCoord?: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // if (isObject(arg1)) {
    //   wrap.scrollTo(arg1)
    // }

    if (isNumber(xCoord) && isNumber(yCoord)) {
      wrap.scrollTo(xCoord, yCoord);
    }
  };

  const setScrollTop = (value: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (!isNumber(value)) {
      return;
    }
    wrap.scrollTop = value;
  };

  const setScrollLeft = (value: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (!isNumber(value)) {
      return;
    }
    wrap.scrollTop = value;
  };

  return (
    <div ref={scrollbarRef} className={classes} style={style}>
      <div ref={wrapRef} className={wrapClasses} style={mergeWrapStyle} onScroll={handleScroll}>
        {children}
      </div>
      {!native && wrapRef.current && (
        <>
          <Bar
            prefixCls={prefixCls}
            wrapElement={wrapRef.current!}
            always={always}
            move={moveX}
            ratio={ratioX!}
            size={sizeWidth}
          />
          <Bar
            prefixCls={prefixCls}
            wrapElement={wrapRef.current!}
            always={always}
            move={moveY}
            ratio={ratioY!}
            size={sizeHeight}
            direction="vertical"
          />
        </>
      )}
    </div>
  );
};

export const Scrollbar = forwardRef<ScrollbarRef, ScrollbarProps>(InternalScrollbar);
