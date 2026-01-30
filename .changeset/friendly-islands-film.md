---
'@razorpay/blade': patch
'@razorpay/blade-mcp': patch
---

fix(blade): chart UX improvements and recharts upgrade

- Updated recharts from 3.1.2 to 3.7.0
- LineChart: Added `onMouseEnter` and `onMouseLeave` props for custom hover interactions
- BarChart: Fixed unwanted re-animation on tooltip hover
- Updated chart documentation with new props and behavior
- Update auto color logic for line chart. if you are using single data indicator, default color would be gray.moderate.