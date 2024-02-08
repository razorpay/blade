---
'@razorpay/blade': minor
---

**feat: Added internationalization in Amount component via i18nify.
References**

- **i18nify-js:** https://www.npmjs.com/package/@razorpay/i18nify-js
- **i18nify-react:** https://www.npmjs.com/package/@razorpay/i18nify-react

**What changes ?**

1. The `<Amount />` component will now automatically format numbers based on the user's browser locale. For example, `<Amount value={123456.789} currency="INR">` will render `₹1,23,456.79` for browsers with the `en-IN` default locale, whereas it will render `₹123,456.79` for browsers with the `en-US` locale.

2. If you want to enable users to change the locale of your page, add the `@razorpay/i18nify-react` package and wrap your app inside the `I18nProvider`. Utilize the `setI18nState` utility to modify the locale. For more details, please refer to the [documentation](https://www.npmjs.com/package/@razorpay/i18nify-react).

3. Additionally, if you prefer to maintain a fixed locale for your page and amount component, enclose your app within `<I18nProvider data={{locale: 'locale-you-want'}}>..`. For more details, please refer to the [documentation](https://www.npmjs.com/package/@razorpay/i18nify-react).

**How to update ?**

1. Install i18nify peer dependency `yarn add @razorpay/i18nify-js`
2. _[Optional]_: Install i18nify-react peer dependency to manage state effectively `yarn add @razorpay/i18nify-react`
3. Install latest Blade `yarn add @razorpay/blade@latest`
