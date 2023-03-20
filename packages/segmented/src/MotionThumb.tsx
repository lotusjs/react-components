import React, { useState, useRef, useMemo } from 'react';
import CSSMotion from 'rc-motion';
import { classNames } from '@pansy/shared';
import { useLayoutEffect, composeRef } from '@lotus-design/utils';
import type { SegmentedValue, Direction } from './Segmented';

type ThumbReact = {
  left: number;
  right: number;
  width: number;
} | null;

export interface MotionThumbInterface {
  prefixCls: string;
  containerRef: React.RefObject<HTMLDivElement>;
  value: SegmentedValue;
  motionName: string;
  direction?: Direction;
  getValueIndex: (value: SegmentedValue) => number;
  onMotionStart: VoidFunction;
  onMotionEnd: VoidFunction;
}

const calcThumbStyle = (targetElement: HTMLElement | null | undefined): ThumbReact =>
  targetElement
    ? {
        left: targetElement.offsetLeft,
        right:
          (targetElement.parentElement!.clientWidth as number) -
          targetElement.clientWidth -
          targetElement.offsetLeft,
        width: targetElement.clientWidth
      }
    : null;

const toPX = (value: number) => (value !== undefined ? `${value}px` : undefined);

export function MotionThumb(props: MotionThumbInterface) {
  const {
    prefixCls,
    containerRef,
    value,
    direction,
    motionName,
    getValueIndex,
    onMotionStart,
    onMotionEnd
  } = props;

  const thumbRef = useRef<HTMLDivElement>(null);
  const [prevValue, setPrevValue] = useState(value);

  // =========================== Effect ===========================
  const findValueElement = (val: SegmentedValue) => {
    const index = getValueIndex(val);

    const ele = containerRef.current?.querySelectorAll<HTMLDivElement>(`.${prefixCls}-item`)[index];

    return ele?.offsetParent && ele;
  };

  const [prevStyle, setPrevStyle] = useState<ThumbReact>(null);
  const [nextStyle, setNextStyle] = useState<ThumbReact>(null);

  useLayoutEffect(() => {
    if (prevValue !== value) {
      const prev = findValueElement(prevValue);
      const next = findValueElement(value);

      const calcPrevStyle = calcThumbStyle(prev);
      const calcNextStyle = calcThumbStyle(next);

      setPrevValue(value);
      setPrevStyle(calcPrevStyle);
      setNextStyle(calcNextStyle);

      if (prev && next) {
        onMotionStart();
      } else {
        onMotionEnd();
      }
    }
  }, [value]);

  const thumbStart = useMemo(
    () =>
      direction === 'rtl' ? toPX(-(prevStyle?.right as number)) : toPX(prevStyle?.left as number),
    [direction, prevStyle]
  );
  const thumbActive = useMemo(
    () =>
      direction === 'rtl' ? toPX(-(nextStyle?.right as number)) : toPX(nextStyle?.left as number),
    [direction, nextStyle]
  );

  // =========================== Motion ===========================
  const onAppearStart = () => {
    return {
      transform: `translateX(var(--thumb-start-left))`,
      width: `var(--thumb-start-width)`
    };
  };
  const onAppearActive = () => {
    return {
      transform: `translateX(var(--thumb-active-left))`,
      width: `var(--thumb-active-width)`
    };
  };
  const onAppearEnd = () => {
    setPrevStyle(null);
    setNextStyle(null);
    onMotionEnd();
  };

  // =========================== Render ===========================
  // No need motion when nothing exist in queue
  if (!prevStyle || !nextStyle) {
    return null;
  }

  return (
    <CSSMotion
      visible
      motionName={motionName}
      motionAppear
      onAppearStart={onAppearStart}
      onAppearActive={onAppearActive}
      onAppearEnd={onAppearEnd}
    >
      {({ className: motionClassName, style: motionStyle }, ref) => {
        const mergedStyle = {
          ...motionStyle,
          '--thumb-start-left': thumbStart,
          '--thumb-start-width': toPX(prevStyle?.width),
          '--thumb-active-left': thumbActive,
          '--thumb-active-width': toPX(nextStyle?.width)
        } as React.CSSProperties;

        // It's little ugly which should be refactor when @umi/test update to latest jsdom
        const motionProps = {
          ref: composeRef(thumbRef, ref),
          style: mergedStyle,
          className: classNames(`${prefixCls}-thumb`, motionClassName)
        };

        if (process.env.NODE_ENV === 'test') {
          (motionProps as any)['data-test-style'] = JSON.stringify(mergedStyle);
        }

        return <div {...motionProps} />;
      }}
    </CSSMotion>
  );
}
