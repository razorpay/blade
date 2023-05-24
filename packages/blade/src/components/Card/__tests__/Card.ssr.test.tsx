/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { InfoIcon } from '~components/Icons';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Card />', () => {
  it('should render a Card with Header & Footer', () => {
    const cardTitle = 'Card Header';
    const cardSubtitle = 'Card subtitle';
    const footerTitle = 'Card Footer';
    const footerSubtitle = 'Card footer subtitle';
    const { getByText, container } = renderWithSSR(
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

    expect(getByText(cardTitle)).toBeInTheDocument();
    expect(getByText(cardSubtitle)).toBeInTheDocument();
    expect(getByText(footerTitle)).toBeInTheDocument();
    expect(getByText(footerSubtitle)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
