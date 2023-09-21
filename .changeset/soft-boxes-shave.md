---
"@razorpay/blade": minor
---

feat: support customizing Blade Theme with a single brand color

You can find a detailed documentation [here](https://blade.razorpay.com/?path=/docs/guides-themeing-createtheme--page)
### Example Usage
    
    ```tsx
    const customTheme = createTheme({ brandColor: '#19BEA2' })

    <BladeProvider themeTokens={customTheme} colorScheme={colorScheme}>
     {App}
    </BladeProvider>
    ```