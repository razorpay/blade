import React from 'react';
import { List, ListItem, ListItemLink, ListItemText, ListItemCode } from '@razorpay/blade/components';
import { BookmarkIcon } from '@razorpay/blade/components';

export const Unordered = () => (
  <List variant="unordered">
    <ListItem>Accept payments via UPI, Cards, and Netbanking</ListItem>
    <ListItem>Instant settlements to your bank account</ListItem>
    <ListItem>Real-time transaction monitoring</ListItem>
  </List>
);

export const Ordered = () => (
  <List variant="ordered">
    <ListItem>Create your merchant account</ListItem>
    <ListItem>Complete KYC verification</ListItem>
    <ListItem>Integrate payment gateway</ListItem>
    <ListItem>Start accepting payments</ListItem>
  </List>
);

export const OrderedFilled = () => (
  <List variant="ordered-filled">
    <ListItem>
      <ListItemLink>Build Integration:</ListItemLink> Use the sample codes to integrate Razorpay Checkout
    </ListItem>
    <ListItem>
      <ListItemLink>Test Integration:</ListItemLink> Test the integration to ensure it works
    </ListItem>
    <ListItem>
      <ListItemLink>Go Live:</ListItemLink> Complete the go-live checklist
    </ListItem>
  </List>
);

export const WithIcon = () => (
  <List variant="unordered" icon={BookmarkIcon}>
    <ListItem>
      <ListItemLink>Troubleshooting and FAQs</ListItemLink>
    </ListItem>
    <ListItem>
      <ListItemLink>Payment Methods</ListItemLink>
    </ListItem>
    <ListItem>
      <ListItemLink>International Currency Support</ListItemLink>
    </ListItem>
  </List>
);

export const WithCode = () => (
  <List variant="ordered">
    <ListItem>
      Bump blade version to <ListItemCode>v6.0.0</ListItemCode>
    </ListItem>
    <ListItem>
      Run <ListItemCode>yarn install</ListItemCode>
    </ListItem>
    <ListItem>
      Run <ListItemCode>yarn start</ListItemCode>
    </ListItem>
  </List>
);

export const WithStyledText = () => (
  <List variant="ordered">
    <ListItem>
      <ListItemText>
        You will receive an invoice after a
        <ListItemText as="span" weight="semibold" color="feedback.text.positive.intense">
          {' successful '}
        </ListItemText>
        payment
      </ListItemText>
    </ListItem>
    <ListItem>
      You will receive a mail after a
      <ListItemText as="span" weight="semibold" color="feedback.text.negative.intense">
        {' failed '}
      </ListItemText>{' '}
      payment
    </ListItem>
  </List>
);
