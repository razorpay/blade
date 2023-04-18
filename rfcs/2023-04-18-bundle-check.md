---
Start Date: 18-04-2023
RFC PR: (leave this empty if no PR yet)
Blade Issue: (leave this empty if no issue yet)
---

# Bundle Size Checks <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->
- [Summary](#summary)
- [Motivation](#motivation)
- [Detailed Design](#detailed-design)
    - [Bundle Size Limit \& Master Diff](#bundle-size-limit--master-diff)
      - [Bundlewatch](#bundlewatch)
    - [Tree Shaking Check](#tree-shaking-check)
- [Drawbacks/Constraints](#drawbacksconstraints)
- [Alternatives](#alternatives)
- [Adoption strategy](#adoption-strategy)
- [How do we educate people?](#how-do-we-educate-people)
- [Open Questions](#open-questions)

# Summary
This RFC proposes the integration of bundle checker into Blade to add checks for the bundle size. This will help us to keep track of the bundle size and prevent any regressions in the future.

# Motivation
As Blade grows, the size of the generated bundles also grows. This can lead to longer load times and increased bandwidth usage for our consumers. To prevent this, we need a way to monitor the size of our generated assets and ensure that they stay within acceptable limits. We also need to ensure that any changes we make to the design system don't inadvertently increase the size of our bundles, which can impact our users' experience.

# Detailed Design
We want to achieve the following:
1. Add a check for each PR that ensures size of our bundles don't increase beyond a certain limit.
2. Enable a way for the PR author to visualize the impact of their changes on the bundle size by having a diff from master's bundle size.
3. Ensure our tree-shaking works as expected by adding a check to ensure that unused components are not included in the bundle.

### Bundle Size Limit & Master Diff
We will achieve the following with this:
1. Add a check for each PR that ensures size of our bundles don't increase beyond a certain limit.
2. Enable a way for the PR author to visualize the impact of their changes on the bundle size by having a diff from master's bundle size.

#### Bundlewatch
- We will use [bundlewatch](bundlewatch.io) to achieve this. Bundlewatch is a tool that helps us to keep an eye on our bundle size. It works by comparing the size of our bundles against a predefined limit. If the size of the bundle exceeds the limit, the build fails. It also provides a diff between the current bundle size and the size of the bundle on master. This helps us to visualize the impact of our changes on the bundle size.
- Bundlewatch allows us to pass a config like this in `package.json`:
```json
{
  "files": [
    {
      "path": "./build/components/index.web.js",
      "maxSize": "200kB"
    },
    {
      "path": "./build/tokens/index.web.js",
      "maxSize": "100kB"
    },
    {
      "path": "./build/components/index.native.js",
      "maxSize": "200kB"
    },
    {
      "path": "./build/tokens/index.native.js",
      "maxSize": "100kB"
    }
  ]
}
```
- We will need to add a github action to run bundlewatch on every PR. This can be a part of `blade-validate`(for PR) + `release`(for master push) workflow or a separate `bundle-check` workflow(that triggers on PR & master push).
- This github action will pass or fail based on the limits defined in the config.
- To get a diff of master we will need to allow Bundlewatch to add a build-status check to the PR (requires github admin approval). The status check will show the diff between the current bundle size and the size of the bundle on master. This will help us to visualize the impact of our changes on the bundle size.
- The build-status check will show the bundle size like this:
<img src="./images/bundle-size/build-status.png" width="800" />
- When you click on the `Details` link, it will take you to a page like this:
<img src="./images/bundle-size/bundle-details.png" width="800" />
- This does not post any comments on the PR to show the diff or the bundle size, we will have to write some code to extract bundle size from the Github Action, curate a custom comment and post it on the PR.

### Tree Shaking Check
We will achieve the following with this:
3. Ensure our tree-shaking works as expected by adding a check to ensure that unused components are not included in the bundle.

- We will use [size-limit](https://github.com/ai/size-limit) for this
- size-limit is a tool that helps us to keep an eye on our bundle size. It works by comparing the size of our bundles against a predefined limit. If the size of the bundle exceeds the limit, the build fails.
- size-limit creates an empty project and imports the component that we want. It then creates a bundle and checks the size of the bundle. If the size of the bundle exceeds the limit, the build fails.
- This will enable us to limit importing only a small set of components like `{ Button, Text }` and check the bundle size to ensure that tree-shaking is working as intended and the overall bundle size is limited to the imported components.
- size-limit configuration looks like this:
```json
  "size-limit": [
    {
      "path": "./build/components/index.web.js",
      "import": "{ Button, Text }",
      "limit": "100 kB"
    }
  ]
```
- We are not using size-limit to do a total bundle size check or master diff because it doesn't support it as well as bundlewatch does. Bundlewatch has an infra set up that stores master bundle size and diffs it on every PR. We can't do that with size-limit.

# Drawbacks/Constraints
- Bundlewatch is a free service but it also seems unmaintained since Jan 2022.
- If Bundlewatch service goes down, we will not be able to get any master diffs but we will still be able to get the total bundle size limit check.
- Bundlewatch service is also open source: https://github.com/bundlewatch/service
- We could spin up our own service to store master bundle size and diff it on every PR but that would be a lot of work and we would have to maintain it.
- Alternate to using bundlewatch is setting up our own infra to store master bundle size and diff it on every PR. This would also be a lot of work and we would have to maintain it.
- I'd suggest taking the shorter route and using bundlewatch for now. If we see that bundlewatch is not reliable, we can switch to our own infra.
- [size-limit](https://github.com/ai/size-limit) is an open source project and is actively maintained.
- size-limit does not support master diffing. Ref: https://github.com/ai/size-limit/issues/318
- While setting up size-limit, I encountered certain cases where size-limit was not respecting the config (especially to disable load time checks, disabling gzip and compareWith configs). It works for the use-case we want it to work for. Since it's actively maintained, it could be fixed in the future.

# Alternatives
- Explored other design systems and how they do it.
  - Most design systems have their own infra for diffing bundle size with master
  - Some of the design systems were limited to only checking bundle size limit and not doing any diff
- Explored internal razorpay projects.
  - All the projects are only doing bundle size limits and none of them are doing master diffing.

# Adoption strategy
- NA
  
# How do we educate people?
- NA

# Open Questions
- Do we skip setting up our own infra for master diffing and use bundlewatch for now?
- Are there any other alternatives that would help us solve the 3 problem statements mentioned in this RFC better than the proposed solution?

