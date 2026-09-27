---
name: blade-figma-to-code
description: Convert a Figma frame into React code built with Blade components via Razorpay's figma-to-code service. Use when the user shares a figma.com URL and wants Blade UI code for it.
allowed-tools: Bash(node *figma-to-code.mjs*) Read
---

Razorpay-internal. The backend at `blade-chat.dev.razorpay.in` needs the Razorpay network or VPN. If the script fails with a network error, fall back to the Figma MCP (`get_design_context` and `get_screenshot`) plus the `blade` skill and build the UI by hand.

## Steps

1. Extract `fileKey` and `nodeId` from the URL. In `https://www.figma.com/design/abc123XYZ/MyDesign?node-id=12-345`, `fileKey` is `abc123XYZ` and `nodeId` is `12-345`.
2. Run:

```bash
node <path-to-this-skill>/scripts/figma-to-code.mjs <fileKey> <nodeId>
```

   It prints the generated React code, the Blade components it used, and the path of a JPEG screenshot of the design.

3. Read the screenshot image file to compare against the code, then fix deviations.
4. Read `references/components/<Name>.md` from the `blade` skill for every component used before editing the code into the user's project.
