// test case for ChatBubble component
import { ChatBubble } from '../ChatBubble';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { RayIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Radio, RadioGroup } from '~components/Radio';

describe('<ChatBubble/>', () => {
  it('should render last message correctly', () => {
    const { container } = renderWithSSR(
      <ChatBubble senderType="self" messageType="last">
        {' '}
        This is a demo message{' '}
      </ChatBubble>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithSSR(
      <ChatBubble messageType="default" senderType="self">
        {' '}
        This is another demo message{' '}
      </ChatBubble>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithSSR(
      <ChatBubble
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        {' '}
        This is another demo message{' '}
      </ChatBubble>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithSSR(
      <ChatBubble
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
        loadingText="Analyzing your response..."
      >
        <Card>
          <CardBody>
            <Box display="flex" gap="8px" flexDirection="column">
              <Text variant="body" size="medium">
                Where do you want to collect payments?
              </Text>
              <RadioGroup>
                <Radio value="website">Website</Radio>
                <Radio value="android">Android App</Radio>
                <Radio value="ios">iOS App</Radio>
              </RadioGroup>
            </Box>
          </CardBody>
        </Card>
      </ChatBubble>,
    );
    expect(container).toMatchSnapshot();
  });
});
