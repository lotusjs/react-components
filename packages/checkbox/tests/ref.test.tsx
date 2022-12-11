import * as React from 'react';
import { render } from '@testing-library/react';
import Checkbox from '../src';

import type { CheckboxRef } from '../src';

describe('Checkbox.Ref', () => {
  it('focus and blur should work', () => {
    const ref = React.createRef<CheckboxRef>();

    const { container } = render(<Checkbox ref={ref} />);
    const inputEl = container.querySelector('input')!;

    ref.current?.focus();
    expect(document.activeElement).toBe(inputEl);

    ref.current?.blur();
    expect(document.activeElement).not.toBe(inputEl);
  });

  it('input should work', () => {
    const ref = React.createRef<CheckboxRef>();

    const { container } = render(<Checkbox ref={ref} />);
    const inputEl = container.querySelector('input')!;

    expect(ref.current?.input).toBe(inputEl);
  });
});
