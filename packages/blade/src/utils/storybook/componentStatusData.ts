type ComponentStatuses =
  | 'released'
  | 'in-api-spec'
  | 'in-development'
  | 'in-design'
  | 'deprecated'
  | 'to-be-decided'
  | `planned-Q${1 | 2 | 3 | 4}-${'dev' | 'design'}`;

type ComponentStatusDataType = {
  name: string;
  status: ComponentStatuses;
  description: string;
  releasedIn?: string;
  storybookLink?: string;
  platform?: 'web' | 'mobile' | 'all';
}[];

const componentData: ComponentStatusDataType = [
  {
    name: 'ActionList',
    status: 'released',
    releasedIn: '6.2.0',
    storybookLink: 'Components/Dropdown/With Select',
    description:
      'List of multiple actionable items. Can be used as menu items inside `Dropdown`, `BottomSheet` and as selectable items when combined with `SelectInput`',
    platform: 'all',
  },
  {
    name: 'Alert',
    status: 'released',
    releasedIn: '1.1.0',
    storybookLink: 'Components/Alert',
    description:
      'Alerts are messages that communicate information to users about any significant changes or explanations inside the system in a prominent way.',
    platform: 'all',
  },
  {
    name: 'Badge',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Badge',
    description:
      'Badges are used to show small amount of color coded metadata, which are ideal for getting user attention.',
    platform: 'all',
  },
  {
    name: 'Button',
    status: 'released',
    releasedIn: '0.11.0',
    storybookLink: 'Components/Button',
    description:
      'Button component which can be used for various CTAs. It is available in 3 different variants.',
    platform: 'all',
  },
  {
    name: 'Card',
    status: 'released',
    releasedIn: '5.3.0',
    storybookLink: 'Components/Card',
    description:
      'Cards are used to group similar concepts and tasks together to make easier for merchants to scan, read, and get things done.',
    platform: 'all',
  },
  {
    name: 'Checkbox',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Checkbox/Checkbox',
    description:
      'Checkbox can be used in forms when a user needs to select multiple values from several options.',
    platform: 'all',
  },
  {
    name: 'CheckboxGroup',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Checkbox/CheckboxGroup',
    description:
      'CheckboxGroup can be used to group together multiple checkboxes in a forms which provides out of the box state management for the multi-checkboxes and other features.',
    platform: 'all',
  },
  {
    name: 'Counter',
    status: 'released',
    releasedIn: '3.6.0',
    storybookLink: 'Components/Counter',
    description:
      'Counters are visual indicators that contains numerical values, tallies or counts in regards to some context. It can be used to show non-interactive numerical data.',
    platform: 'all',
  },
  {
    name: 'IconButton',
    status: 'released',
    releasedIn: '3.6.2',
    storybookLink: 'Components/IconButton',
    description:
      'Useful for making clickable icons. For example - close button for modals, inputs, etc.',
    platform: 'all',
  },
  {
    name: 'Indicator',
    status: 'released',
    releasedIn: '3.7.0',
    storybookLink: 'Components/Indicator',
    description:
      'Indicators describe the condition of an entity. They can be used to convey semantic meaning, such as statuses and semantical-categories.',
    platform: 'all',
  },
  {
    name: 'Link',
    status: 'released',
    releasedIn: '0.13.0',
    storybookLink: 'Components/Link',
    description:
      'Link component can be used for showing external or internal Links to the user. The Link component can also be used as an inline button in certain cases with the `button` variant.',
    platform: 'all',
  },
  {
    name: 'List',
    status: 'released',
    releasedIn: '6.1.0',
    storybookLink: 'Components/List',
    description:
      'Lists display a set of related items that are composed of text/links. Each list item begins with a bullet or a number.',
    platform: 'all',
  },
  {
    name: 'ProgressBar',
    status: 'released',
    releasedIn: '5.4.0',
    storybookLink: 'Components/ProgressBar',
    description:
      'Progress bar is generally a branded element that indicates progress of process or task',
    platform: 'all',
  },
  {
    name: 'Spinner',
    status: 'released',
    releasedIn: '2.2.0',
    storybookLink: 'Components/Spinner',
    description:
      'Spinner component is an element with a looping animation that indicates loading is in process.',
    platform: 'all',
  },
  {
    name: 'TextInput',
    status: 'released',
    releasedIn: '2.1.0',
    storybookLink: 'Components/Input/TextInput',
    description:
      'TextInput component is a component that can be used to input name, email, telephone, url, search or plain text.',
    platform: 'all',
  },
  {
    name: 'TextArea',
    status: 'released',
    releasedIn: '2.3.0',
    storybookLink: 'Components/Input/TextArea',
    description:
      'TextArea component lets you enter long form text which spans over multiple lines.',
    platform: 'all',
  },
  {
    name: 'OTPInput',
    status: 'released',
    releasedIn: '3.1.0',
    storybookLink: 'Components/Input/OTPInput',
    description:
      'A one-time password (OTP), also known as a one-time PIN, one-time authorization code (OTAC) or dynamic password, is a password that is valid for only one login session or a transaction. These are a group of inputs and can be either 4 or 6 characters long.',
    platform: 'all',
  },
  {
    name: 'PasswordInput',
    status: 'released',
    releasedIn: '2.5.0',
    storybookLink: 'Components/Input/PasswordInput',
    description:
      'PasswordInput is an input field for entering passwords. The input is masked by default. On mobile devices the last typed letter is shown for a brief moment. The masking can be toggled using an optional reveal button.',
    platform: 'all',
  },
  {
    name: 'Radio',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Radio & RadioGroup',
    description:
      'Radio & RadioGroup can be used in forms when a user needs to single value from several options.',
    platform: 'all',
  },
  {
    name: 'RadioGroup',
    status: 'released',
    releasedIn: '1.0.0',
    storybookLink: 'Components/Radio & RadioGroup',
    description:
      'RadioGroup can be used to group together multiple radios in a forms which provides out of the box state management for the multi-radio and other features.',
    platform: 'all',
  },
  {
    name: 'Text',
    status: 'released',
    releasedIn: '0.4.0',
    storybookLink: 'Components/Typography/Text',
    description:
      'Text component is used to display main content of the page. It is often clubbed with Title or Heading to display content in a hierarchical structure. It applies responsive styles automatically based on the device it is being rendered on.',
    platform: 'all',
  },
  {
    name: 'Heading',
    status: 'released',
    releasedIn: '0.6.0',
    storybookLink: 'Components/Typography/Heading',
    description: 'Heading Component is usually used for headings of each major section of a page.',
    platform: 'all',
  },
  {
    name: 'Title',
    status: 'released',
    releasedIn: '0.5.0',
    storybookLink: 'Components/Typography/Title',
    description:
      'Title Component makes a bold visual statement. Use them to create impact when the main goal is visual storytelling. For example, use Title as marketing content on landing pages or to capture attention during onboarding.',
    platform: 'all',
  },
  {
    name: 'Code',
    status: 'released',
    releasedIn: '3.0.0',
    storybookLink: 'Components/Typography/Code',
    description:
      'Code component can be used for displaying token, variable names, or inlined code snippets.',
    platform: 'all',
  },
  {
    name: 'SkipNav',
    status: 'released',
    releasedIn: '0.9.0',
    storybookLink: 'Components/Accessibility/SkipNav',
    description:
      'SkipNav component lets users skip the navigation and jump to the main content of the page. Useful when you have navbars at the top and the user wants to jump directly to the main content.',
    platform: 'web',
  },
  {
    name: 'VisuallyHidden',
    status: 'released',
    releasedIn: '0.9.0',
    storybookLink: 'Components/Accessibility/VisuallyHidden',
    description:
      'VisuallyHidden component makes content hidden from sighted users but available for screen reader users.',
    platform: 'all',
  },
  {
    name: 'Dropdown',
    status: 'released',
    releasedIn: '6.2.0',
    storybookLink: 'Components/Dropdown/With Select',
    description:
      'Dropdown Menu displays a list of choices on temporary surfaces. They allow users to make a selection from multiple options. They appear when users interact with a button, action, or other control.',
    platform: 'all',
  },
  {
    name: 'SelectInput',
    status: 'released',
    releasedIn: '6.2.0',
    storybookLink: 'Components/Dropdown/With Select',
    description:
      'Select displays a list of choices on temporary surfaces. They allows users pick a value from predefined options',
    platform: 'all',
  },
  {
    name: 'Layout Primitives',
    status: 'released',
    releasedIn: '6.5.0',
    storybookLink: 'Components/Layout Primitives (Box)/Layout Primitives Tutorial',
    description:
      'Layout Primitives are used to build complex responsive layouts. Includes Box component and Styled Props on existing blade components',
    platform: 'all',
  },
  {
    name: 'BottomSheet',
    status: 'released',
    releasedIn: '7.2.0',
    storybookLink: 'Components/BottomSheet',
    description:
      'Bottom sheets are surfaces containing supplementary content that are anchored to the bottom of the screen.',
    platform: 'all',
  },
  {
    name: 'Tags',
    status: 'released',
    releasedIn: '9.3.0',
    storybookLink: 'Components/Tag',
    description: 'A tag labels UI objects for quick recognition and navigation.',
    platform: 'all',
  },
  {
    name: 'Amount',
    status: 'released',
    releasedIn: '6.7.0',
    storybookLink: 'Components/Amount',
    description: 'Amount component is used to display & format various currencies',
    platform: 'all',
  },
  {
    name: 'Switch',
    status: 'released',
    releasedIn: '8.5.0',
    storybookLink: 'Components/Switch',
    description:
      'Switch component is used as an alternative for the checkbox component, It can be used to switch between two states: often on or off.',
    platform: 'all',
  },
  {
    name: 'Tooltip',
    status: 'released',
    description:
      'Tooltip is a brief, informative message that appears when a user interacts with an element.',
    releasedIn: '8.9.0',
    storybookLink: 'Components/Tooltip',
    platform: 'all',
  },
  {
    name: 'Accordion',
    status: 'released',
    releasedIn: '8.12.0',
    storybookLink: 'Components/Accordion',
    description:
      'Accordion component allows the user to show and hide sections of related content on a page',
    platform: 'all',
  },
  {
    name: 'Collapsible',
    status: 'released',
    releasedIn: '8.12.0',
    storybookLink: 'Components/Collapsible',
    description:
      'Collapsibles are used to allow users to toggle the visibility of hidden content within a container.',
    platform: 'all',
  },
  {
    name: 'Modal',
    status: 'released',
    description:
      "Modal is a dialog that focuses the user's attention exclusively on an information via a window that is overlaid on primary content.",
    releasedIn: '8.8.0',
    storybookLink: 'Components/Modal/SimpleModal',
    platform: 'all',
  },
  {
    name: 'Divider',
    status: 'released',
    description: 'Dividers are used to visually separate content in a list or group.',
    releasedIn: '8.14.0',
    storybookLink: 'Components/Divider',
    platform: 'all',
  },
  {
    name: 'Chip',
    status: 'released',
    description:
      'Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. Chips can have either single selection or multiple (based on context).',
    releasedIn: '10.4.0',
    storybookLink: 'Components/Chip/Chip',
    platform: 'all',
  },
  {
    name: 'FileUpload',
    status: 'released',
    releasedIn: '11.6.0',
    storybookLink: 'Components/FileUpload',
    description: 'FileUpload component allow users to select one or more files to upload.',
    platform: 'web',
  },
  {
    name: 'Drawer',
    status: 'released',
    releasedIn: '11.4.0',
    storybookLink: 'Components/Drawer',
    description: 'The Drawer component is a panel that slides out from the edge of the screen.',
    platform: 'web',
  },
  {
    name: 'Slot',
    status: 'released',
    releasedIn: '5.3.0',
    description:
      'The Slot component is a generic component which can be used as container. (This is a design only component)',
    platform: 'all',
  },
  {
    name: 'SkeletonLoader',
    status: 'released',
    releasedIn: '9.1.0',
    storybookLink: 'Components/Skeleton',
    description:
      'Skeleton Loader is a static / animated placeholder for the information that is still loading. It mimic the structure and look of the entire view.',
    platform: 'all',
  },
  {
    name: 'Carousel',
    status: 'released',
    releasedIn: '10.2.0',
    storybookLink: 'Components/Carousel',
    description:
      'Carousel is a component to one-by-one display multiple blocks of information in circular manner',
    platform: 'all',
  },
  {
    name: 'Tabs',
    status: 'released',
    releasedIn: '10.16.0',
    storybookLink: 'Components/Tabs',
    description:
      'Tabs is a component which will allow you to show multiple clickable tabs in your UI',
    platform: 'all',
  },
  {
    name: 'Table',
    status: 'released',
    releasedIn: '10.19.0',
    storybookLink: 'Components/Table',
    description: 'Table will allow you to display your data in tabular manner',
    platform: 'web',
  },
  {
    name: 'Charts',
    status: 'in-design',
    description: 'Charts will allow you to display your data in graphical manner',
  },
  {
    name: 'Menu',
    status: 'released',
    description:
      'Menu displays a list of actions on temporary surfaces. They allow users to action(s) from multiple options. They appear when users interact with a button, action, or other control.',
    releasedIn: '11.22.0',
    storybookLink: 'Components/Menu',
    platform: 'web',
  },
  {
    name: 'TopNav',
    status: 'released',
    storybookLink: 'Components/TopNav',
    description:
      'TopNav is a horizontal navigation component that can be used to navigate between pages.',
    releasedIn: '11.23.0',
    platform: 'web',
  },
  {
    name: 'SideNav',
    status: 'released',
    description:
      'SideNav is a vertical navigation component that can be used to navigate between pages.',
    platform: 'web',
    storybookLink: 'Components/DatePicker',
    releasedIn: '11.21.0',
  },
  {
    name: 'DatePicker',
    status: 'released',
    description: 'DatePicker will provide an easy way to input dates and ranges',
    platform: 'web',
    storybookLink: 'Components/DatePicker',
    releasedIn: '11.21.5',
  },
  {
    name: 'AutoComplete',
    status: 'released',
    releasedIn: '10.9.0',
    storybookLink: 'Components/Dropdown/With AutoComplete',
    description:
      'AutoComplete Component will allow you to filter Dropdown options as you type ahead in the Input',
    platform: 'all',
  },
  {
    name: 'Toast',
    status: 'released',
    releasedIn: '11.3.0',
    storybookLink: 'Components/Toast/Docs',
    description: 'Toast is a component to show a simple floating messages to your users',
    platform: 'web',
  },
  {
    name: 'SearchInput',
    status: 'released',
    description:
      'A search input is an input field that allow users to input search queries with a keyboard.',
    platform: 'all',
    releasedIn: '11.17.0',
    storybookLink: 'Components/Input/SearchInput',
  },
  {
    name: 'StepGroup',
    status: 'released',
    description: 'A stepper component is used to indicate progress through a multi-step process.',
    platform: 'web',
    storybookLink: 'Components/StepGroup',
    releasedIn: '11.15.0',
  },
  {
    name: 'ButtonGroup',
    status: 'released',
    releasedIn: '11.8.0',
    storybookLink: 'Components/ButtonGroup',
    platform: 'web',
    description: 'ButtonGroup component can be used to group related buttons.',
  },
  {
    name: 'PhoneNumberInput',
    status: 'released',
    platform: 'web',
    releasedIn: '11.10.0',
    storybookLink: 'Components/Input/PhoneNumberInput',
    description:
      'A phone number input is an input field that allow users to input phone numbers with a keyboard. It supports entering phone numbers from different geographic locations.',
  },
  {
    name: 'Breadcrumbs',
    status: 'released',
    releasedIn: '11.5.0',
    platform: 'web',
    storybookLink: 'Components/Breadcrumbs',
    description:
      'Breadcrumbs is a navigation pattern that helps users understand the hierarchy of a website.',
  },
  {
    name: 'Popover',
    status: 'released',
    releasedIn: '10.10.0',
    storybookLink: 'Components/Popover',
    description:
      'The popover typically provides additional context about the element or its function. A popover is always triggered by a mouse hover on desktop and on tap on mobile.',
    platform: 'all',
  },
  {
    name: 'SpotlightPopoverTour',
    status: 'released',
    releasedIn: '10.18.0',
    storybookLink: 'Components/SpotlightPopoverTour/Docs',
    description:
      'The SpotlightPopoverTour component is used to provide context as well as enable users to take certain actions on it. These are used to highlight a new feature or provide a guided tour to a new user.',
    platform: 'web',
  },
  {
    name: 'Fade',
    status: 'released',
    releasedIn: '12.0.0',
    storybookLink: 'Motion/Fade/Docs',
    description:
      'The Fade component is a motion preset that animates the opacity of its children, allowing them to smoothly appear or disappear. It ensures seamless transitions while keeping the UI visually engaging.',
    platform: 'web',
  },
  {
    name: 'Move',
    status: 'released',
    releasedIn: '12.0.0',
    storybookLink: 'Motion/Move/Docs',
    description:
      'The Move component is a motion preset that animates the opacity and position of its children, allowing them to smoothly appear or disappear. It ensures seamless transitions while keeping the UI visually engaging.',
    platform: 'web',
  },
  {
    name: 'Slide',
    status: 'released',
    releasedIn: '12.0.0',
    storybookLink: 'Motion/Slide/Docs',
    description:
      'The Slide component is a motion preset that animates the children by sliding them in from outside of viewport, allowing them to smoothly appear or disappear. Unlike Move, Slide is meant to animate components from outside of viewport',
    platform: 'web',
  },
  {
    name: 'Morph',
    status: 'released',
    releasedIn: '12.0.0',
    storybookLink: 'Motion/Morph/Docs',
    description:
      "Morph component is a abstraction on motion react's layout animations. It allows you to morph between 2 elements",
    platform: 'web',
  },
  {
    name: 'Scale',
    status: 'released',
    releasedIn: '12.0.0',
    storybookLink: 'Motion/Scale/Docs',
    description:
      'Scale component animates over CSS `scale` property and allows you to enlarge or shrink element on certain interactions',
    platform: 'web',
  },
  {
    name: 'AnimateInteractions',
    status: 'released',
    releasedIn: '12.0.0',
    storybookLink: 'Motion/AnimateInteractions/Docs',
    description:
      'AnimateInteractions is a component that allows you to animate child components based on interactions on parent. This is similar to doing `.parent:hover .child {}` styling in CSS.',
    platform: 'web',
  },
  {
    name: 'Stagger',
    status: 'released',
    releasedIn: '12.0.0',
    storybookLink: 'Motion/Stagger/Docs',
    description:
      'Stagger component allows you to stagger children (make them appear one after the other). Its a utility preset. You can use any of the base presets like Move, Fade, Slide inside of it',
    platform: 'web',
  },
];

export type { ComponentStatuses, ComponentStatusDataType };
export { componentData };
