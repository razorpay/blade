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

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Card />', () => {
  it('should render a plain Card', () => {
    const { container } = renderWithTheme(
      <Card surfaceLevel={2}>
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a Card with Header', () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const { getByText, container } = renderWithTheme(
      <Card surfaceLevel={2}>
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
      <Card surfaceLevel={2}>
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
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    expect(() =>
      renderWithTheme(
        <Card surfaceLevel={2}>
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
        <Card surfaceLevel={2}>
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
        <Card surfaceLevel={2}>
          <CardHeader>
            <CardHeaderTrailing visual={<Badge>NEW</Badge>} />
          </CardHeader>
        </Card>,
      ),
    ).toThrow(
      '[Blade CardHeaderTrailing]: Only one of `CardHeaderLink, CardHeaderText, CardHeaderIconButton, CardHeaderBadge` component is accepted in visual',
    );
  });

  it('should throw error if any sub card components are used outside of Card', () => {
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
  });

  it('should not have accessibility violations', async () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const footerTitle = 'Card Footer';
    const footerSubtitle = 'Card footer subtitle';
    const { container } = renderWithTheme(
      <Card surfaceLevel={2}>
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
});
