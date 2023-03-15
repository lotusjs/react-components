import React, { forwardRef, useRef, useMemo, useState } from 'react';
import { classNames, omit } from '@pansy/shared';
import { useMergedState, composeRef } from '@lotus-design/utils';
import { normalizeOptions } from './utils';

import MotionThumb from './MotionThumb';

export type SegmentedValue = string | number;

export type SegmentedRawOption = SegmentedValue;

export interface SegmentedLabeledOption {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  value: SegmentedRawOption;
  /**
   * html `title` property for label
   */
  title?: string;
}

export type SegmentedOptions = (SegmentedRawOption | SegmentedLabeledOption)[];

export interface SegmentedProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange'> {
  options: SegmentedOptions;
  defaultValue?: SegmentedValue;
  value?: SegmentedValue;
  onChange?: (value: SegmentedValue) => void;
  disabled?: boolean;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
  motionName?: string;
}

export interface InternalSegmentedOptionProps {
  prefixCls: string;
  className?: string;
  disabled?: boolean;
  checked: boolean;
  label: React.ReactNode;
  title?: string;
  value: SegmentedRawOption;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: SegmentedRawOption) => void;
}

const InternalSegmentedOption: React.FC<InternalSegmentedOptionProps> = (props) => {
  const { prefixCls, className, disabled, checked, label, title, value, onChange } = props;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    onChange(event, value);
  };

  return (
    <label
      className={classNames(className, {
        [`${prefixCls}-item-disabled`]: disabled
      })}
    >
      <input
        className={`${prefixCls}-item-input`}
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />
      <div className={`${prefixCls}-item-label`} title={title}>
        {label}
      </div>
    </label>
  );
};

export const Segmented = forwardRef<HTMLDivElement, SegmentedProps>((props, ref) => {
  const {
    prefixCls = 'l-segmented',
    direction,
    options = [],
    disabled,
    defaultValue,
    value,
    onChange,
    className = '',
    motionName = 'thumb-motion',
    ...restProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMemo(
    () => composeRef<HTMLDivElement>(containerRef, ref),
    [containerRef, ref]
  );

  const segmentedOptions = useMemo(() => {
    return normalizeOptions(options);
  }, [options]);

  // Note: We should not auto switch value when value not exist in options
  // which may break single source of truth.
  const [rawValue, setRawValue] = useMergedState(segmentedOptions[0]?.value, {
    value,
    defaultValue
  });

  // ======================= Change ========================
  const [thumbShow, setThumbShow] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, val: SegmentedRawOption) => {
    if (disabled) {
      return;
    }

    setRawValue(val);

    onChange?.(val);
  };

  const divProps = omit(restProps, ['children']);

  return (
    <div
      {...divProps}
      className={classNames(
        prefixCls,
        {
          [`${prefixCls}-rtl`]: direction === 'rtl',
          [`${prefixCls}-disabled`]: disabled
        },
        className
      )}
      ref={mergedRef}
    >
      <div className={`${prefixCls}-group`}>
        <MotionThumb
          prefixCls={prefixCls}
          value={rawValue}
          containerRef={containerRef}
          motionName={`${prefixCls}-${motionName}`}
          getValueIndex={(val) => segmentedOptions.findIndex((n) => n.value === val)}
          onMotionStart={() => {
            setThumbShow(true);
          }}
          onMotionEnd={() => {
            setThumbShow(false);
          }}
        />
        {segmentedOptions.map((segmentedOption) => (
          <InternalSegmentedOption
            key={segmentedOption.value}
            prefixCls={prefixCls}
            className={classNames(segmentedOption.className, `${prefixCls}-item`, {
              [`${prefixCls}-item-selected`]: segmentedOption.value === rawValue && !thumbShow
            })}
            checked={segmentedOption.value === rawValue}
            onChange={handleChange}
            {...segmentedOption}
            disabled={!!disabled || !!segmentedOption.disabled}
          />
        ))}
      </div>
    </div>
  );
});

Segmented.displayName = 'Segmented';
