## Component Name
Avatar and AvatarGroup

## Description
Avatar is a standardized visual representation of a user or entity, displayed as a profile picture, icon, or initials. It facilitates user recognition and streamlines interface navigation in applications. AvatarGroup allows you to display multiple avatars together in a compact, overlapping layout, useful for team members or participants.

## TypeScript Types
The following types represent the props that the Avatar and AvatarGroup components accept. These types allow you to properly configure the components according to your needs.

```typescript
// Common size options for Avatar
type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

// Image-specific properties for Avatar
type AvatarImgProps = {
  /**
   * Custom image source
   */
  src?: string;
  /**
   * The `alt` attribute for the `img` element
   */
  alt?: string;
  /**
   * The `srcSet` attribute for the `img` element, useful for responsive images.
   */
  srcSet?: string;
  /**
   * CORS settings attributes
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /**
   * Defines which referrer is sent when fetching the resource.
   */
  referrerPolicy?: HTMLAttributeReferrerPolicy;
};

// Common properties for Avatar
type AvatarCommonProps = {
  /**
   * The size of the avatar.
   * @default "medium"
   */
  size?: AvatarSize;
  /**
   * The visual variant of the avatar.
   * @default "circle"
   */
  variant?: 'circle' | 'square';
  /**
   * The color theme of the avatar.
   * @default "neutral"
   */
  color?: 'primary' | 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
  /**
   * Custom icon component to use as the avatar.
   */
  icon?: IconComponent;
  /**
   * The name of the avatar, used to generate initials.
   * If src has loaded, the name will be used as the alt attribute of the img.
   * If src is not loaded, the name will be used to create the initials.
   */
  name?: string;
  /**
   * Automatically renders button with `a` tag with `href` on web
   */
  href?: string;
  /**
   * anchor target attribute
   * Should only be used alongside `href`
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /**
   * anchor rel attribute
   * Should only be used alongside `href`
   */
  rel?: string;
  /**
   * Click handler for the avatar.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Whether the avatar is selected
   */
  isSelected?: boolean;
  /**
   * Custom icon component to render at bottom of the avatar.
   * Only accepts IconComponent
   */
  bottomAddon?: IconComponent;
  /**
   * Custom component to render at top of the avatar.
   * Only accepts Indicator
   */
  topAddon?: React.ReactElement;
  /**
   * Test ID for the component
   */
  testID?: string;
  
  // Common event handlers
  onBlur?: React.FocusEventHandler;
  onFocus?: React.FocusEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onMouseMove?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  onPointerDown?: React.PointerEventHandler;
  onPointerEnter?: React.PointerEventHandler;
  onTouchStart?: React.TouchEventHandler;
  onTouchEnd?: React.TouchEventHandler;
  
  // Data analytics attributes
  [key: `data-analytics-${string}`]: string;
};

// Complete Avatar component props
type AvatarProps = AvatarCommonProps & AvatarImgProps & {
  // Data analytics attributes
  [key: `data-analytics-${string}`]: string;
};

// AvatarGroup component props
type AvatarGroupProps = {
  /**
   * Children elements representing the avatars to stack.
   */
  children: React.ReactNode;
  /**
   * The size of each avatar within the group. Propagates to all avatars.
   * @default "medium"
   */
  size?: AvatarSize;
  /**
   * The maximum number of avatars to display before truncating.
   */
  maxCount?: number;
  /**
   * Test ID for the component
   */
  testID?: string;
  
  // Data analytics attributes
  [key: `data-analytics-${string}`]: string;
};
```

## Examples

### Avatar Component Usage
This example shows the three main types of Avatar (image, letter, and icon) with various configurations.

```tsx
import React from 'react';
import {
  Avatar,
  Box,
  Indicator,
  BuildingIcon,
  TrustedBadgeIcon
} from '@razorpay/blade/components';

const AvatarExample = () => {
  // Image avatar with interactive props and variants
  const renderImageAvatars = () => (
    <Box display="flex" gap="spacing.4" alignItems="center">
      <Avatar 
        name="John Doe"
        src="https://example.com/profile.jpg"
        size="medium" 
        variant="circle"
        onClick={() => console.log('Avatar clicked')}
      />
      
      <Avatar 
        name="Jane Smith"
        src="https://example.com/profile.jpg"
        size="large" 
        variant="square"
        href="https://example.com/profile"
        target="_blank"
        rel="noopener noreferrer"
        isSelected={true}
      />
    </Box>
  );
  
  // Letter avatars showing color variations
  const renderLetterAvatars = () => (
    <Box display="flex" gap="spacing.4" alignItems="center">
      <Avatar name="John Doe" color="primary" size="small" />
      <Avatar name="Jane Smith" color="positive" size="medium" />
      <Avatar name="Bob Miller" color="negative" size="large" />
    </Box>
  );
  
  // Icon avatars and avatars with addons
  const renderAddonAvatars = () => (
    <Box display="flex" gap="spacing.4" alignItems="center">
      <Avatar 
        icon={BuildingIcon} 
        color="information" 
        variant="circle" 
      />
      
      <Avatar 
        name="With Addons" 
        size="large"
        topAddon={<Indicator color="negative" />}
        bottomAddon={TrustedBadgeIcon}
        data-analytics-section="profile"
        testID="user-avatar"
      />
    </Box>
  );
  
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {renderImageAvatars()}
      {renderLetterAvatars()}
      {renderAddonAvatars()}
    </Box>
  );
};

export default AvatarExample;
```

### Interactive Avatar with Controlled Selection State
This example shows how to handle click events and manage the selection state of avatars.

```tsx
import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Text
} from '@razorpay/blade/components';

const InteractiveAvatarExample = () => {
  // Track the selected avatar index
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // User data
  const users = [
    { id: 1, name: "John Doe", color: "primary" },
    { id: 2, name: "Jane Smith", color: "positive" },
    { id: 3, name: "Bob Miller", color: "negative" },
    { id: 4, name: "Alice Walker", color: "notice" }
  ];
  
  // Handle avatar click
  const handleAvatarClick = (index: number, userId: number) => {
    setSelectedIndex(index);
    console.log(`Avatar clicked: ${users[index].name}, ID: ${userId}`);
    
    // This is where you could do something with the selected user
    // e.g., fetch user details, open a profile modal, etc.
  };
  
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <Text>Click an avatar to select it:</Text>
      
      <Box display="flex" gap="spacing.4" alignItems="center">
        {users.map((user, index) => (
          <Avatar 
            key={user.id}
            name={user.name}
            color={user.color}
            size="medium"
            isSelected={selectedIndex === index}
            onClick={() => handleAvatarClick(index, user.id)}
          />
        ))}
      </Box>
      
      {selectedIndex !== null && (
        <Text>Selected user: {users[selectedIndex].name}</Text>
      )}
    </Box>
  );
};

export default InteractiveAvatarExample;
```

### AvatarGroup Component Usage
This example demonstrates the AvatarGroup component with different settings and configurations.

```tsx
import React from 'react';
import { 
  Avatar, 
  AvatarGroup, 
  Box 
} from '@razorpay/blade/components';

const AvatarGroupExample = () => {
  // Team members data
  const teamMembers = [
    { name: "John Doe", color: "primary" },
    { name: "Jane Smith", color: "positive" },
    { name: "Bob Miller", color: "negative" },
    { name: "Alice Walker", color: "notice" },
    { name: "David Clark", color: "information" }
  ];
  
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Basic avatar group */}
      <AvatarGroup>
        {teamMembers.map((member, index) => (
          <Avatar 
            key={index} 
            name={member.name} 
            color={member.color} 
          />
        ))}
      </AvatarGroup>
      
      {/* With maxCount - shows "+2" for overflow */}
      <AvatarGroup maxCount={3} size="large">
        {teamMembers.map((member, index) => (
          <Avatar 
            key={index} 
            name={member.name} 
            color={member.color}
          />
        ))}
      </AvatarGroup>
      
      {/* With size customization and analytics */}
      <AvatarGroup 
        size="small"
        data-analytics-section="team-view"
        testID="small-team-avatars"
      >
        <Avatar name="User 1" color="primary" />
        <Avatar name="User 2" color="positive" />
        <Avatar name="User 3" color="negative" />
      </AvatarGroup>
    </Box>
  );
};

export default AvatarGroupExample;
```

### Interactive AvatarGroup with Click Handling
This example shows how to handle clicks within an AvatarGroup.

```tsx
import React, { useState } from 'react';
import { 
  Avatar, 
  AvatarGroup, 
  Box,
  Text
} from '@razorpay/blade/components';

const InteractiveAvatarGroupExample = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  // Team members data
  const teamMembers = [
    { id: 1, name: "John Doe", color: "primary" },
    { id: 2, name: "Jane Smith", color: "positive" },
    { id: 3, name: "Bob Miller", color: "negative" },
    { id: 4, name: "Alice Walker", color: "notice" },
    { id: 5, name: "David Clark", color: "information" }
  ];
  
  const handleAvatarClick = (name: string) => {
    setSelectedUser(name);
    // Here you could trigger an action like showing a profile or opening a modal
  };
  
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <Text>Click an avatar to select that team member:</Text>
      
      <AvatarGroup maxCount={4}>
        {teamMembers.map((member) => (
          <Avatar 
            key={member.id}
            name={member.name}
            color={member.color}
            isSelected={selectedUser === member.name}
            onClick={() => handleAvatarClick(member.name)}
          />
        ))}
      </AvatarGroup>
      
      {selectedUser && (
        <Text>Selected team member: {selectedUser}</Text>
      )}
    </Box>
  );
};

export default InteractiveAvatarGroupExample; 