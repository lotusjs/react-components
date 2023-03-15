import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Checkbox } from '../src';

describe('Checkbox', () => {
  it('works', () => {
    const { container } = render(<Checkbox />);
    const inputEl = container.querySelector('input')!;

    expect(inputEl.checked).toBe(false);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(true);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(false);
  });

  it('click radio', () => {
    const { container } = render(<Checkbox type="radio" />);
    const inputEl = container.querySelector('input')!;

    expect(inputEl.checked).toBe(false);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(true);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(true);
  });

  it('click checkbox', () => {
    const { container } = render(<Checkbox type="checkbox" />);
    const inputEl = container.querySelector('input')!;

    expect(inputEl.checked).toBe(false);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(true);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(false);
  });

  it('control mode', () => {
    const { container } = render(<Checkbox checked />);
    const inputEl = container.querySelector('input')!;

    expect(inputEl.checked).toBe(true);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(true);

    fireEvent.click(inputEl);
    expect(inputEl.checked).toBe(true);
  });

  it('passes data-* props to input', () => {
    const { container } = render(<Checkbox data-type="my-data-type" />);
    const inputEl = container.querySelector('input')!;

    expect(inputEl.getAttribute('data-type')).toEqual('my-data-type');
  });

  it('passes aria-* props to input', () => {
    const { container } = render(<Checkbox aria-label="my-aria-label" />);
    const inputEl = container.querySelector('input')!;

    expect(inputEl.getAttribute('aria-label')).toEqual('my-aria-label');
  });

  it('passes role prop to input', () => {
    // eslint-disable-next-line jsx-a11y/aria-role
    const { container } = render(<Checkbox role="my-role" />);
    const inputEl = container.querySelector('input')!;

    // @ts-ignore
    expect(inputEl.attributes.role.value).toEqual('my-role');
  });

  it('passes value prop to input', () => {
    const { container } = render(<Checkbox value="my-custom-value" />);
    const inputEl = container.querySelector('input')!;

    // @ts-ignore
    expect(inputEl.attributes.value.value).toEqual('my-custom-value');
  });

  it('passes number value prop to input', () => {
    const { container } = render(<Checkbox value={6} />);
    const inputEl = container.querySelector('input')!;

    // @ts-ignore
    expect(inputEl.attributes.value.value).toEqual('6');
  });

  it('passes title prop to input', () => {
    const { container } = render(<Checkbox title="my-custom-title" />);
    const inputEl = container.querySelector('input')!;

    // @ts-ignore
    expect(inputEl.attributes.title.value).toEqual('my-custom-title');
  });

  it('passes required prop to input', () => {
    const { container } = render(<Checkbox required />);

    const inputEl = container.querySelector('input')!;
    expect(inputEl.hasAttribute('required')).toBe(true);
  });
});
