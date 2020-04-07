import React from 'react';
import Link from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('Renders <Link /> correctly', () => {
  it('snapshot testing', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link>{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing, renders visited link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link visited>{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing, renders small link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="small">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing, renders medium link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="medium">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing, renders large link', () => {
    const displayText = 'Displaying some link';
    const { container } = renderWithTheme(<Link size="large">{displayText}</Link>);
    expect(container).toMatchSnapshot();
  });
});
