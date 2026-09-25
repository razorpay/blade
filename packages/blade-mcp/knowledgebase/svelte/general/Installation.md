# Installation

## Step 1: Install Package

Install the Blade Svelte package:

```bash
yarn add @razorpay/blade-svelte
```

`@razorpay/blade-core` (design tokens, CSS, fonts) is installed automatically as a dependency.

## Step 2: Import Theme CSS

Add to your entry file or root layout:

```typescript
import '@razorpay/blade-core/tokens/theme.css';
```

## Step 3: Import Fonts

Add Blade fonts:

```typescript
import '@razorpay/blade-core/fonts.css';
```

## Step 4: Use Components

Import and use Blade Svelte components:

```typescript
import { Button, Text, Heading } from '@razorpay/blade-svelte/components';
```
