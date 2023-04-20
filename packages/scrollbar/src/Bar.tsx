import React, { useRef, useState, useEffect } from 'react';
import { classNames, isBrowser } from '@pansy/shared';
import { NodeJSTimeout } from '@pansy/shared/types';
import { useEventListener, useGetState } from '@pansy/react-hooks';
import { BAR_MAP } from './constants';

import type { Always } from './Scrollbar';

export interface BarProps {
  prefixCls?: string;
  /**
   * 滚动条方向
   * @default 'horizontal'
   */
  direction?: 'vertical' | 'horizontal';
  size?: number;
  move?: number;
  ratio: number;
  always?: Always;
  wrapElement: HTMLDivElement;
}

type OriginalOnSelectStart = ((this: GlobalEventHandlers, ev: Event) => any) | null;

let cursorDown = false;
// 光标是否离开
let cursorLeave = false;
let originalOnSelectStart: OriginalOnSelectStart = isBrowser ? document.onselectstart : null;

const genBarStyle = ({
  move,
  size,
  bar
}: Pick<BarProps, 'move' | 'size'> & {
  bar: (typeof BAR_MAP)[keyof typeof BAR_MAP];
}): React.CSSProperties => ({
  [bar.size]: size,
  transform: `translate${bar.axis}(${move}%)`
});

export const Bar: React.FC<BarProps> = (props) => {
  const { prefixCls, size, move, ratio, always, direction = 'horizontal', wrapElement } = props;
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const offsetRatioRef = useRef<number>(1);

  const bar = BAR_MAP[direction];
  const [visible, setVisible] = useState(false);
  const [, setThumbState, getThumbState] = useGetState<Partial<Record<'X' | 'Y', number>>>({});

  useEffect(() => {
    let timeout: NodeJSTimeout;
    const trackElement = trackRef.current;
    const thumbElement = thumbRef.current;

    if (trackElement && wrapElement && thumbElement) {
      timeout = setTimeout(() => {
        const offsetRatio =
          trackElement[bar.offset] ** 2 /
          wrapElement[bar.scrollSize] /
          ratio /
          thumbElement[bar.offset];
        offsetRatioRef.current = offsetRatio;
      }, 0);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [trackRef.current, wrapElement, thumbRef.current, ratio, visible]);

  // ===================== Style =====================
  const thumbStyle = genBarStyle({
    size,
    move,
    bar: bar
  });

  useEffect(() => {
    restoreOnselectstart();
  }, []);

  const restoreOnselectstart = () => {
    if (document.onselectstart !== originalOnSelectStart) {
      document.onselectstart = originalOnSelectStart;
    }
  };

  const mouseMoveScrollbarHandler = () => {
    cursorLeave = false;
    setVisible(!!size);
  };

  const mouseLeaveScrollbarHandler = () => {
    cursorLeave = true;
    setVisible(cursorDown);
  };

  useEventListener('mousemove', mouseMoveScrollbarHandler, {
    target: wrapElement.parentElement
  });

  useEventListener('mouseleave', mouseLeaveScrollbarHandler, {
    target: wrapElement.parentElement
  });

  const startDrag = (e: MouseEvent) => {
    e.stopImmediatePropagation?.();
    cursorDown = true;

    document.addEventListener('mousemove', mouseMoveDocumentHandler);
    document.addEventListener('mouseup', mouseUpDocumentHandler);

    originalOnSelectStart = document.onselectstart;
    document.onselectstart = () => false;
  };

  const mouseMoveDocumentHandler = (e: MouseEvent) => {
    const trackElement = trackRef.current;
    const thumbElement = thumbRef.current;
    const offsetRatio = offsetRatioRef.current;

    if (!trackElement || !thumbElement || !wrapElement) return;
    if (!cursorDown) return;

    const thumbState = getThumbState();
    const prevPage = thumbState[bar.axis];
    if (!prevPage) return;

    const offset = (trackElement.getBoundingClientRect()[bar.direction] - e[bar.client]) * -1;

    const thumbClickPosition = thumbElement[bar.offset] - prevPage;
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100 * offsetRatio) / trackElement[bar.offset];
    wrapElement[bar.scroll] = (thumbPositionPercentage * wrapElement[bar.scrollSize]) / 100;
  };

  const mouseUpDocumentHandler = () => {
    cursorDown = false;
    setThumbState((prev) => ({
      ...prev,
      [bar.axis]: 0
    }));

    document.removeEventListener('mousemove', mouseMoveDocumentHandler);
    document.removeEventListener('mouseup', mouseUpDocumentHandler);

    restoreOnselectstart();

    if (cursorLeave) {
      setVisible(false);
    }
  };

  const clickTrackHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const trackElement = trackRef.current;
    const thumbElement = thumbRef.current;
    const offsetRatio = offsetRatioRef.current;

    if (!trackElement || !thumbElement || !wrapElement) return;

    const offset = Math.abs(
      (e.target as HTMLElement).getBoundingClientRect()[bar.direction] - e[bar.client]
    );

    const thumbHalf = thumbElement[bar.offset] / 2;
    const thumbPositionPercentage =
      ((offset - thumbHalf) * 100 * offsetRatio) / trackElement[bar.offset];

    wrapElement[bar.scroll] = (thumbPositionPercentage * wrapElement[bar.scrollSize]) / 100;
  };

  const clickThumbHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (e.ctrlKey || [1, 2].includes(e.button)) return;

    window.getSelection()?.removeAllRanges();
    startDrag(e as unknown as MouseEvent);

    const el = e.currentTarget as HTMLDivElement;
    if (!el) return;

    setThumbState((prev) => ({
      ...prev,
      [bar.axis]: el[bar.offset] - (e[bar.client] - el.getBoundingClientRect()[bar.direction])
    }));
  };

  const barStyle: React.CSSProperties = {};

  if (always === 'show' || visible) {
    barStyle.display = 'block';
  } else {
    barStyle.display = 'none';
  }

  if (always === 'hidden') {
    barStyle.display = 'none';
  }

  return (
    <div
      ref={trackRef}
      className={classNames(`${prefixCls}-bar`, {
        [`${prefixCls}-bar-${direction}`]: true
      })}
      onMouseDown={clickTrackHandler}
      style={barStyle}
    >
      <div
        ref={thumbRef}
        style={thumbStyle}
        className={`${prefixCls}-bar-thumb`}
        onMouseDown={clickThumbHandler}
      />
    </div>
  );
};
