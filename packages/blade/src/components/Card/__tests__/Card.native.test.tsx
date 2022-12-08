/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react-native';
import { Card, CardHeaderIcon, CardHeaderCounter } from '../Card';
import { CardHeaderBadge } from '../CardHeader';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { InfoIcon } from '~components/Icons';
import { Text } from '~components/Typography';

describe('<Card />', () => {
  it('should render a plain Card', () => {
    const { toJSON } = renderWithTheme(
      <Card surfaceLevel={2}>
        <Card.Body>
          <Text>Plain Card</Text>
        </Card.Body>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a Card with Header', () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const { getByText, toJSON } = renderWithTheme(
      <Card surfaceLevel={2}>
        <Card.Header>
          <Card.HeaderLeading
            title={cardTitle}
            subtitle={cardSubtitle}
            prefix={<CardHeaderIcon icon={InfoIcon} />}
            suffix={<CardHeaderCounter value={12} />}
          />
          <Card.HeaderTrailing visual={<CardHeaderBadge>NEW</CardHeaderBadge>} />
        </Card.Header>
        <Card.Body>
          <Text>Plain Card</Text>
        </Card.Body>
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
});
