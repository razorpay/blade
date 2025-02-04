import { ChatMessage } from '../ChatMessage';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { RayIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Radio, RadioGroup } from '~components/Radio';

describe('<ChatMessage/>', () => {
  it('should render last message correctly', () => {
    const { container } = renderWithTheme(
      <ChatMessage senderType="self" messageType="last">
        {' '}
        This is a demo message{' '}
      </ChatMessage>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithTheme(
      <ChatMessage messageType="default" senderType="self">
        {' '}
        This is another demo message{' '}
      </ChatMessage>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithTheme(
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
    const { container } = renderWithTheme(
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
  it('should render body correctly', () => {
    const { container } = renderWithTheme(
      <ChatMessage
        senderType="other"
        messageType="last"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
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
  it('should render error message correctly', () => {
    const { container } = renderWithTheme(
      <ChatMessage
        senderType="self"
        messageType="last"
        validationState="error"
        errorText="Message not sent. Tap to retry."
      >
        Can you help me with the docs?
      </ChatMessage>,
    );
    expect(container).toMatchSnapshot();
  });
});
