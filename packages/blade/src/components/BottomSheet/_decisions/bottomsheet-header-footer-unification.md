# BottomSheet Header/Footer Unified API

Final API:

**Header**

```jsx
<BottomSheetHeader
  title=""
  subtitle=""
  leading={<AssetComponent />}
  trailing={<BottomSheetCounter />}
  titleSuffix={<BottomSheetCounter />}
  showBackButton={true}
  onBackButtonClick={() => {}}
  hideDivider={false}
/>
```

**Footer**

```jsx
<BottomSheetFooter>
  <Box flex="" flexDirection="">
    <Checkbox />
    <Button />
    <Button />
  </Box>
</BottomSheetFooter>
```

**Pending Open Question:**

In BottomSheetHeader/ModalHeader and etc component, how do we handle the sub components?

From design side we have restriction that, the sub components properties like size will always be the same which is provided out of the box, users wont be able to change them.

1. Should we have sub components for each? `<BottomSheetCounter /> <ModalCounter />`
2. Or should we have `<HeaderCounter /> <HeaderBadge />` etc base components

3. Or should we just not have any sub components? Just <Counter /> <Badge />

4. Or should we accept `<Counter /> <Badge />` and inject the sizes via React.cloneElement() internally?

**Method 1:** Should we have sub components for each? `<BottomSheetCounter /> <ModalCounter />`

**Pros:**

- Will be consistent with the design

**Cons:**

- Users will have to import a lot of components and we will also have to create many similar components like BottomSheetCounter, ModalCounter, DropdownCounter, CardCounter

**Method 2:** Should we have `<HeaderCounter /> <HeaderBadge />` etc base components

**Pros: **

- Will be consistent with the design
- No more similar subcomponents for each parent component

**Cons:**

- The “Header” naming convention is a bit vague and generic, doesn’t hints that it can be used with Dropdown, BottomSheet or other components
- Implementation could become a mess, imagine in HeaderIconButton is of size “small” in BottomSheet but in Modal it needs to be “medium”, now the HeaderIconButton will need to know where it’s being rendered and have to change it’s internal size, which is fragile and hacky.

**Method 3:** Should we just not have any sub components? Just `<Counter /> <Badge />`

**Pros:**

- No need to import lots of similarly named components
- No more subcomponents for each parent component

**Cons:**

- Cannot be consistent with the design, users will be able to pass any size to the components
- Users will need to be responsible for passing the correct default sizes to the components like `<Counter size=”small” />`

**Method 4: **Or should we accept `<Counter /> <Badge />` and inject the sizes via React.cloneElement() internally?

**Pros:**

- Will be consistent with the design
- No need to import lots of similarly named components
- No subcomponents for each parent component

**Cons:**

- Expectation mismatch - if user passes <Link size=”large” /> we will have to override that and can lead to expectation mismatch. (tho in this case, we can either silently override the prop or check if user passes size and throw an error so they don’t pass it in)
- It doesn’t work well if the sub-component’s props are required, because now users will have to pass that in otherwise TS will yell, for example Icons.
- Bit of magic under the hood with runtime logic

Proposed:

**Header:**

- Discuss Header Trailing, what else we need in there, do we even need it?

- **Suffix and trailing sound confusing, because suffix/prefix is related to the Title not the whole bottomsheet**

- Will the header always have a divider or will it show and hide depending on where it is positioned

- Header will only have showBackButton things, close button is handled by BottomSheet root.

- There usecases for trailing, (eg care pod can have support ticket link/badge in right side)

- rethink header prefix/suffix as how we do in figma, leading - body - trailing

```jsx
<BottomSheet onClose={()={}}>
    <BottomSheetHeader
      title="" // since there is only one title and we control the rendering so this should be fine?
      subtitle=""
      prefix={<AssetComponent />}
      suffix={<BottomSheetCounter />}
      trailing={}
      showBackButton={}
      onBackButtonClick={() => {}}
    />
</BottomSheet>;
```

**Footer:**

- Kamlesh and i were discussing the Footer, it seems that given the usecases, it might be just better to provide the slot as is.

```jsx
<BottomSheetFooter>
  <Box flex="" gap="">
    <Checkbox />
    <Button {...otherButtonProps} />
    <Button {...otherButtonProps} />
  </Box>
</BottomSheetFooter>
```

### BottomSheet - Header

Elements present in header:

- Leading
  - Prefix - Asset (optional)
  - Title (required)
  - Subtitle (optional)
  - Suffix - Counter (optional)
- Trailing (only one at a time, whole trailing is optional)
  - None
  - Badge
  - Icon button
  - Text
  - Link

**One important thing to note:**

Since BottomSheet header will also have back and close button but these are not directly controlled by the user, we take full control/responsibility of them thus we don't need to expose those in the API.

**API 1:**

Pros:

- Similar API to Card which we arrived at after 7 iterations

- Clear visual boundaries of prefix/suffix & leading/trailing

- Symmetric props

Cons:

- {poke holes}

NOTE:

For back button in the bottomsheet, will it be present even when the header is absent?

If so then we should have a prop for showing/hiding back-button `showBackButton` in the <BottomSheet /> root

```jsx
<BottomSheetHeader>
 <BottomSheetHeaderLeading
   title=""
   subtitle=""
   // future scope?
   prefix={<AssetComponent />}
   suffix={<BottomSheetCounter />}
 />
 <BottomSheetHeaderTrailing visual={Badge | IconButton | Link} />
 // OR
 <BottomSheetHeaderTrailing>Badge | IconButton | Link</BottomSheetHeaderTrailing>
</BottomSheetHeader>

<BottomSheet onCloseButtonClick={}>

</BottomSheet>

// about this simple API?
<BottomSheetHeader
    title="" // since there is only one title and we control the rendering so this should be fine?
    subtitle=""
    prefix={<AssetComponent />}
    suffix={<BottomSheetCounter />}
    trailingVisual={}
    showBackButton={}
    onBackButtonClick={() => {}}
  />
```

**API 2:**

Props:

- Simpler looking API

Cons:

- Confusing prop names
- Non symmetric props
  - titleRightAddon - won't have titleLeftAddon unless we add in future
  - trailingVisual - will never have leadingVisual

```jsx
<BottomSheetHeader
  title=""
  subtitle=""
  // future scope?
  titleLeftAddon={<Asset />}
  titleRightAddon={<BottomSheetCounter />}
  trailingVisual={Badge | IconButton | Link} // or just trailing={}
/>
```

**API 3:**

Con:

- Visualzing what comes first, prefix, suffix or trailing is hard and confusing

Same as API 2 just changed titleLeft and titleRight to prefix/suffix

```jsx
<BottomSheetHeader
  title=""
  subtitle=""
  // future scope?
  prefix={<Avatar />}
  suffix={<BottomSheetBadge />}
  trailingVisual={Badge | IconButton | Link} // or just trailing={}
/>
```

**API 4:**

After discussing with Rastogi, this is 1:1 with how figma does it

```jsx
<BottomSheetHeader
  title=""
  subtitle=""
  leading={<Asset />}
  trailing={Badge | IconButton | Link}
  titleAddon={<BottomSheetCounter />}
/>
```

[Consult 7 other APIs which we discussed in Card](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Card/_decisions/decisions.md#alternative-apis)

### BottomSheet Footer

Elements present:

The whole layout can either be `vertical` or `horizontal`

- Slot (optional)
  - Text
  - Link
  - Alert
  - Checkbox
- Actions (optional)
  - Primary
  - Secondary / Tertiary (optional)

**API 1:**

Pros:

- Concise API
- Have restrictions in place for actions

Cons:

- From design side we said that the secondary button can also be tertiary, how will we accomodate that in this API?

- `actions` prop first in the props and then the SLOT is in `children` visual hierarchy and JSX hierarchy doesn't match up that nicely.

```jsx
<BottomSheetFooter
  layoutDirection="vertical | horizontal" // discuss this naming
  actions={{
    primary: Action,
    secondary: Action,
  }}
>
  <AnythingInSlot />
</BottomSheetFooter>
```

**API 2**

Pros:

- Can accomodate tertiary button and secondary button interchangeably

Cons:

- No restrictions on the actions, since it accepts jsx, people can add 2 or 3 buttons in anywhich order they like

```jsx
<BottomSheetFooter
 layoutDirection="vertical | horizontal" // discuss this naming
 actions={<AnyJSXButtons />}
>
 <AnythingInSlot />
</BottomSheetFooter>

// or

<BottomSheetFooter
    layoutDirection="vertical | horizontal" // discuss this naming
  >
    <Checkbox />
    <Button {...otherButtonProps} />
    <Button {...otherButtonProps} />
  </BottomSheetFooter>;
<BottomSheetFooter>
	<AnyJSX />
</BottomSheetFooter>
```

---- FIN -----

**Previous Discussion about footer when it was complex**

Make the Footer free.

In this API the patterns will be set by the design side and consumers can use them as guidelines and add it in the children.

We have all the primitive components to seamlessly build the patterns, Layout, Box, Buttons Checkboxes etc.

In this quarter we will also be picking <ButtonGroup /> which will standardize the `Actions` too

Where users can do this:

Pros

- Really flexible
- Extendable

Cons

- Users will somewhat have to think of the layout, because we have vertical and horizontal layouts users will have to keep that in mind and add appropriate wrappers around elements.

- No restrictions from the code side

```jsx
<BottomSheetFooter layoutDirection="vertical | horizontal">
 <AnythingElse>
 <ButtonGroup attached={false}>
   <Button>Primary</Button>
   <Button>Secondary</Button>
 </ButtonGroup>
</BottomSheetFooter>
```

or

```jsx
<BottomSheetFooter layoutDirection="vertical | horizontal">
  <Box display="flex">
    <Checkbox label="Remember login" />
    <Button>Login</Button>
  </Box>
</BottomSheetFooter>
```

### General Header/Footer Component (This is to be discussed after we decide on the general structure above)

This component will be an internal component, from which we will be creating more restrictive sub components.

This component will be a master component which will support all the permutations and combinations.

_NOTE: _

_Here we want to focus on where to put the Close & Back button_

**API 1:**

Pros:

- Back & Close Button are more flexible

- No ambiguity of additional props

Cons:

- Less restictive - which is fine probably? it's an internal component

```jsx
<BaseHeader>
  <BaseHeaderBackButton onClick={} />
  <BaseHeaderLeading
    title=""
    subtitle=""
    prefix={AssetComponent | BladeIcon}
    suffix={<Counter />}
  />
  <BaseHeaderTrailing>Badge | IconButton | Link</BottomSheetHeaderTrailing>
  <BaseHeaderCloseButton onClick={} />
</BaseHeader>
```

**API 2 (Final API)**

Pros:

- More restrictive & resilent since the rendering is handled internally

Cons:

- More props, introduces propocalypse

```jsx
<BaseHeader>
  <BaseHeaderLeading
    title=""
    subtitle=""
    prefix={}
    suffix={}
    showBackButton={boolean}
    onBackButtonClick={}
    showCloseButton={}
    showDivider={}
  />
  <BaseHeaderTrailing showCloseButton={boolean} onCloseButtonClick={}>
    Badge | IconButton | Link
  </BottomSheetHeaderTrailing>
</BaseHeader>
```

**API 3**

Pros:

- More restrictive & resilent since the rendering is handled internally

- One place to put all the props in `BaseHeader`

Cons:

- introduces propocalypse

```jsx
<BaseHeader
  showBackButton={boolean}
  showCloseButton={boolean}
  onBackButtonClick={}
  onCloseButtonClick={}
>
  <BaseHeaderLeading
    title=""
    subtitle=""
    prefix={AssetComponent | BladeIcon}
    suffix={<Counter />}
  />
  <BaseHeaderTrailing>Badge | IconButton | Link</BottomSheetHeaderTrailing>
</BaseHeader>
```

> This markdown is cloned from: https://docs.google.com/document/d/1gzWRv5RyTgwJiJkzxyvCwV1XVo8QMmoevoakbDD5qsQ/edit#heading=h.fibtey47od68
