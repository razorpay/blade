# Blade Assist

VS Code extension that surfaces Razorpay's Blade design system token values.

- Helps with color tokens 
   <img src="https://raw.githubusercontent.com/tewarig/images_hosting/refs/heads/main/squentialHoverTokens.png" height="500px" width="100%" />

- Helps with spacing tokens 
  <img src="https://raw.githubusercontent.com/tewarig/images_hosting/refs/heads/main/spacingColorTokens.png" height="500px" width="100%" />


## Development

1. Install dependencies
   ```bash
   yarn install
   ```
2. Compile the extension
   ```bash
   yarn compile
   ```
3. Press `F5` in VS Code to launch the extension in a new Extension Development Host.
   The hover information will appear for recognized tokens.

Run `yarn watch` to recompile on changes.


## Releasing

1. Update the version in `package.json`
2. Run `yarn compile`
3. Run `vsce package`
4. Run `vsce publish`


## License

MIT License

Copyright (c) 2025 Razorpay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: