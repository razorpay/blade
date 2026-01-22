type ComponentStatuses =
  | 'released'
  | 'in-api-spec'
  | 'in-development'
  | 'in-design'
  | 'deprecated'
  | 'to-be-decided'
  | `planned-Q${1 | 2 | 3 | 4}-${'dev' | 'design'}`;

type FrameworkStatus = {
  status: ComponentStatuses;
  releasedIn?: string;
  storybookLink?: string;
};

type ComponentStatusDataType = {
  name: string;
  description: string;
  platform?: 'web' | 'mobile' | 'all';
  frameworks: {
    react?: FrameworkStatus;
    svelte?: FrameworkStatus;
  };
}[];

const componentData: ComponentStatusDataType = [
  {
    name: 'EmptyState',
    description: 'EmptyState component for displaying empty state messages and illustrations.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.41.0',
        storybookLink: 'Components/EmptyState',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'SelectableCard',
    description: 'Card component that can be selected/deselected.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.36.0',
        storybookLink: 'Components/Card/SelectableCard',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'ActionList',
    description:
      'List of multiple actionable items. Can be used as menu items inside `Dropdown`, `BottomSheet` and as selectable items when combined with `SelectInput`',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '6.2.0',
        storybookLink: 'Components/Dropdown/With Select',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Alert',
    description:
      'Alerts are messages that communicate information to users about any significant changes or explanations inside the system in a prominent way.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '1.1.0',
        storybookLink: 'Components/Alert',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Badge',
    description:
      'Badges are used to show small amount of color coded metadata, which are ideal for getting user attention.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '1.0.0',
        storybookLink: 'Components/Badge',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Button',
    description:
      'Button component which can be used for various CTAs. It is available in 3 different variants.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.11.0',
        storybookLink: 'Components/Button',
      },
      svelte: {
        status: 'released',
        releasedIn: '0.1.0',
        storybookLink: 'Components/Button',
      },
    },
  },
  {
    name: 'Card',
    description:
      'Cards are used to group similar concepts and tasks together to make easier for merchants to scan, read, and get things done.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '5.3.0',
        storybookLink: 'Components/Card',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Checkbox',
    description:
      'Checkbox can be used in forms when a user needs to select multiple values from several options.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.13.0',
        storybookLink: 'Components/Checkbox/Checkbox',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'CheckboxGroup',
    description:
      'CheckboxGroup can be used to group together multiple checkboxes in a forms which provides out of the box state management for the multi-checkboxes and other features.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.13.0',
        storybookLink: 'Components/Checkbox/CheckboxGroup',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Counter',
    description:
      'Counters are visual indicators that contains numerical values, tallies or counts in regards to some context. It can be used to show non-interactive numerical data.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '3.6.0',
        storybookLink: 'Components/Counter',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'IconButton',
    description:
      'Useful for making clickable icons. For example - close button for modals, inputs, etc.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '3.6.2',
        storybookLink: 'Components/IconButton',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Indicator',
    description:
      'Indicators describe the condition of an entity. They can be used to convey semantic meaning, such as statuses and semantical-categories.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '3.7.0',
        storybookLink: 'Components/Indicator',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'InfoGroup',
    description:
      'A structured component for displaying key-value pairs in a consistent, organized format. Provides standardized presentation for transaction details, user data, or any related data pairs.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.33.0',
        storybookLink: 'Components/InfoGroup',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Link',
    description:
      'Link component can be used for showing external or internal Links to the user. The Link component can also be used as an inline button in certain cases with the `button` variant.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.13.0',
        storybookLink: 'Components/Link',
      },
      svelte: {
        status: 'released',
        releasedIn: '0.1.0',
        storybookLink: 'Components/Link',
      },
    },
  },
  {
    name: 'List',
    description:
      'Lists display a set of related items that are composed of text/links. Each list item begins with a bullet or a number.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '6.1.0',
        storybookLink: 'Components/List',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'ProgressBar',
    description:
      'Progress bar is generally a branded element that indicates progress of process or task',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '5.4.0',
        storybookLink: 'Components/ProgressBar',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Spinner',
    description:
      'Spinner component is an element with a looping animation that indicates loading is in process.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '2.2.0',
        storybookLink: 'Components/Spinner',
      },
      svelte: {
        status: 'released',
        releasedIn: '0.1.0',
        storybookLink: 'Components/Spinner',
      },
    },
  },
  {
    name: 'TextInput',
    description:
      'TextInput component is a component that can be used to input name, email, telephone, url, search or plain text.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '2.1.0',
        storybookLink: 'Components/Input/TextInput',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'TextArea',
    description:
      'TextArea component lets you enter long form text which spans over multiple lines.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '2.3.0',
        storybookLink: 'Components/Input/TextArea',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'OTPInput',
    description:
      'A one-time password (OTP), also known as a one-time PIN, one-time authorization code (OTAC) or dynamic password, is a password that is valid for only one login session or a transaction. These are a group of inputs and can be either 4 or 6 characters long.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '3.1.0',
        storybookLink: 'Components/Input/OTPInput',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'PasswordInput',
    description:
      'PasswordInput is an input field for entering passwords. The input is masked by default. On mobile devices the last typed letter is shown for a brief moment. The masking can be toggled using an optional reveal button.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '2.5.0',
        storybookLink: 'Components/Input/PasswordInput',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Radio',
    description:
      'Radio & RadioGroup can be used in forms when a user needs to single value from several options.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '1.0.0',
        storybookLink: 'Components/Radio & RadioGroup',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'RadioGroup',
    description:
      'RadioGroup can be used to group together multiple radios in a forms which provides out of the box state management for the multi-radio and other features.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '1.0.0',
        storybookLink: 'Components/Radio & RadioGroup',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Text',
    description:
      'Text component is used to display main content of the page. It is often clubbed with Title or Heading to display content in a hierarchical structure. It applies responsive styles automatically based on the device it is being rendered on.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.4.0',
        storybookLink: 'Components/Typography/Text',
      },
      svelte: {
        status: 'released',
        releasedIn: '0.1.0',
        storybookLink: 'Components/Typography/Text',
      },
    },
  },
  {
    name: 'Heading',
    description: 'Heading Component is usually used for headings of each major section of a page.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.6.0',
        storybookLink: 'Components/Typography/Heading',
      },
      svelte: {
        status: 'released',
        releasedIn: '0.1.0',
        storybookLink: 'Components/Typography/Heading',
      },
    },
  },
  {
    name: 'Title',
    description:
      'Title Component makes a bold visual statement. Use them to create impact when the main goal is visual storytelling. For example, use Title as marketing content on landing pages or to capture attention during onboarding.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.5.0',
        storybookLink: 'Components/Typography/Title',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Code',
    description:
      'Code component can be used for displaying token, variable names, or inlined code snippets.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '3.0.0',
        storybookLink: 'Components/Typography/Code',
      },
      svelte: {
        status: 'released',
        releasedIn: '0.1.0',
        storybookLink: 'Components/Typography/Code',
      },
    },
  },
  {
    name: 'SkipNav',
    description:
      'SkipNav component lets users skip the navigation and jump to the main content of the page. Useful when you have navbars at the top and the user wants to jump directly to the main content.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.9.0',
        storybookLink: 'Components/Accessibility/SkipNav',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'VisuallyHidden',
    description:
      'VisuallyHidden component makes content hidden from sighted users but available for screen reader users.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '0.9.0',
        storybookLink: 'Components/Accessibility/VisuallyHidden',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Dropdown',
    description:
      'Dropdown Menu displays a list of choices on temporary surfaces. They allow users to make a selection from multiple options. They appear when users interact with a button, action, or other control.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '6.2.0',
        storybookLink: 'Components/Dropdown/With Select',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'SelectInput',
    description:
      'Select displays a list of choices on temporary surfaces. They allows users pick a value from predefined options',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '6.2.0',
        storybookLink: 'Components/Dropdown/With Select',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Layout Primitives',
    description:
      'Layout Primitives are used to build complex responsive layouts. Includes Box component and Styled Props on existing blade components',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '6.5.0',
        storybookLink: 'Components/Layout Primitives (Box)/Layout Primitives Tutorial',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'BottomSheet',
    description:
      'Bottom sheets are surfaces containing supplementary content that are anchored to the bottom of the screen.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '7.2.0',
        storybookLink: 'Components/BottomSheet',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Tags',
    description: 'A tag labels UI objects for quick recognition and navigation.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '9.3.0',
        storybookLink: 'Components/Tag',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Amount',
    description: 'Amount component is used to display & format various currencies',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '6.7.0',
        storybookLink: 'Components/Amount',
      },
      svelte: {
        status: 'released',
        releasedIn: '0.1.0',
        storybookLink: 'Components/Amount',
      },
    },
  },
  {
    name: 'Switch',
    description:
      'Switch component is used as an alternative for the checkbox component, It can be used to switch between two states: often on or off.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '8.5.0',
        storybookLink: 'Components/Switch',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Tooltip',
    description:
      'Tooltip is a brief, informative message that appears when a user interacts with an element.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '8.9.0',
        storybookLink: 'Components/Tooltip',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Accordion',
    description:
      'Accordion component allows the user to show and hide sections of related content on a page',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '8.12.0',
        storybookLink: 'Components/Accordion',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Collapsible',
    description:
      'Collapsibles are used to allow users to toggle the visibility of hidden content within a container.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '8.12.0',
        storybookLink: 'Components/Collapsible',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Modal',
    description:
      "Modal is a dialog that focuses the user's attention exclusively on an information via a window that is overlaid on primary content.",
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '8.8.0',
        storybookLink: 'Components/Modal/SimpleModal',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Divider',
    description: 'Dividers are used to visually separate content in a list or group.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '8.14.0',
        storybookLink: 'Components/Divider',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Chip',
    description:
      'Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. Chips can have either single selection or multiple (based on context).',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '10.4.0',
        storybookLink: 'Components/Chip/Chip',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'FileUpload',
    description: 'FileUpload component allow users to select one or more files to upload.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.6.0',
        storybookLink: 'Components/FileUpload',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Drawer',
    description: 'The Drawer component is a panel that slides out from the edge of the screen.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.4.0',
        storybookLink: 'Components/Drawer',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Slot',
    description:
      'The Slot component is a generic component which can be used as container. (This is a design only component)',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '5.3.0',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'SkeletonLoader',
    description:
      'Skeleton Loader is a static / animated placeholder for the information that is still loading. It mimic the structure and look of the entire view.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '9.1.0',
        storybookLink: 'Components/Skeleton',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Carousel',
    description:
      'Carousel is a component to one-by-one display multiple blocks of information in circular manner',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '10.2.0',
        storybookLink: 'Components/Carousel',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Tabs',
    description:
      'Tabs is a component which will allow you to show multiple clickable tabs in your UI',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '10.16.0',
        storybookLink: 'Components/Tabs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Table',
    description: 'Table will allow you to display your data in tabular manner',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '10.19.0',
        storybookLink: 'Components/Table',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Charts',
    description: 'Charts will allow you to display your data in graphical manner',
    frameworks: {
      react: {
        status: 'in-design',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Menu',
    description:
      'Menu displays a list of actions on temporary surfaces. They allow users to action(s) from multiple options. They appear when users interact with a button, action, or other control.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.22.0',
        storybookLink: 'Components/Menu',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'TopNav',
    description:
      'TopNav is a horizontal navigation component that can be used to navigate between pages.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.23.0',
        storybookLink: 'Components/TopNav',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'SideNav',
    description:
      'SideNav is a vertical navigation component that can be used to navigate between pages.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.21.0',
        storybookLink: 'Components/SideNav',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'DatePicker',
    description: 'DatePicker will provide an easy way to input dates and ranges',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.21.5',
        storybookLink: 'Components/DatePicker',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'AutoComplete',
    description:
      'AutoComplete Component will allow you to filter Dropdown options as you type ahead in the Input',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '10.9.0',
        storybookLink: 'Components/Dropdown/With AutoComplete',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Toast',
    description: 'Toast is a component to show a simple floating messages to your users',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.3.0',
        storybookLink: 'Components/Toast/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'SearchInput',
    description:
      'A search input is an input field that allow users to input search queries with a keyboard.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.17.0',
        storybookLink: 'Components/Input/SearchInput',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'StepGroup',
    description: 'A stepper component is used to indicate progress through a multi-step process.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.15.0',
        storybookLink: 'Components/StepGroup',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'ButtonGroup',
    description: 'ButtonGroup component can be used to group related buttons.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.8.0',
        storybookLink: 'Components/ButtonGroup',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'PhoneNumberInput',
    description:
      'A phone number input is an input field that allow users to input phone numbers with a keyboard. It supports entering phone numbers from different geographic locations.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.10.0',
        storybookLink: 'Components/Input/PhoneNumberInput',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Breadcrumbs',
    description:
      'Breadcrumbs is a navigation pattern that helps users understand the hierarchy of a website.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '11.5.0',
        storybookLink: 'Components/Breadcrumbs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Popover',
    description:
      'The popover typically provides additional context about the element or its function. A popover is always triggered by a mouse hover on desktop and on tap on mobile.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '10.10.0',
        storybookLink: 'Components/Popover',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'SpotlightPopoverTour',
    description:
      'The SpotlightPopoverTour component is used to provide context as well as enable users to take certain actions on it. These are used to highlight a new feature or provide a guided tour to a new user.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '10.18.0',
        storybookLink: 'Components/SpotlightPopoverTour/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Fade',
    description:
      'The Fade component is a motion preset that animates the opacity of its children, allowing them to smoothly appear or disappear. It ensures seamless transitions while keeping the UI visually engaging.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.0.0',
        storybookLink: 'Motion/Fade/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Move',
    description:
      'The Move component is a motion preset that animates the opacity and position of its children, allowing them to smoothly appear or disappear. It ensures seamless transitions while keeping the UI visually engaging.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.0.0',
        storybookLink: 'Motion/Move/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Slide',
    description:
      'The Slide component is a motion preset that animates the children by sliding them in from outside of viewport, allowing them to smoothly appear or disappear. Unlike Move, Slide is meant to animate components from outside of viewport',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.0.0',
        storybookLink: 'Motion/Slide/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Morph',
    description:
      "Morph component is a abstraction on motion react's layout animations. It allows you to morph between 2 elements",
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.0.0',
        storybookLink: 'Motion/Morph/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Scale',
    description:
      'Scale component animates over CSS `scale` property and allows you to enlarge or shrink element on certain interactions',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.0.0',
        storybookLink: 'Motion/Scale/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'AnimateInteractions',
    description:
      'AnimateInteractions is a component that allows you to animate child components based on interactions on parent. This is similar to doing `.parent:hover .child {}` styling in CSS.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.0.0',
        storybookLink: 'Motion/AnimateInteractions/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Stagger',
    description:
      'Stagger component allows you to stagger children (make them appear one after the other). Its a utility preset. You can use any of the base presets like Move, Fade, Slide inside of it',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.0.0',
        storybookLink: 'Motion/Stagger/Docs',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'InputGroup',
    description: 'InputGroup component allows grouping of related input fields together.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.32.0',
        storybookLink: 'Components/Input/InputGroup',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Preview',
    description: 'Preview component for displaying content in a preview mode.',
    platform: 'all',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.30.0',
        storybookLink: 'Components/Preview',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'FilterChipSelectInput',
    description:
      'FilterChipSelectInput component for selecting multiple values using filter chips.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.20.0',
        storybookLink: 'Components/Input/FilterChipSelectInput',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'FilterChipDatePicker',
    description: 'FilterChipDatePicker component for selecting dates using filter chips.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.20.0',
        storybookLink: 'Components/Input/FilterChipDatePicker',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'ListView',
    description:
      'ListView pattern for displaying data in a list format with built-in filtering and search capabilities.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.20.0',
        storybookLink: 'Patterns/ListView',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'QuickFilter',
    description: 'QuickFilter component for quickly filtering content.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.14.0',
        storybookLink: 'Components/QuickFilter',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'ChatMessage',
    description: 'ChatMessage component for displaying chat messages in a conversation interface.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.11.0',
        storybookLink: 'Components/ChatMessage',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'LineChart',
    description:
      'A Line Chart component built on top of Recharts with Blade design system styling.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.49.7',
        storybookLink: 'Components/LineChart',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'TimePicker',
    description:
      'TimePicker component allows users to select a specific time from a customizable time interface. It supports both 12-hour and 24-hour formats, provides an intuitive picker interface, and automatically adapts to mobile devices with a BottomSheet experience.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.54.0',
        storybookLink: 'Components/TimePicker',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'CounterInput',
    description:
      'CounterInput component allows users to increment or decrement small numerical values (typically 0-99) using built-in controls with manual text input support. Optimized for quantity selection, settings with boundaries, and scenarios requiring clear min/max constraints. For larger values (99+), use TextInput with type="number" instead.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.59.0',
        storybookLink: 'Components/CounterInput',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
  {
    name: 'Pagination',
    description: 'Pagination component allows users to navigate through multiple pages of content.',
    platform: 'web',
    frameworks: {
      react: {
        status: 'released',
        releasedIn: '12.65.1',
        storybookLink: 'Components/Pagination',
      },
      svelte: {
        status: 'to-be-decided',
      },
    },
  },
];

export type { ComponentStatuses, ComponentStatusDataType, FrameworkStatus };
export { componentData };
