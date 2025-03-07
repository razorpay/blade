const Playground = `
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  RadioGroup,
  Radio,
  Box,
  Badge,
  Counter
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader
          title="Address Details"
        />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">
              Home - 11850 Florida 24, Cedar Key, Florida
            </Radio>
            <Radio value="office-1">
              Office - 2033 Florida 21, Cedar Key, Florida
            </Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
`;
const BasicModalStory = `
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
        <ModalHeader title="Basic Modal" />
        <ModalBody>
          <Text>
            This is a basic Modal. Close the Modal by clicking on the backdrop,
            clicking on the close icon or pressing escape key.
          </Text>
        </ModalBody>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalWithHeaderFooterStory = `
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  RadioGroup,
  Radio,
  Box,
  Badge,
  Counter
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Modal with Header & Footer
      </Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader
          title="Address Details"
          subtitle="Saving addresses will improve your checkout experience"
          trailing={<Badge variant="notice">Action Needed</Badge>}
          titleSuffix={<Counter variant="positive" value={2} />}
        />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">
              Home - 11850 Florida 24, Cedar Key, Florida
            </Radio>
            <Radio value="office-1">
              Office - 2033 Florida 21, Cedar Key, Florida
            </Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalWithScrollableBackgroundStory = `
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        marginBottom="spacing.4"
      >
        Open Modal
      </Button>
      <Text marginBottom="500px">
        This is an example for a modal with a scrollable background. The
        background contains content that is longer than the screen height. When
        the modal is opened, the background locked from scrolling but when the
        modal is closed, the background content can be scrolled again.
      </Text>
      <Text marginBottom="500px">
        This is an example for a modal with a scrollable background. The
        background contains content that is longer than the screen height. When
        the modal is opened, the background locked from scrolling but when the
        modal is closed, the background content can be scrolled again.
      </Text>
      <Text marginBottom="500px">
        This is an example for a modal with a scrollable background. The
        background contains content that is longer than the screen height. When
        the modal is opened, the background locked from scrolling but when the
        modal is closed, the background content can be scrolled again.
      </Text>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="small">
        <ModalHeader title="Scroll Lock Demo" />
        <ModalBody>
          <Text>
            The background content is no longer scrollable. You can scroll the
            background content again once you close this Modal.
          </Text>
        </ModalBody>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalWithScrollableContentStory = `
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Text,
  TextArea,
  TextInput
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        marginBottom="spacing.4"
      >
        Open Scrollable Modal
      </Button>
      <Text>
        This is an example for a scrollable modal. The modal contains content
        that is longer than the Modal maximum height. When the modal is opened,
        the modal content is scrollable.
      </Text>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader title="Contact Details" subtitle="How can we reach you?" />
        <ModalBody>
          <Box>
            <TextInput
              label="First Name"
              placeholder="John"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Email"
              placeholder="john.doe@gmail.com"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Phone Number"
              placeholder="+1 234 567 890"
              marginBottom="spacing.3"
            />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
          <Box>
            <TextInput
              label="First Name"
              placeholder="John"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Email"
              placeholder="john.doe@gmail.com"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Phone Number"
              placeholder="+1 234 567 890"
              marginBottom="spacing.3"
            />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalStackingStory = `
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Text,
  TextArea,
  TextInput
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [is1stOpen, set1stIsOpen] = React.useState(false);
  const [is2ndOpen, setIs2ndOpen] = React.useState(false);
  const [is3rdOpen, setIs3rdOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => set1stIsOpen(true)}>
        Open First Modal
      </Button>
      {/* Modal 1 */}
      <Modal
        isOpen={is1stOpen}
        onDismiss={() => set1stIsOpen(false)}
        size="large"
      >
        <ModalHeader title="First Modal" />
        <ModalBody>
          <Box>
            <TextInput
              label="First Name"
              placeholder="John"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Email"
              placeholder="john.doe@gmail.com"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Phone Number"
              placeholder="+1 234 567 890"
              marginBottom="spacing.3"
            />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
          <Box>
            <TextInput
              label="First Name"
              placeholder="John"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Email"
              placeholder="john.doe@gmail.com"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Phone Number"
              placeholder="+1 234 567 890"
              marginBottom="spacing.3"
            />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary" onClick={() => set1stIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIs2ndOpen(true)}>
              Open Second Modal
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
      {/* Modal 2 */}
      <Modal
        isOpen={is2ndOpen}
        onDismiss={() => setIs2ndOpen(false)}
        size="medium"
      >
        <ModalHeader title="Second Modal" />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">
              Home - 11850 Florida 24, Cedar Key, Florida
            </Radio>
            <Radio value="office-1">
              Office - 2033 Florida 21, Cedar Key, Florida
            </Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary" onClick={() => setIs2ndOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIs3rdOpen(true)}>Open Third Modal</Button>
          </Box>
        </ModalFooter>
      </Modal>
      {/* Modal 3 */}
      <Modal
        isOpen={is3rdOpen}
        onDismiss={() => setIs3rdOpen(false)}
        size="small"
      >
        <ModalHeader title="Third Modal" />
        <ModalBody>
          <Text>This is the 3rd modal</Text>
        </ModalBody>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalWithNoBodyPaddingStory = `
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader title="First Modal" />
        <ModalBody padding="spacing.0">
          <Box display="flex" flexDirection="column">
            <img
              width="100%"
              height="300px"
              src="https://d6xcmfyh68wv8.cloudfront.net/assets/case-studies/common-card/pg_breathingroom.png"
              alt="Breathing Room"
            />
            <Box padding="spacing.7" display="flex" flexDirection="column">
              <Text marginTop="spacing.5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </Text>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
`;

export {
  Playground,
  BasicModalStory,
  ModalWithHeaderFooterStory,
  ModalWithScrollableBackgroundStory,
  ModalWithScrollableContentStory,
  ModalStackingStory,
  ModalWithNoBodyPaddingStory,
};
