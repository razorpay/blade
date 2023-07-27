# Carousel 

Carousel is a UI component that allows the display and navigation of a set of content items, typically images or cards, within a limited space. It is often used to showcase multiple pieces of content in a visually appealing and interactive way.

<img src="./carousel-thumbnail.png" width="380" />

## Design

[Figma Link](https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=2115-975416&mode=design&t=gjEux4FLvrLihxbH-0) to all variants of the Carousel component

## API

### Carousel

| Prop                     | Type                                   | Default                                  | Description                                                                                                                     | Required |
| ------------------------ | -------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| autoPlay                 | `boolean`                              | `false`                                  | If true, the carousel will autoplay                                                                                             |          |
| visibleItems             | `1,2,3,auto`                           | `1`                                      | Total number of carousel items to show at once, if set to `auto` the carousel items will take up space responsively             |          |
| bleed                    | `none,right,left,both`                 | `none`                                   | Sets the carousel items to bleed on either side button                                                                          |          |
| showIndicators           | `boolean`                              | `true`                                   | Toggles the visibility of indicators                                                                                            |          |
| showOverlay              | `boolean`                              | `false`                                  | Toggles the visibility of overlay                                                                                               |          |
| overlayColor             | `BrandColorTokens, SurfaceColorTokens` | `surface.background.level1.highContrast` | Changes the color of the overlay, so that consumers can blend the overlay with the background color                             |          |
| navigationButtonPosition | `bottom,side`                          | `bottom`                                 | Sets the position of navigation button                                                                                          |          |
| navigationButtonSpacing  | `SpacingTokens`                        | `spacing.4`                              | Spacing between navigation button and slides when bleed is set to none                                                          |          |
| navigationButtonStyle    | `filled,stroke`                        | `filled`                                 | Styles to be used depending on the emphasis you want to give to the navigation buttons                                          |          |
| indicatorVariant         | `gray,white,blue`                      | `gray`                                   | Variants to be used depending on the background and the emphasis you want to give to the indicator.                             |          |
| onChange                 | `(slideIndex: number) => void`         | `undefined`                              | Callback which gets fired everytime a slide changes, useful for analytic events (only runs on user interaction not on autoPlay) |          |
| children                 | `CarouselItem`                         | `undefined`                              | Carousel slides                                                                                                                 | ✅        |

### CarouselItem

- Supports Box properties

## Usage Example

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
  navigationButtonPosition="side"
  bleed="right"
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

## Accessibility

We need to follow the APG Pattern For [Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-2-tablist/)

## Motion

https://github.com/razorpay/blade/assets/35374649/6876f348-1b0a-4e9a-800a-300025f54b5c

## Open Questions

- Should we call it `navigationButtonStyle` or `navigationButtonVariant`? 

## Libraries

- On mobile device we need to have swipable UX, we can either use [react-swipeable (2kb)](https://github.com/FormidableLabs/react-swipeable) or use [CSS scroll snap](https://ishadeed.com/article/css-scroll-snap/) feature.

- https://github.com/akiran/react-slick

## References

- https://coreui.io/react/docs/components/carousel/
- https://github.com/Learus/react-material-ui-carousel
