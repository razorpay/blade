/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CardBody, Card } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box';
import { VisuallyHidden } from '~components/VisuallyHidden/VisuallyHidden';
import { Text } from '~components/Typography';

const HiddenInput = ({
  onChange,
  value,
  checked,
  name,
  type,
}: {
  onChange: (value: string) => void;
  value: string;
  checked: boolean;
  name: string;
  type?: string;
}): React.ReactElement => {
  return (
    <VisuallyHidden>
      <input
        type={type ?? 'radio'}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        checked={checked}
        name={name}
        value={value}
      />
    </VisuallyHidden>
  );
};

describe('<Card />', () => {
  it('should render an interactive Card', () => {
    const { container } = renderWithTheme(
      <Card onClick={() => {}} shouldScaleOnHover isSelected={true}>
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a clickable Card', () => {
    const { container } = renderWithTheme(
      <Card onClick={() => {}}>
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a linkable Card', () => {
    const { container } = renderWithTheme(
      <Card href="https://google.com">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a linkable Card with onClick', () => {
    const { container } = renderWithTheme(
      <Card onClick={() => {}} href="https://google.com">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should click on the card', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <Card onClick={onClick} accessibilityLabel="My Card">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    await user.click(getByRole('button', { name: /My Card/i }));
    expect(onClick).toHaveBeenCalled();
  });

  it('should behave properly when buttons are present', async () => {
    const user = userEvent.setup();
    const rootOnClick = jest.fn();
    const childOnClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <Card onClick={rootOnClick} accessibilityLabel="My Card">
        <CardBody>
          <button onClick={childOnClick}>Child Button</button>
        </CardBody>
      </Card>,
    );

    await user.tab();
    expect(getByRole('button', { name: /My Card/i })).toHaveFocus();
    await user.click(getByRole('button', { name: /My Card/i }));
    expect(rootOnClick).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(getByRole('button', { name: /Child Button/i })).toHaveFocus();
    await user.click(getByRole('button', { name: /Child Button/i }));
    expect(childOnClick).toHaveBeenCalledTimes(1);
    expect(rootOnClick).toHaveBeenCalledTimes(1);
  });

  it('should have href on card', () => {
    const { getByRole } = renderWithTheme(
      <Card href="https://google.com" accessibilityLabel="My Card" target="_blank">
        <CardBody>Plain Card</CardBody>
      </Card>,
    );
    expect(getByRole('link', { name: /My Card/i })).toHaveAttribute('href', 'https://google.com');
    // check for rel
    expect(getByRole('link', { name: /My Card/i })).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('should work with selected state', async () => {
    const user = userEvent.setup();
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
    const { getByRole } = renderWithTheme(<Example />);

    const card = getByRole('button', { name: /My Card/i });
    expect(card).toHaveAttribute('aria-pressed', 'false');
    await user.click(card);
    expect(card).toHaveAttribute('aria-pressed', 'true');
  });

  it('should work like a checkbox with hidden input', async () => {
    const user = userEvent.setup();
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
          <Card as="label" shouldScaleOnHover isSelected={selected.includes('free')}>
            <CardBody>
              <HiddenInput
                type="checkbox"
                checked={selected.includes('free')}
                onChange={(value) => handleChange(value)}
                value="free"
                name="pricing-card"
              />
              <Text>Free</Text>
            </CardBody>
          </Card>
          <Card as="label" shouldScaleOnHover isSelected={selected.includes('standard')}>
            <CardBody>
              <HiddenInput
                type="checkbox"
                checked={selected.includes('standard')}
                onChange={(value) => handleChange(value)}
                value="standard"
                name="pricing-card"
              />
              <Text>Standard</Text>
            </CardBody>
          </Card>
          <Card as="label" shouldScaleOnHover isSelected={selected.includes('premium')}>
            <CardBody>
              <HiddenInput
                type="checkbox"
                checked={selected.includes('premium')}
                onChange={(value) => handleChange(value)}
                value="premium"
                name="pricing-card"
              />
              <Text>Premium</Text>
            </CardBody>
          </Card>
        </Box>
      );
    };

    const { getByLabelText } = renderWithTheme(<Example />);

    const freeCard = getByLabelText(/Free/i);
    const standardCard = getByLabelText(/Standard/i);
    const premiumCard = getByLabelText(/Premium/i);

    expect(freeCard).toBeChecked();
    expect(standardCard).not.toBeChecked();
    expect(premiumCard).not.toBeChecked();

    await user.click(standardCard);

    expect(freeCard).toBeChecked();
    expect(standardCard).toBeChecked();
    expect(premiumCard).not.toBeChecked();

    await user.click(premiumCard);

    expect(freeCard).toBeChecked();
    expect(standardCard).toBeChecked();
    expect(premiumCard).toBeChecked();

    await user.click(standardCard);

    expect(freeCard).toBeChecked();
    expect(standardCard).not.toBeChecked();
    expect(premiumCard).toBeChecked();
  });

  it('should work like a radio with hidden input', async () => {
    const user = userEvent.setup();
    const Example = (): React.ReactElement => {
      const [selected, setSelected] = React.useState('free');

      const handleChange = (value: string) => {
        setSelected(value);
      };

      return (
        <Box>
          <Card as="label" shouldScaleOnHover isSelected={selected.includes('free')}>
            <CardBody>
              <HiddenInput
                type="checkbox"
                checked={selected.includes('free')}
                onChange={(value) => handleChange(value)}
                value="free"
                name="pricing-card"
              />
              <Text>Free</Text>
            </CardBody>
          </Card>
          <Card as="label" shouldScaleOnHover isSelected={selected.includes('standard')}>
            <CardBody>
              <HiddenInput
                type="checkbox"
                checked={selected.includes('standard')}
                onChange={(value) => handleChange(value)}
                value="standard"
                name="pricing-card"
              />
              <Text>Standard</Text>
            </CardBody>
          </Card>
          <Card as="label" shouldScaleOnHover isSelected={selected.includes('premium')}>
            <CardBody>
              <HiddenInput
                type="checkbox"
                checked={selected.includes('premium')}
                onChange={(value) => handleChange(value)}
                value="premium"
                name="pricing-card"
              />
              <Text>Premium</Text>
            </CardBody>
          </Card>
        </Box>
      );
    };

    const { getByLabelText } = renderWithTheme(<Example />);

    const freeCard = getByLabelText(/Free/i);
    const standardCard = getByLabelText(/Standard/i);
    const premiumCard = getByLabelText(/Premium/i);

    expect(freeCard).toBeChecked();
    expect(standardCard).not.toBeChecked();
    expect(premiumCard).not.toBeChecked();

    await user.click(standardCard);

    expect(freeCard).not.toBeChecked();
    expect(standardCard).toBeChecked();
    expect(premiumCard).not.toBeChecked();

    await user.click(premiumCard);

    expect(freeCard).not.toBeChecked();
    expect(standardCard).not.toBeChecked();
    expect(premiumCard).toBeChecked();

    await user.click(standardCard);

    expect(freeCard).not.toBeChecked();
    expect(standardCard).toBeChecked();
    expect(premiumCard).not.toBeChecked();
  });
});
