/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react-native';
import {
  CardBody,
  Card,
  CardFooter,
  CardFooterLeading,
  CardFooterTrailing,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderBadge,
} from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { InfoIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';

describe('<Card />', () => {
  it('should render a plain Card', () => {
    const { toJSON } = renderWithTheme(
      <Card backgroundColor="surface.background.gray.moderate" elevation="highRaised">
        <CardBody>
          <Text>Plain Card</Text>
        </CardBody>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a border when elevation is `none`', () => {
    const { toJSON } = renderWithTheme(
      <Card elevation="none">
        <CardBody>
          <Text>Plain Card</Text>
        </CardBody>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a Card without 0 padding', () => {
    const { toJSON } = renderWithTheme(
      <Card padding="spacing.0">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a Card with Header', () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const { getByText, toJSON } = renderWithTheme(
      <Card>
        <CardHeader>
          <CardHeaderLeading
            title={cardTitle}
            subtitle={cardSubtitle}
            prefix={<CardHeaderIcon icon={InfoIcon} />}
            suffix={<CardHeaderCounter value={12} />}
          />
          <CardHeaderTrailing visual={<CardHeaderBadge>NEW</CardHeaderBadge>} />
        </CardHeader>
        <CardBody>
          <Text>Plain Card</Text>
        </CardBody>
      </Card>,
    );

    expect(getByText(cardTitle)).toBeTruthy();
    expect(getByText(cardSubtitle)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a Card with Footer', () => {
    const footerTitle = 'Card Header';
    const footerSubtitle = 'Card subtitle';
    const primaryFn = jest.fn();
    const secondaryFn = jest.fn();
    const { getByText, toJSON } = renderWithTheme(
      <Card>
        <CardBody>
          <Text>Plain Card</Text>
        </CardBody>
        <CardFooter>
          <CardFooterLeading title={footerTitle} subtitle={footerSubtitle} />
          <CardFooterTrailing
            actions={{
              primary: {
                text: 'Save',
                onClick: primaryFn,
              },
              secondary: {
                text: 'Delete',
                onClick: secondaryFn,
              },
            }}
          />
        </CardFooter>
      </Card>,
    );

    expect(getByText(footerTitle)).toBeTruthy();
    expect(getByText(footerSubtitle)).toBeTruthy();

    // Test action buttons
    const primaryButton = getByText('Save');
    fireEvent.press(primaryButton);
    expect(primaryFn).toHaveBeenCalledTimes(1);

    const secondaryButton = getByText('Delete');
    fireEvent.press(secondaryButton);
    expect(secondaryFn).toHaveBeenCalledTimes(1);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw error if any sub card components are used outside of Card', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() => renderWithTheme(<CardBody>body</CardBody>)).toThrow(
      '[Blade: Card]: CardBody cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardHeader />)).toThrow(
      '[Blade: Card]: CardHeader cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardHeaderLeading title="" />)).toThrow(
      '[Blade: Card]: CardHeaderLeading cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardHeaderTrailing />)).toThrow(
      '[Blade: Card]: CardHeaderTrailing cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardFooter />)).toThrow(
      '[Blade: Card]: CardFooter cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardFooterLeading title="" />)).toThrow(
      '[Blade: Card]: CardFooterLeading cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardFooterTrailing />)).toThrow(
      '[Blade: Card]: CardFooterTrailing cannot be used outside of Card component',
    );
    mockConsoleError.mockRestore();
  });

  it('should restrict childrens & only allow CardHeader, CardBody & CardFooter in Card', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <Card>
          <BaseBox>some random Box</BaseBox>
          <CardHeader />
          <CardBody>Plain Card</CardBody>
          <CardFooter />
        </Card>,
      ),
    ).toThrow(
      '[Blade: Card]: Only `CardHeader, CardBody, CardFooter` components are accepted in `Card` children',
    );
    mockConsoleError.mockRestore();
  });

  it('should restrict childrens in CardHeader', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <Card>
          <CardHeader>
            <CardHeaderLeading title="" />
            <BaseBox>some random children</BaseBox>
            <CardHeaderTrailing />
          </CardHeader>
          <CardBody>Plain Card</CardBody>
          <CardFooter />
        </Card>,
      ),
    ).toThrow(
      '[Blade: CardHeader]: Only `CardHeaderLeading, CardHeaderTrailing` components are accepted in `CardHeader` children',
    );
    mockConsoleError.mockRestore();
  });

  it('should restrict childrens in CardFooter', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <Card>
          <CardHeader />
          <CardBody>Plain Card</CardBody>
          <CardFooter>
            <CardFooterLeading />
            <CardFooterTrailing />
            <BaseBox>some random children</BaseBox>
          </CardFooter>
        </Card>,
      ),
    ).toThrow(
      '[Blade: CardFooter]: Only `CardFooterLeading, CardFooterTrailing` components are accepted in `CardFooter` children',
    );
    mockConsoleError.mockRestore();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Card testID="card-test">
        <CardBody>
          <Text>Plain Card</Text>
        </CardBody>
      </Card>,
    );
    expect(getByTestId('card-test')).toBeTruthy();
  });
});
