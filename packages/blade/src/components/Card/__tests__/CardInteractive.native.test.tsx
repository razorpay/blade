/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { CardBody, Card } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';

describe('<Card />', () => {
  it('should render a interactive Card', () => {
    const { toJSON } = renderWithTheme(
      <Card onClick={() => {}} shouldScaleOnHover isSelected={true}>
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a clickable Card', () => {
    const { toJSON } = renderWithTheme(
      <Card onClick={() => {}}>
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a linkable Card', () => {
    const { toJSON } = renderWithTheme(
      <Card href="https://google.com">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a linkable Card with onClick', () => {
    const { toJSON } = renderWithTheme(
      <Card onClick={() => {}} href="https://google.com">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should click on the card', () => {
    const onClick = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <Card onClick={onClick} accessibilityLabel="My Card">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );

    fireEvent(getByLabelText(/My Card/i), 'pressIn');
    fireEvent(getByLabelText(/My Card/i), 'pressOut');
    expect(onClick).toHaveBeenCalled();
  });

  it('should behave properly when buttons are present', () => {
    const rootOnClick = jest.fn();
    const childOnClick = jest.fn();
    const { getByRole, getByLabelText } = renderWithTheme(
      <Card onClick={rootOnClick} accessibilityLabel="My Card">
        <CardBody>
          <Button onClick={childOnClick}>Child Button</Button>
        </CardBody>
      </Card>,
    );

    expect(getByRole('button', { name: 'Child Button' })).toBeTruthy();
    expect(getByLabelText(/My Card/i)).toBeTruthy();

    fireEvent(getByLabelText(/My Card/i), 'pressIn');
    fireEvent(getByLabelText(/My Card/i), 'pressOut');
    expect(rootOnClick).toHaveBeenCalled();

    fireEvent.press(getByRole('button', { name: 'Child Button' }));
    expect(childOnClick).toHaveBeenCalled();
  });

  it('should have href on card', async () => {
    const { getByRole } = renderWithTheme(
      <Card href="https://google.com" accessibilityLabel="My Card">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    const link = getByRole('link', { name: /My Card/i });
    fireEvent(link, 'pressIn');
    fireEvent(link, 'pressOut');
    await waitFor(() => expect(Linking.canOpenURL).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(Linking.openURL).toHaveBeenCalledTimes(1));
  });

  it('should work with selected state', () => {
    const Example = (): React.ReactElement => {
      const [selected, setSelected] = React.useState(false);
      return (
        <Card
          onClick={() => setSelected(!selected)}
          isSelected={selected}
          accessibilityLabel="My Card"
        >
          <CardBody>Plain Card</CardBody>
        </Card>
      );
    };
    const { getByLabelText } = renderWithTheme(<Example />);

    const card = getByLabelText(/My Card/i);
    expect(card).toHaveAccessibilityState({ selected: false });
    fireEvent(card, 'pressIn');
    fireEvent(card, 'pressOut');
    expect(card).toHaveAccessibilityState({ selected: true });
  });

  it('should work like a checkbox with hidden input', () => {
    const Example = (): React.ReactElement => {
      const [selected, setSelected] = React.useState(['free']);

      const handleChange = (value: string) => {
        if (selected.includes(value)) {
          setSelected(selected.filter((item) => item !== value));
        } else {
          setSelected([...selected, value]);
        }
      };

      return (
        <Box>
          <Card onClick={() => handleChange('free')} isSelected={selected.includes('free')}>
            <CardBody>
              <Text>Free</Text>
            </CardBody>
          </Card>
          <Card onClick={() => handleChange('standard')} isSelected={selected.includes('standard')}>
            <CardBody>
              <Text>Standard</Text>
            </CardBody>
          </Card>
          <Card onClick={() => handleChange('premium')} isSelected={selected.includes('premium')}>
            <CardBody>
              <Text>Premium</Text>
            </CardBody>
          </Card>

          <Text testID="selected-value">Selected: {selected.join(',')}</Text>
        </Box>
      );
    };

    const { getByText, getByTestId } = renderWithTheme(<Example />);

    const standardCard = getByText('Standard');
    const premiumCard = getByText('Premium');
    const selectedValue = getByTestId('selected-value');

    expect(selectedValue).toHaveTextContent('free');

    fireEvent(standardCard, 'pressIn');
    fireEvent(standardCard, 'pressOut');

    expect(selectedValue).toHaveTextContent('free,standard');

    fireEvent(premiumCard, 'pressIn');
    fireEvent(premiumCard, 'pressOut');

    expect(selectedValue).toHaveTextContent('free,standard,premium');

    fireEvent(standardCard, 'pressIn');
    fireEvent(standardCard, 'pressOut');

    expect(selectedValue).toHaveTextContent('free,premium');
  });
});
