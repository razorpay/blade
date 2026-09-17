import { fireEvent } from '@testing-library/react-native';
import { ChatMessage } from '../ChatMessage.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { RayIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ChatMessage /> (native)', () => {
  it('should render self message (last type) correctly', () => {
    const { toJSON } = renderWithTheme(
      <ChatMessage senderType="self" messageType="last">
        This is a demo message
      </ChatMessage>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render self message (default type) correctly', () => {
    const { toJSON } = renderWithTheme(
      <ChatMessage messageType="default" senderType="self">
        This is another demo message
      </ChatMessage>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render other message with leading icon correctly', () => {
    const { toJSON } = renderWithTheme(
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        This is another demo message
      </ChatMessage>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with Card child correctly', () => {
    const { toJSON } = renderWithTheme(
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        <Card>
          <CardBody>
            <Box display="flex" gap="8px" flexDirection="column">
              <Text variant="body" size="medium">
                Where do you want to collect payments?
              </Text>
            </Box>
          </CardBody>
        </Card>
      </ChatMessage>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render error state correctly', () => {
    const { toJSON } = renderWithTheme(
      <ChatMessage
        senderType="self"
        messageType="last"
        validationState="error"
        errorText="Message not sent. Tap to retry."
      >
        Can you help me with the docs?
      </ChatMessage>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should fire onPress when user taps on message', () => {
    const onClick = jest.fn();
    const { getByText } = renderWithTheme(
      <ChatMessage
        senderType="self"
        messageType="last"
        validationState="error"
        errorText="Message not sent. Tap to retry."
        onClick={onClick}
      >
        Can you help me with the docs?
      </ChatMessage>,
    );
    const message = getByText('Can you help me with the docs?');
    fireEvent.press(message);
    expect(onClick).toHaveBeenCalled();
  });

  it('should render loading message correctly when loadingText is passed', () => {
    const { getByText } = renderWithTheme(
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
        isLoading={true}
        loadingText="Analyzing your response..."
      >
        Some content
      </ChatMessage>,
    );
    const loadingTextElement = getByText('Analyzing your response...');
    expect(loadingTextElement).toBeTruthy();
  });

  it('should render footer actions correctly', () => {
    const { getByText } = renderWithTheme(
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
        footerActions={
          <Box>
            <Box key={1}>
              <Text>Action 1</Text>
            </Box>
            <Box key={2}>
              <Text>Action 2</Text>
            </Box>
            <Box key={3}>
              <Text>Action 3</Text>
            </Box>
          </Box>
        }
      >
        Can you help me with the docs?
      </ChatMessage>,
    );
    expect(getByText('Action 1')).toBeTruthy();
    expect(getByText('Action 2')).toBeTruthy();
    expect(getByText('Action 3')).toBeTruthy();
  });
});
