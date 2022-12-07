/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react';
import { Card, CardHeaderIcon, CardHeaderCounter } from '../Card';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { InfoIcon } from '~components/Icons';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';
import { Text } from '~components/Typography';
import { Badge } from '~components/Badge';

describe('<Card />', () => {
  it('should render a plain Card', () => {
    const { container } = renderWithTheme(
      <Card surfaceLevel={2}>
        <Card.Body>Plain Card</Card.Body>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a Card with Header', () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const { getByText, container } = renderWithTheme(
      <Card surfaceLevel={2}>
        <Card.Header>
          <Card.HeaderLeading
            title={cardTitle}
            subtitle={cardSubtitle}
            prefix={<CardHeaderIcon icon={InfoIcon} />}
            suffix={<CardHeaderCounter value={12} />}
          />
          <Card.HeaderTrailing visual={<Badge>NEW</Badge>} />
        </Card.Header>
        <Card.Body>
          <Text>Plain Card</Text>
        </Card.Body>
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
        <Card.Body>
          <Text>Plain Card</Text>
        </Card.Body>
        <Card.Footer>
          <Card.FooterLeading title={footerTitle} subtitle={footerSubtitle} />
          <Card.FooterTrailing
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
        </Card.Footer>
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

  it('should not have accessibility violations', async () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const footerTitle = 'Card Footer';
    const footerSubtitle = 'Card footer subtitle';
    const { container } = renderWithTheme(
      <Card surfaceLevel={2}>
        <Card.Header>
          <Card.HeaderLeading
            title={cardTitle}
            subtitle={cardSubtitle}
            prefix={<CardHeaderIcon icon={InfoIcon} />}
            suffix={<CardHeaderCounter value={12} />}
          />
          <Card.HeaderTrailing visual={<Badge>NEW</Badge>} />
        </Card.Header>
        <Card.Body>Plain Card</Card.Body>
        <Card.Footer>
          <Card.FooterLeading title={footerTitle} subtitle={footerSubtitle} />
          <Card.FooterTrailing
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
        </Card.Footer>
      </Card>,
    );
    await assertAccessible(container);
  });
});
