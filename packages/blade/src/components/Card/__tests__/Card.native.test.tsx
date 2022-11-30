/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react-native';
import { Card } from '../Card';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { InfoIcon } from '~components/Icons';
import { Counter } from '~components/Counter';
import { Text } from '~components/Typography';

describe('<Card />', () => {
  it('should render a plain Card', () => {
    const { toJSON } = renderWithTheme(
      <Card backgroundLevel={2}>
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
      <Card backgroundLevel={2}>
        <Card.Header
          title={cardTitle}
          subtitle={cardSubtitle}
          titlePrefix={<InfoIcon color="surface.text.normal.lowContrast" size="xlarge" />}
          titleSuffix={<Counter value={12} />}
        />
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
      <Card backgroundLevel={2}>
        <Card.Body>
          <Text>Plain Card</Text>
        </Card.Body>
        <Card.Footer
          title={footerTitle}
          subtitle={footerSubtitle}
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
