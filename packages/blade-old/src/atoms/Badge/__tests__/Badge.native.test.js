import React from 'react';

import Badge from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('Renders <Badge /> (Stadium)', () => {
  it('renders subtle positive(Stadium) <Badge />', () => {
    const title = 'positive';
    const { container, getByText } = renderWithTheme(
      <Badge variant="positive" shape="stadium" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle negative(Stadium) <Badge />', () => {
    const title = 'negative';
    const { container, getByText } = renderWithTheme(
      <Badge variant="negative" shape="stadium" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle information(Stadium) <Badge />', () => {
    const title = 'information';
    const { container, getByText } = renderWithTheme(
      <Badge variant="information" shape="stadium" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle warning(Stadium) <Badge />', () => {
    const title = 'warning';
    const { container, getByText } = renderWithTheme(
      <Badge variant="warning" shape="stadium" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle neutral(Stadium) <Badge />', () => {
    const title = 'neutral';
    const { container, getByText } = renderWithTheme(
      <Badge shape="stadium" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle cyan(Stadium) <Badge />', () => {
    const title = 'cyan';
    const { container, getByText } = renderWithTheme(
      <Badge variant="cyan" shape="stadium" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid positive(Stadium) <Badge />', () => {
    const title = 'positive';
    const { container, getByText } = renderWithTheme(
      <Badge variant="positive" shape="stadium" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid negative(Stadium) <Badge />', () => {
    const title = 'negative';
    const { container, getByText } = renderWithTheme(
      <Badge variant="negative" shape="stadium" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid information(Stadium) <Badge />', () => {
    const title = 'information';
    const { container, getByText } = renderWithTheme(
      <Badge variant="information" shape="stadium" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid warning(Stadium) <Badge />', () => {
    const title = 'warning';
    const { container, getByText } = renderWithTheme(
      <Badge variant="warning" shape="stadium" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid neutral(Stadium) <Badge />', () => {
    const title = 'neutral';
    const { container, getByText } = renderWithTheme(
      <Badge variant="neutral" shape="stadium">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid cyan(Stadium) <Badge />', () => {
    const title = 'positive';
    const { container, getByText } = renderWithTheme(
      <Badge variant="cyan" shape="stadium" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});

describe('Renders <Badge /> (Rectangle)', () => {
  it('renders subtle positive(rectangle) <Badge />', () => {
    const title = 'positive';
    const { container, getByText } = renderWithTheme(
      <Badge variant="positive" shape="rectangle" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle negative(rectangle) <Badge />', () => {
    const title = 'negative';
    const { container, getByText } = renderWithTheme(
      <Badge variant="negative" shape="rectangle" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle information(rectangle) <Badge />', () => {
    const title = 'information';
    const { container, getByText } = renderWithTheme(
      <Badge variant="information" shape="rectangle" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle warning(rectangle) <Badge />', () => {
    const title = 'warning';
    const { container, getByText } = renderWithTheme(
      <Badge variant="warning" shape="rectangle" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle neutral(rectangle) <Badge />', () => {
    const title = 'neutral';
    const { container, getByText } = renderWithTheme(
      <Badge shape="rectangle" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders subtle cyan(rectangle) <Badge />', () => {
    const title = 'cyan';
    const { container, getByText } = renderWithTheme(
      <Badge variant="cyan" shape="rectangle" fill="subtle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid positive(rectangle) <Badge />', () => {
    const title = 'positive';
    const { container, getByText } = renderWithTheme(
      <Badge variant="positive" shape="rectangle" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid negative(rectangle) <Badge />', () => {
    const title = 'negative';
    const { container, getByText } = renderWithTheme(
      <Badge variant="negative" shape="rectangle" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid information(rectangle) <Badge />', () => {
    const title = 'information';
    const { container, getByText } = renderWithTheme(
      <Badge variant="information" shape="rectangle" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid warning(rectangle) <Badge />', () => {
    const title = 'warning';
    const { container, getByText } = renderWithTheme(
      <Badge variant="warning" shape="rectangle" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid neutral(rectangle) <Badge />', () => {
    const title = 'neutral';
    const { container, getByText } = renderWithTheme(
      <Badge variant="neutral" shape="rectangle">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
  it('renders solid cyan(rectangle) <Badge />', () => {
    const title = 'cyan';
    const { container, getByText } = renderWithTheme(
      <Badge variant="cyan" shape="rectangle" fill="solid">
        {title}
      </Badge>,
    );
    const titleElement = getByText(title.toUpperCase());
    expect(titleElement).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
