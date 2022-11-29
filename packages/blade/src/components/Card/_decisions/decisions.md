# Card Decisions <!-- omit in toc -->

Cards are used to group similar concepts and tasks together to make easier for merchants to scan, read, and get things done. In simpler words Cards help seprates content into sections. They are the surfaces that display content and actions on a single topic. They should be easy to scan for relevant and actionable information.

- [Design](#design)
- [Anatomy](#anatomy)
- [Card Requirements](#card-requirements)
- [Card API Constraints](#card-api-constraints)
- [API](#api)
  - [`Card` API](#card-api)
  - [`Card.Header` API](#cardheader-api)
  - [`Card.Footer` API](#cardfooter-api)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=5200%3A0) to all variants of the Card component

## Anatomy

<img src="./card-anatomy.png" width="80%" />

Components: 

- `Card`
- `Card.Header`
- `Card.Body`
- `Card.Footer`

## Card Requirements

- 2 Levels (color levels)
- Slot for user's content
- Have Header/Footer
- **Header**
  - Header have leading and trailing sections
  - Leading section can have: 
    - Icon
    - Title
    - Subtitle
    - Counter
  - Trailing section can have:
    - Badge
    - Text
    - Link
    - Icon Button
- **Footer**
  - Footer have leading and trailing sections:
  - Leading section can have: 
    - Title
    - Subtitle
  - Trailing section can have:
    - Primary action button
    - Secondary action button


## Card API Constraints 

**Header Leading Section**

- `Title` & `Subtitle`
  - Size & text variant cannot be changed
- `Icon`
  - Size & color cannot be changed
- `Counter`
  - Size can be changed but not recommended
  - Variant can be changed

**Header Trailing Section**

Anything can be changed in these components, but whats given out of the box are the recommended: 

Only one of the component can be used at a time: 
- Badge
- Text
- Link
- IconButton - tertiary

Other recommendations from design side: 

- Never use a primary/secondary action in the header, footer are meant for such actions.
  - This means it's not recommended to change variant of IconButton

**Footer Leading Section**

- `Title` & `Subtitle`
  - Size & text variant cannot be changed

**Footer Trailing Sections**

- Only two action buttons can be present `primary` or `secondary`
- Users can totally omit action buttons
- They can also use either variants of buttons `primary` or `secondary`

## API

With the above constraints we can propose the Card API as follows: 

Sample usage:

```jsx
<Card backgroundLevel={1}>
  <Card.Header 
    title="Payments Links" 
    subtitle="Share payment link via an email, SMS, messenger, chatbot etc." 
    titlePrefix={<DollarIcon size="xl" />}
    titleSuffix={<Counter amount={20} />}
    trailingVisual={<Badge variant="positive">NEW</Badge>}
  />
  <Card.Body>
    Card Body Content
  </Card.Body>
  <Card.Footer
    title="Card Footer Title" 
    subtitle="Card footer subtitle" 
    actions={{
      primaryAction: { text: 'Know more', onClick: () => {} },
      secondaryAction: { text: 'Read Docs', onClick: () => {} },
    }} 
  />
</Card>
```


### `Card` API


| Prop              | Type   | Default | Description                                                                            | Required |
| ----------------- | ------ | ------- | -------------------------------------------------------------------------------------- | -------- |
| `backgroundLevel` | `2, 3` | `2`     | Surface level of the card background color, use this based on where the card is placed |          |


### `Card.Header` API


| Prop             | Type              | Default     | Description                                              | Required |
| ---------------- | ----------------- | ----------- | -------------------------------------------------------- | -------- |
| `title`          | `string`          | `undefined` | Title of the Card                                        | ✅        |
| `subtitle`       | `string`          | `undefined` | Subtitle of the Card                                     |          |
| `titlePrefix`    | `React.ReactNode` | `undefined` | Prefix element placed before title text (eg: Icon)       |          |
| `titleSuffix`    | `React.ReactNode` | `undefined` | Suffix element placed after title text (eg: Counter)     |          |
| `trailingVisual` | `React.ReactNode` | `undefined` | Trailing visual element placed on right side of the card |          |

### `Card.Footer` API

| Prop       | Type                                     | Default     | Description                                | Required |
| ---------- | ---------------------------------------- | ----------- | ------------------------------------------ | -------- |
| `title`    | `string`                                 | `undefined` | Title of the Card                          | ✅        |
| `subtitle` | `string`                                 | `undefined` | Subtitle of the Card                       |          |
| `actions`  | `{ primary: Action, secondary: Action }` | `undefined` | Renders a primary/secondary action buttons |          |

```ts
type Action = {
  onClick: () => void;
  text: string;
}
```

## Accessibility 

For Cards there won't be any aria related logic needed to make it accessible. Though important things to consider while building cards are: 

- Ensure the markup is sementic
- Mantaining proper reading/tab order while placing multiple cards in a group

Since our Cards are not wrapped in a link or is clickable by design we don't have to worry about nested actions. 

## Alternative APIs

We also evaluated few alternative approaches before finalizing the API, Here are few pros and cons of each: 

**API 1:**

*Pros:*

- More customisable than prop based api

*Cons:*

- Hard to enforce via Types
- Runtime enforcement is complex to do
- The JSX nesting isn't very simple and doesn't match with the visual design (notice how HeaderCounter is inside HeaderTitle with the title's text)

```jsx
<Card.Header>
  <Card.HeaderTitle icon={Clock} subtitle="Card subtitle">
    Card Header Title
    <Card.HeaderCounter value={12} />
  </Card.HeaderTitle>
  <Card.HeaderTrailingVisual>
    <Badge />
  </Card.HeaderTrailingVisual>
</Card.Header>
```

**API 2:**

*Pros:*

- Satisfies all the needs for customisability in Header
- The JSX structure matches well with design
- Same Leading & Trailing API can be used in the footer

*Cons:*

- Runtime enforcement is very hard to do.
- API is verbose, and the learning curve is too large
- The consumer would need to learn where and how to put the JSX structure to build the card
- The API is too flexible, we want some control over the API to reduce the footguns.
- We need a few runtime hacks and checks on the `Card.headerLeading` part to make sure we are putting everything on the right place.

```jsx
<Card.Header>
  <Card.HeaderLeading>
    <Clock />
    <Card.HeaderTitle title="" subtitle=""  />
    <Counter />
  </Card.HeaderLeading>
  <Card.HeaderTrailing>
    <Badge />
  </Card.HeaderTrailing>
</Card.Header>
```

**API 3:**

Pros: 

- Total control of the API

Cons: 

- API is too restrictive, consumers won't even be able to change the counter's variant
- Introduces [Apropcalypse](https://twitter.com/dan_abramov/status/1124249242720194560)
- No scope of future extension, if we change any APIs to add anything we need to introduce a lot of breaking changes

```jsx
<Card 
  level={1 | 2} 
  header={{
    title: '',
    subtitle: '',
    prefixIcon: '',
    counter: 12,
    trailingVisual: <Badge />
  }}
  footer={{
    title: '',
    subtitle: '',
    actions: {
      primaryAction:{ text: 'Save', onClick: () => {} },
      secondaryAction:{ text: 'Delete', onClick: () => {} },
    }
  }}
>
  User content
</Card>
```

After careful considerations & discussing with the team we decided the go ahead with a hybrid approach of Compound component API + Props API which leads to more consistent & easy to use API which also provides certain levels of flexibility as needed in the Card.Header.

## Open Questions

- In footer action buttons should `secondary` action button only exist if `primary` action button is present? - 
  - **ANS:** Secondary, Primary can independently work