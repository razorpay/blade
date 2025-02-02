// test case for ChatBubble component
import { ChatBubble } from '../ChatBubble.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { RayIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Radio, RadioGroup } from '~components/Radio';

describe('<ChatBubble/>', () => {
  it('should render last message correctly', () => {
    const { container } = renderWithTheme(
      <ChatBubble senderType="self" messageType="last">
        {' '}
        This is a demo message{' '}
      </ChatBubble>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithTheme(
      <ChatBubble senderType="self"> This is another demo message </ChatBubble>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithTheme(
      <ChatBubble
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
      >
        {' '}
        This is another demo message{' '}
      </ChatBubble>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render last message correctly', () => {
    const { container } = renderWithTheme(
      <ChatBubble
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
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
// test('ChatBubble -> should render last user message correctly', () => {
//   const { container } = renderWithTheme(
//     <ChatBubble senderType="self" messageType="last">
//       {' '}
//       This is a demo message{' '}
//     </ChatBubble>,
//   );
//   expect(container).toMatchSnapshot();
// });

// test('ChatBubble -> should render another user message correctly', () => {
//   const { container } = renderWithTheme(
//     <ChatBubble senderType="self"> This is another demo message </ChatBubble>,
//   );
//   expect(container).toMatchSnapshot();
// });

// test('ChatBubble -> should render message with leading icon correctly', () => {
//   const { container } = renderWithTheme(
//     <ChatBubble
//       senderType="other"
//       leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
//     >
//       {' '}
//       This is another demo message{' '}
//     </ChatBubble>,
//   );
//   expect(container).toMatchSnapshot();
// });

// test('ChatBubble -> should render message with card and radio buttons correctly', () => {
//   const { container } = renderWithTheme(
//     <ChatBubble
//       senderType="other"
//       leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
//     >
//       <Card>
//         <CardBody>
//           <Box display="flex" gap="8px" flexDirection="column">
//             <Text variant="body" size="medium">
//               Where do you want to collect payments?
//             </Text>
//             <RadioGroup>
//               <Radio value="website">Website</Radio>
//               <Radio value="android">Android App</Radio>
//               <Radio value="ios">iOS App</Radio>
//             </RadioGroup>
//           </Box>
//         </CardBody>
//       </Card>
//     </ChatBubble>,
//   );
//   expect(container).toMatchSnapshot();
// });
