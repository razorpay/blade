import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Breadcrumb, BreadcrumbItem } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Breadcrumb />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
        <BreadcrumbItem href="/contact">Contact</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render current page item as text (not a link)', () => {
    const { toJSON, getByText } = renderWithTheme(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/contact" isCurrentPage>
          Contact
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Contact')).toBeTruthy();
  });

  it('should work with showLastSeparator', () => {
    const { toJSON } = renderWithTheme(
      <Breadcrumb showLastSeparator>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/contact">Contact</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call onClick when BreadcrumbItem is pressed', () => {
    const onClick = jest.fn();
    const { getByText } = renderWithTheme(
      <Breadcrumb>
        <BreadcrumbItem onClick={onClick} href="/home">
          Home
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    fireEvent.press(getByText('Home'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render with white color', () => {
    const { toJSON } = renderWithTheme(
      <Breadcrumb color="white">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/about" isCurrentPage>
          About
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with small size', () => {
    const { toJSON } = renderWithTheme(
      <Breadcrumb size="small">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with large size', () => {
    const { toJSON } = renderWithTheme(
      <Breadcrumb size="large">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should support data-analytics attributes', () => {
    const { toJSON } = renderWithTheme(
      <Breadcrumb data-analytics-breadcrumb="basicRoutes">
        <BreadcrumbItem href="/" data-analytics-breadcrumb-item="home">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
