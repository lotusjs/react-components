import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Checkbox } from '../src';

describe('Checkbox.Props', () => {
  it('autoFocus', () => {
    const handleFocus = jest.fn();

    render(<Checkbox autoFocus onFocus={handleFocus} />);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('disabled', () => {
    const { container } = render(<Checkbox disabled />);
    const inputEl = container.querySelector('input')!;

    expect(inputEl.checked).toBe(false);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(false);
  });
});
