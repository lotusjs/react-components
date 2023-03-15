import React, { forwardRef } from 'react';
import { useMergedState } from '@lotus-design/utils';
import { classNames, KeyCode } from '@pansy/shared';

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

export interface SwitchProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  className?: string;
  prefixCls?: string;
  disabled?: boolean;
  checkedText?: React.ReactNode;
  unCheckedText?: React.ReactNode;
  onChange?: SwitchChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onClick?: SwitchClickEventHandler;
  tabIndex?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  loadingIcon?: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>((props, ref) => {
  const {
    prefixCls = 'l-switch',
    className,
    checked,
    defaultChecked,
    disabled,
    loadingIcon,
    checkedText,
    unCheckedText,
    onClick,
    onChange,
    onKeyDown,
    ...restProps
  } = props;

  const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
    value: checked,
    defaultValue: defaultChecked
  });

  function triggerChange(
    newChecked: boolean,
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>
  ) {
    let mergedChecked = innerChecked;

    if (!disabled) {
      mergedChecked = newChecked;
      setInnerChecked(mergedChecked);
      onChange?.(mergedChecked, event);
    }

    return mergedChecked;
  }

  function onInternalKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.which === KeyCode.LEFT) {
      triggerChange(false, e);
    } else if (e.which === KeyCode.RIGHT) {
      triggerChange(true, e);
    }
    onKeyDown?.(e);
  }

  function onInternalClick(e: React.MouseEvent<HTMLButtonElement>) {
    const ret = triggerChange(!innerChecked, e);
    onClick?.(ret, e);
  }

  return (
    <button
      {...restProps}
      type="button"
      role="switch"
      aria-checked={innerChecked}
      disabled={disabled}
      className={classNames(prefixCls, className, {
        [`${prefixCls}-checked`]: innerChecked,
        [`${prefixCls}-disabled`]: disabled
      })}
      ref={ref}
      onKeyDown={onInternalKeyDown}
      onClick={onInternalClick}
    >
      {loadingIcon}
      <span className={`${prefixCls}-inner`}>
        <span className={`${prefixCls}-inner-checked`}>{checkedText}</span>
        <span className={`${prefixCls}-inner-unchecked`}>{unCheckedText}</span>
      </span>
    </button>
  );
});

export default Switch;
