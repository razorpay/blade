import { fireEvent } from '@testing-library/react';
import { ChatMessage } from '../ChatMessage.web';
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
  it('it should fire onClick event when user clicks on message button', () => {
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
    fireEvent.click(message);
    expect(onClick).toHaveBeenCalled();
  });
  it('should render loading message correctly when loadingText is passed as prop and children is Card component', () => {
    const { getByText } = renderWithTheme(
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
        isLoading={true}
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
    const loadingTextElement = getByText('Analyzing your response...');
    expect(loadingTextElement).toBeInTheDocument();
  });
  it('should render footer actions correctly when footerActions prop is passed as an array of JSX elements', () => {
    const { getByText } = renderWithTheme(
      <ChatMessage
        senderType="self"
        messageType="last"
        footerActions={
          <Box>
            <Box key={1}>Action 1</Box>,<Box key={2}>Action 2</Box>,<Box key={3}>Action 3</Box>,
          </Box>
        }
      >
        Can you help me with the docs?
      </ChatMessage>,
    );
    const action1 = getByText('Action 1');
    const action2 = getByText('Action 2');
    const action3 = getByText('Action 3');
    expect(action1).toBeInTheDocument();
    expect(action2).toBeInTheDocument();
    expect(action3).toBeInTheDocument();
  });
});
