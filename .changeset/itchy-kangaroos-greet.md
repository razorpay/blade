---
'@razorpay/blade': minor
'@razorpay/blade-mcp': minor
---

feat(blade): charts new ui & color token update


  ### Deprecation of `chart.background` prefix in color token

  The `chart.background` prefix in color token has been deprecated to improve clarity and provide a more descriptive API. The new prefix is `data.background`.

  **Impact**

  Implementation that explicitly sets `chart.background` prefix in color token will use `data.background` as prefix. 
  
  **How to Upgrade**

  You need to update your code where `chart.background` prefix in color token is used. You can either remove the prefix entirely to use default color themes or change the value to `data.background`.

  ```diff
  - color="chart.background.categorical.blue.moderate"
  + color="data.background.categorical.blue.moderate"


  ### Updation of color mapping tokens for charts

  We have update color mapping of few token related to charts. you might need to update your snaps.
