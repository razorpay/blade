/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react';
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
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { InfoIcon } from '~components/Icons';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';
import { Text } from '~components/Typography';
import { Counter } from '~components/Counter';
import { Badge } from '~components/Badge';

describe('<Card />', () => {
  it('should render a plain Card', () => {
    const { container } = renderWithTheme(
      <Card surfaceLevel={3} elevation="highRaised">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a border when elevation is `none`', () => {
    const { container } = renderWithTheme(
      <Card elevation="none">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a Card without 0 padding', () => {
    const { container } = renderWithTheme(
      <Card padding="spacing.0">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a Card with Header', () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const { getByText, container } = renderWithTheme(
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

    expect(getByText(cardTitle)).toBeInTheDocument();
    expect(getByText(cardSubtitle)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render a Card with Footer', () => {
    const footerTitle = 'Card Footer';
    const footerSubtitle = 'Card footer subtitle';
    const primaryFn = jest.fn();
    const secondaryFn = jest.fn();
    const { getByText, getByRole, container } = renderWithTheme(
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

    expect(getByText(footerTitle)).toBeInTheDocument();
    expect(getByText(footerSubtitle)).toBeInTheDocument();

    // Test action buttons
    const primaryButton = getByRole('button', { name: /save/i });
    fireEvent.click(primaryButton);
    expect(primaryFn).toHaveBeenCalledTimes(1);

    const secondaryButton = getByRole('button', { name: /delete/i });
    fireEvent.click(secondaryButton);
    expect(secondaryFn).toHaveBeenCalledTimes(1);

    expect(container).toMatchSnapshot();
  });

  it('should only accept allowed components in Card Header', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    expect(() =>
      renderWithTheme(
        <Card>
          <CardHeader>
            <CardHeaderLeading
              title={cardTitle}
              subtitle={cardSubtitle}
              prefix={<InfoIcon color="action.icon.primary.default" size="xsmall" />}
            />
          </CardHeader>
        </Card>,
      ),
    ).toThrow('[Blade CardHeaderLeading]: Only `CardHeaderIcon` component is accepted in prefix');

    expect(() =>
      renderWithTheme(
        <Card>
          <CardHeader>
            <CardHeaderLeading
              title={cardTitle}
              subtitle={cardSubtitle}
              suffix={<Counter value={12} />}
            />
          </CardHeader>
        </Card>,
      ),
    ).toThrow(
      '[Blade CardHeaderLeading]: Only `CardHeaderCounter` component is accepted in prefix',
    );

    expect(() =>
      renderWithTheme(
        <Card>
          <CardHeader>
            <CardHeaderTrailing visual={<Badge>NEW</Badge>} />
          </CardHeader>
        </Card>,
      ),
    ).toThrow(
      '[Blade CardHeaderTrailing]: Only one of `CardHeaderLink, CardHeaderText, CardHeaderIconButton, CardHeaderBadge` component is accepted in visual',
    );
    mockConsoleError.mockRestore();
  });

  it('should throw error if any sub card components are used outside of Card', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() => renderWithTheme(<CardBody>body</CardBody>)).toThrow(
      '[Blade Card]: CardBody cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardHeader />)).toThrow(
      '[Blade Card]: CardHeader cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardHeaderLeading title="" />)).toThrow(
      '[Blade Card]: CardHeaderLeading cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardHeaderTrailing />)).toThrow(
      '[Blade Card]: CardHeaderTrailing cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardFooter />)).toThrow(
      '[Blade Card]: CardFooter cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardFooterLeading title="" />)).toThrow(
      '[Blade Card]: CardFooterLeading cannot be used outside of Card component',
    );
    expect(() => renderWithTheme(<CardFooterTrailing />)).toThrow(
      '[Blade Card]: CardFooterTrailing cannot be used outside of Card component',
    );
    mockConsoleError.mockRestore();
  });

  it('should restrict childrens & only allow CardHeader, CardBody & CardFooter in Card', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <Card>
          <div>some random div</div>
          <CardHeader />
          <CardBody>Plain Card</CardBody>
          <CardFooter />
        </Card>,
      ),
    ).toThrow(
      '[Blade Card]: Only one of `CardHeader, CardBody, CardFooter` component is accepted as Card children',
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
            <div>some random children</div>
            <CardHeaderTrailing />
          </CardHeader>
          <CardBody>Plain Card</CardBody>
          <CardFooter />
        </Card>,
      ),
    ).toThrow(
      '[Blade Card]: Only one of `CardHeaderLeading, CardHeaderTrailing` component is accepted as CardHeader children',
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
            <div>some random children</div>
          </CardFooter>
        </Card>,
      ),
    ).toThrow(
      '[Blade Card]: Only one of `CardFooterLeading, CardFooterTrailing` component is accepted as CardFooter children',
    );
    mockConsoleError.mockRestore();
  });

  it('should not have accessibility violations', async () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const footerTitle = 'Card Footer';
    const footerSubtitle = 'Card footer subtitle';
    const { container } = renderWithTheme(
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
        <CardBody>Plain Card</CardBody>
        <CardFooter>
          <CardFooterLeading title={footerTitle} subtitle={footerSubtitle} />
          <CardFooterTrailing
            actions={{
              primary: {
                text: 'Save',
                onClick: () => {},
              },
              secondary: {
                text: 'Delete',
                onClick: () => {},
              },
            }}
          />
        </CardFooter>
      </Card>,
    );
    await assertAccessible(container);
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
