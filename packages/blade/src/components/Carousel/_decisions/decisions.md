# Carousel 

Carousel is a UI component that allows the display and navigation of a set of content items, typically images or cards, within a limited space. It is often used to showcase multiple pieces of content in a visually appealing and interactive way.

<img src="./carousel-thumbnail.png" width="380" />

## Design

[Figma Link](https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=2115-975416&mode=design&t=gjEux4FLvrLihxbH-0) to all variants of the Carousel component

## API

### Carousel

| Prop                     | Type                                   | Default                                  | Description                                                                                                                                                                                  | Required |
| ------------------------ | -------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| children                 | `CarouselItem`                         | `undefined`                              | Carousel slides                                                                                                                                                                              | ✅        |
| autoPlay                 | `boolean`                              | `false`                                  | If true, the carousel will autoplay                                                                                                                                                          |          |
| visibleItems             | `1,2,3,auto`                           | `1`                                      | Total number of carousel items to show at once, if set to 1,2 or 3 all the CarouselItem's width will remain the same but if set to `auto` the carousel items will take up space responsively |          |
| carouselItemWidth             | `number,string`                           | `undefined`                                      | Sets the width of the carousel items, this can be used with visibleItems: auto to achive automatic bleed |          |
| shouldAddStartEndMargin             | `boolean`                           | `false`                                      | If true, adds extra margin before and after the first/last slides so that they align in center, this prop can be used to achive carousel which is in [GST page](https://razorpay.com/gst-number-search/pan/)  |          |
| showIndicators           | `boolean`                              | `true`                                   | Toggles the visibility of indicators                                                                                                                                                         |          |
| showOverlay              | `boolean`                              | `false`                                  | Toggles the visibility of overlay                                                                                                                                                            |          |
| overlayColor             | `BrandColorTokens, SurfaceColorTokens` | `surface.background.level1.highContrast` | Changes the color of the overlay, so that consumers can blend the overlay with the background color                                                                                          |          |
| navigationButtonPosition | `bottom,side`                          | `bottom`                                 | Sets the position of navigation button                                                                                                                                                       |          |
| navigationButtonSpacing  | `SpacingTokens`                        | `spacing.4`                              | Spacing between navigation button and slides when bleed is set to none                                                                                                                       |          |
| navigationButtonStyle    | `filled,stroke`                        | `filled`                                 | Styles to be used depending on the emphasis you want to give to the navigation buttons                                                                                                       |          |
| indicatorVariant         | `gray,white,blue`                      | `gray`                                   | Variants to be used depending on the background and the emphasis you want to give to the indicator.                                                                                          |          |
| onChange                 | `(slideIndex: number) => void`         | `undefined`                              | Callback which gets fired everytime a slide changes, useful for analytic events (only runs on user interaction not on autoPlay)                                                              |          |

### CarouselItem

- N/A - CarouselItem will just be a wrapper and have internal styling

## Basic Usage Example

```jsx
const Testimonial = () => {
  return (
    <Box display="flex" gap="spacing.2">
      <Box>
        <Title>Acquire Customers From New Customer Segments</Title>
        <Text weight="bold">Subham Kumar</Text>
      </Box>
      <Img src="./avatar-1.png" />
    </Box>
  )
};

<Carousel
  autoPlay
  visibleItems={2}
  navigationButtonPosition="bottom"
>
  <CarouselItem>
    <Testimonial />
  </CarouselItem>
  <CarouselItem>
    <Testimonial />
  </CarouselItem>
  <CarouselItem>
    <Testimonial />
  </CarouselItem>
</Carousel>
```

<img src="./example-usage-1.png" width="70%" />



## Variants

Carousel has two variants which can solve most of the general & landing page usecases: 

- Variant 1: Without visibleItems
- Variant 2: With visibleItems.

### **Variant 1: Without visibleItems:**

When the `visibleItems` are not defined (or set to undefined) carousel becomes variant 1, which can have: 

- Automatic bleed support 
- Scroll Overlay support
- Have `shouldAddStartEndMargin` prop which can be used to replicate [these](https://razorpay.com/gst-number-search/pan/) kind of carousels 
  <img src="./gst-page-carousel.png" width="50%" />


> NOTE: To ensure bleed happens you need to specify a fixed amount of carousel item's width via the `carouselItemWidth` prop. Otherwise the carousel item will take up the 100% of the container width and won't bleed


v1: visibleItems: undefined + auto bleed + shouldAddStartEndPadding

<img src="./example-visibleitems-undefined-with-margin.png" width="70%" />

v1: visibleItems: undefined + auto bleed

<img src="./example-visibleitems-undefined-without-margin.png" width="70%" />

### **Variant 2: With visibleItems:**

This variant is a basic variant which can have: 

- visibleItems: 1 | 2 | 3
- The carouselItems inside doesn't have a fixed amount of width means they are fluid by default
- Cannot bleed
- Cannot have scroll overlay
- Cannot have start/end margin


v2: visibleItems: 1 

<img src="./example-visibleitems-1.png" width="70%" />

v2: visibleItems: 2 

<img src="./example-visibleitems-2.png" width="70%" />

v2: visibleItems: 3

<img src="./example-visibleitems-3.png" width="70%" />


## Accessibility

We need to follow the APG Pattern For [Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-2-tablist/)

## Motion

https://github.com/razorpay/blade/assets/35374649/6876f348-1b0a-4e9a-800a-300025f54b5c

## Open Questions

- Should we call it `navigationButtonStyle` or `navigationButtonVariant`? 
- Should we make visibleItems: 'auto' or 'undefined'?

## Libraries

**web**

On mweb & dweb we can use [CSS scroll snap](https://ishadeed.com/article/css-scroll-snap/) feature, this covers all our common usecase with bleed smooth scrolling etc.

**react-native**

on rnweb, we cannot use CSS scroll snap so might might need to opt for a library.
But further exploration lead me to this [SO question](https://stackoverflow.com/questions/39849648/horizontal-scrollview-snapping-react-native) and [this expo example](https://snack.expo.io/H1CnjIeDb), turns our that ScrollView does support scroll snapping so if this works for our usecase it will be helpful.

But we might need to see if this might cause an performance issue since we won't be using FlatList.

Further resources
- https://blog.logicwind.com/implement-carousel-using-react-native-scrollview/
- https://medium.com/nerd-for-tech/react-native-create-a-horizontal-snap-scrollview-e1d01ac3ba09
- https://github.com/meliorence/react-native-snap-carousel

## References

- https://coreui.io/react/docs/components/carousel/
- https://github.com/Learus/react-material-ui-carousel
