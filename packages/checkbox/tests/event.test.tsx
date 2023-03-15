import React from 'react';
import { KeyCode } from '@pansy/shared';
import { fireEvent, render } from '@testing-library/react';
import { Checkbox } from '../src';

describe('Checkbox.Event', () => {
  it('onFocus', () => {
    const onFocus = jest.fn();

    const { container } = render(<Checkbox onFocus={onFocus} />);
    const inputEl = container.querySelector('input')!;

    fireEvent.focus(inputEl);

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('onBlur', () => {
    const onBlur = jest.fn();

    const { container } = render(<Checkbox onBlur={onBlur} />);
    const inputEl = container.querySelector('input')!;

    fireEvent.focus(inputEl);
    fireEvent.blur(inputEl);

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('onChange', () => {
    const onChange = jest.fn();

    const { container } = render(<Checkbox onChange={onChange} />);
    const inputEl = container.querySelector('input')!;

    fireEvent.click(inputEl);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(inputEl.checked).toBe(true);
  });

  it('onChange disabled', () => {
    const onChange = jest.fn();

    const { container } = render(<Checkbox onChange={onChange} disabled />);
    const input = container.querySelector('input')!;

    fireEvent.click(input);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('onBlur', () => {
    const onBlur = jest.fn();

    const { container } = render(<Checkbox onBlur={onBlur} />);
    const inputEl = container.querySelector('input')!;

    fireEvent.focus(inputEl);
    fireEvent.blur(inputEl);

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('onKeyDown', () => {
    const onKeyDown = jest.fn();

    const { container } = render(<Checkbox onKeyDown={onKeyDown} />);
    const inputEl = container.querySelector('input')!;

    fireEvent.keyDown(inputEl, { which: KeyCode.TAB });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('onKeyPress', () => {
    const onKeyPress = jest.fn();

    const { container } = render(<Checkbox onKeyPress={onKeyPress} />);
    const inputEl = container.querySelector('input')!;

    // https://github.com/testing-library/react-testing-library/issues/269
    fireEvent.keyPress(inputEl, { key: 'Enter', code: 13, charCode: 13 });

    expect(onKeyPress).toHaveBeenCalledTimes(1);
  });

  it('onKeyUp', () => {
    const onKeyUp = jest.fn();

    const { container } = render(<Checkbox onKeyUp={onKeyUp} />);
    const inputEl = container.querySelector('input')!;

    fireEvent.keyUp(inputEl, { which: KeyCode.TAB });

    expect(onKeyUp).toHaveBeenCalledTimes(1);
  });

  it('has default keyboard events handler', () => {
    const onKeyDown = jest.fn();
    const onKeyPress = jest.fn();
    const onKeyUp = jest.fn();

    const { container } = render(
      <div onKeyDown={onKeyDown} onKeyPress={onKeyPress} onKeyUp={onKeyUp}>
        <Checkbox />
      </div>
    );
    const inputEl = container.querySelector('input')!;

    fireEvent.keyDown(inputEl, { which: KeyCode.TAB });
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    fireEvent.keyPress(inputEl, { key: 'Enter', code: 13, charCode: 13 });
    expect(onKeyPress).toHaveBeenCalledTimes(1);

    fireEvent.keyUp(inputEl, { which: KeyCode.TAB });
    expect(onKeyUp).toHaveBeenCalledTimes(1);
  });

  it('stopPropagation and preventDefault', () => {
    const onChange = jest.fn();

    const { container } = render(
      <div onChange={onChange}>
        <Checkbox
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      </div>
    );

    const inputEl = container.querySelector('input')!;

    fireEvent.click(inputEl);
    expect(onChange).not.toHaveBeenCalled();
  });
});
