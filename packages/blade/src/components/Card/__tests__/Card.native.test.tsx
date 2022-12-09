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
} from '../Card';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { InfoIcon } from '~components/Icons';
import { Text } from '~components/Typography';

describe('<Card />', () => {
  it('should render a plain Card', () => {
    const { toJSON } = renderWithTheme(
      <Card surfaceLevel={2}>
        <CardBody>
          <Text>Plain Card</Text>
        </CardBody>
      </Card>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a Card with Header', () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const { getByText, toJSON } = renderWithTheme(
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
});
