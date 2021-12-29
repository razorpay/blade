# Discussion Notes <!-- omit in toc -->
- [06-08-2021](#06-08-2021)
## 06-08-2021
So we were planning to store lineheights in our tokens. We thought it's trivial task but to my surprise it isn't. Let's see what are the problems

Q. How do we store line-heights in tokens?

So we have our typography tokens stored under `tokens/global/typography.ts` with the following structure:
```typescript
const typography: Typography = {
  desktop: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        10: 9,
        25: 10,
        50: 11,
        75: 12,
        100: 13,
        200: 16,
        300: 18,
        400: 20,
        500: 22,
        600: 25,
        700: 28,
        800: 32,
        900: 36,
        1000: 40,
      },
      weight: {
        ...fontWeight,
      },
    },
    // lineHeights: {},
    // letterSpacings: {},
  },
  mobile: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        10: 10,
        25: 11,
        50: 12,
        75: 14,
        100: 15,
        200: 17,
        300: 18,
        400: 20,
        500: 22,
        600: 24,
        700: 27,
        800: 29,
        900: 32,
        1000: 35,
      },
      weight: {
        ...fontWeight,
      },
    },
    // lineHeights: {},
    // letterSpacings: {},
  },
};
```
This is a global token file being re-exported directly under theme. 

```ts
// paymentTheme.ts
import typography from './globals/typography'
const paymentTheme = {
  colors,
  border,
  spacing,
  shadows,
  typography,
}
```

So we can start storing `lineHeight` directly in global typography file. Let's see how will that look like

```typescript
const typography: Typography = {
  desktop: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        10: 9,
        25: 10,
        50: 11,
        75: 12,
        100: 13,
        200: 16,
        300: 18,
        400: 20,
        500: 22,
        600: 25,
        700: 28,
        800: 32,
        900: 36,
        1000: 40,
      },
      weight: {
        ...fontWeight,
      },
    },
    lineHeights: {
      none: 0,
      s: 12,
      m: 14,
      l: 15,
      // so on
    },
    // letterSpacings: {},
  },
  mobile: {
    fonts: {
      family: {
        ...fontFamily,
      },
      size: {
        10: 10,
        25: 11,
        50: 12,
        75: 14,
        100: 15,
        200: 17,
        300: 18,
        400: 20,
        500: 22,
        600: 24,
        700: 27,
        800: 29,
        900: 32,
        1000: 35,
      },
      weight: {
        ...fontWeight,
      },
    },
    lineHeights: {
      none: 0,
      s: 14,
      m: 16,
      l: 17,
      // so on
    },
    // letterSpacings: {},
  },
};
```
Now Imagine I want to create a text component which can work on Desktop as well as Mobile(Web and React Native)

```ts
// Text.ts
import { BladeProvider } from '@razorpay/blade/components';
import { paymentTokens, bankingTokens } from '@razorpay/blade/tokens';

overrideTokens()

<BladeProvider tokens={payment}>
  <MyApp/>
</BladeProvider>

const {colors, typography} = useTheme()

const Caption = styled.div`
  font-size: ${theme.typography.desktop.fonts.size.100};
  line-height: ${theme.typography.desktop.lineHeight.s};
`
```

Now there are couple of problem with this:
1. How do I make this work on web and mobile since I've hardcoded desktop?
2. Even if somehow I'm able to make the selection of platform(desktop/mobile) key dynamic then also it's not necessary that my `Caption` component will have same scale of font-size on desktop and mobile(keeping accessibility in mind). For eg: Imagine my value for font-size scale at 1200 is 32px and on mobile it's 40px. It'll just make my UI look bigger on mobile as it's not 1:1 mapping.
> We have different font scale for mobile and desktop. Mobile has multiplicative factor of 1.1 and Desktop follows 1.125. Read more about it [here](https://github.com/razorpay/blade/blob/master/rfcs/2021-01-05-typography-scaling.md#introduction)

To fix the above problem we need some sort of layer or logic in between which will solve this problem. Here's one approach.

Instead of just re-exporting the global typography from theme, we can create semantic object for typography(the way we do it for colors) and refer the values from global tokens. Let's see an example

```js
// paymentTheme.ts
import globalTypography from './typography'
const  paymentTheme = {
  colors,
  border,
  spacing,
  shadows,
  typography: {
    desktop: {
      font: {
        weight: {
          caption: globalTypography.desktop.fonts.weight.regular,
        },
        size: {
          caption: globalTypography.desktop.fonts.size.100,
        },
        family: {
          caption: globalTypography.desktop.fonts.family.text,
        }
      },
      lineHeight: {
        caption: globalTypography.desktop.lineHeight.small,
      },
      letterSpacing: {
        caption: globalTypography.desktop.letterSpacing.normal,
      },
    },
    mobile: {
      font: {
        weight: {
          caption: globalTypography.mobile.fonts.weight.regular,
        },
        size: {
          caption: globalTypography.mobile.fonts.size.200,
        },
        family: {
          caption: globalTypography.mobile.fonts.family.text,
        },
      },
      lineHeight: {
        caption: globalTypography.mobile.lineHeight.small,
      },
      letterSpacing: {
        caption: globalTypography.mobile.letterSpacing.normal,
      },
    },
  },
}
```

Now If I create the same `Caption` component as above, here's how it'll look like
```ts
// Text.ts
import { paymentTheme } from '@razorpay/blade/tokens';

const Caption = styled.div`
  font-size: ${paymentTheme.typography.desktop.font.size.caption};
  line-height: ${paymentTheme.typography.desktop.lineHeight.caption};
`
```

With the previous approach we had 2 problems
1. How do I make this work on web and mobile since I've hardcoded desktop?
2. Even if somehow I'm able to make the platform(desktop/mobile) key dynamic then also it's not necessary that my `Caption` component will have same scale of font-size on desktop and mobile(keeping accessibility in mind).

The second problem will be solved with our approach as we are referring to aliases from typography which internally refers to the global typography scale. So basically, on desktop `font.size.caption` can refer to `globalTypography.desktop.fonts.size.100` and on mobile the same alias `font.size.caption` can refer to `globalTypography.desktop.fonts.size.200`. Now if we switch platforms we won't face any issue in our components and it'll work as expected.

We still have a problem of platform key that is hardcoded. i.e `paymentTheme.typography.desktop.caption.fonts.size`. So this pops up following questions

Q. How can we remove this key?
Q. At what level shall we store desktop and mobile?
Q. How will Types work in TS?





- Desktop
  - dweb
- Mobile
  - mweb
  - native

Blade/Text
web
  const DisplayXLarge = styled.div`
    // 60px - global-lh-60
    line-height: getLineHeight(lineHeight.6xl)
    // 38px - global-lh-38
    @media(min-widht: 375px){
      line-height: getLineHeight(lineHeight.4xl)
    }
  `

native
  const DisplayXLarge = styled.div`
      // 38px - global-lh-38
      line-height: getLineHeight(lineHeight.4xl)
    `


// web
import DisplayXLarge from '@razorpay/blade/components'
<DisplayXLarge/>

// native
import DisplayXLarge from '@razorpay/blade/components'
<DisplayXLarge/>


Approaches:
1. define semantics of typography in theme
2. create same line-height aliases to refer across platforms


// themeprovider web
usescale

themeprovider mobile


usescale:
if platform === web
  if client is desktop
    return typo.desktop
  else
   return typo.mobile
else 
  return typo.mobile


const Caption = styled.div`
  font-size: theme.typography.caption.fonts.size
  line-height: theme.typography.caption.lineheight
  color: theme.colors.surface.text.subdued.lowContrast.onLight
`

Q: How to store lineheights?
Q: where and how to store lineheights? Global/Theme level
  - store semantically
  - what were the other approaches
Q: where to keep `desktop` and `mobile` key?
Q:



===Solution Steps===
Things to do for tokens restructure:
1. ~Write a utility to Read the existing theme file - how to do this is still pending~
changed the strategy to restructure existing theme structure. - done
2. Write the types for transformed theme files, this will be type of theme prop on provider
```jsx
import {myThemeTokens, BladeThemeProvider} from 'design-system';

<BladeThemeProvider theme={myThemeTokens}>
  <MyApp/>
</BladeThemeProvider>
```
3. Generate the transformed theme file(this will be published) - this can be done before rollup runs.
not required since we changed the structure of the actual theme file - done
```jsx
// from this 
const paymentTheme = {
  colors,
  border,
  spacing,
  shadows,
  typography,
};

// to this
const myThemeTokens = {
  colors:{
    onLight:{},
    onDark:{}
  },
  border:{},
  spacing:{},
  shadows:{},
  typography:{
    onMobile:{},
    onDesktop:{}
  }
}
```
1. Write types for consumer theme(public), this can be exposed as "theme" from useTheme which will be of this "type"
```jsx
// somewhere in the MyApp tree where I might need to use tokens
import {useTheme} from 'design-system'

const SomeComponent =  () => {
  const {theme} = useTheme()

  return (
    <div>
      <span style={{ backgroundColor: theme.colors.background.surface.level1.lowContrast }}
    </div>
  )
}
```


consumer consuming theme and passing it to provider:
```jsx
import {myTheme, BladeThemeProvider} from 'design-system';

<BladeThemeProvider theme={myTheme}>
  <MyApp/>
</BladeThemeProvider>
```

```jsx
// somewhere in the MyApp tree where I might need to use tokens
import {useTheme} from 'design-system'

const SomeComponent =  () => {
  const {theme} = useTheme()

  return (
    <div>
      <span style={{ backgroundColor: theme.colors.background.surface.level1.lowContrast }}
    </div>
  )
}
```

```jsx
// from this
theme.colors.surface.background.level1.lowContrast.onLight

// to this (the light and dark will be taken care by the themeprovider)
theme.colors.surface.background.level1.lowContrast


// from this
theme.typography.desktop.fonts.size.100

// to this (the desktop and mobile will be taken care by theme provider)
theme.typography.fonts.size.100
```
