// test case for ChatMessage component
import { ChatMessage } from '../ChatMessage.all';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { RayIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Radio, RadioGroup } from '~components/Radio';

describe('<ChatMessage/>', () => {
  it('should render last message correctly', () => {
    const { container } = renderWithSSR(
      <ChatMessage senderType="self" messageType="last">
        {' '}
        This is a demo message{' '}
      </ChatMessage>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithSSR(
      <ChatMessage messageType="default" senderType="self">
        {' '}
        This is another demo message{' '}
      </ChatMessage>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithSSR(
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        {' '}
        This is another demo message{' '}
      </ChatMessage>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithSSR(
      <ChatMessage
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
      </ChatMessage>,
    );
    expect(container).toMatchSnapshot();
  });
});
