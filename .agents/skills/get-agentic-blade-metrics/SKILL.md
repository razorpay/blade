---
name: get-agentic-blade-metrics
description: Get agentic metrics for the `razorpay/blade` repo and push them to `agentic-blade-metrics` page on wiki.
disable-model-invocation: true
---

Run `fetch-metrics.py` (located in the same directory as this skill) to collect all metrics:

```bash
node <skill-dir>/scripts/fetch-metrics.mjs [days]
```

The script outputs the full markdown report. Then:
- Push the report to the `agentic-blade-metrics` page on the blade wiki (clone `https://github.com/razorpay/blade.wiki.git`, write the file, commit, and push)
- Respond with the metrics in the output format below

<OutputFormat>
- Timespan: {Timespan of the metrics}

=== PRs Metric ===

| Metric                     | Value                                                             | Description of Metric                                                    |
| -------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Total Number of PRs        | {Total PRs in timespan}                                           | Total number of PRs opened in the given timespan                         |
| PRs raised (by agent)      | {PRs raised by agent}                                             | PRs raised by `rzp-slash` or `rzp-slash-public` user / app               |
| PRs raised (by human)      | {PRs raised by human}                                             | Total PRs minus PRs raised by agent                                      |
| % of PRs raised (by human) | {PRs raised by human / Total PRs}                                 | Percentage of PRs opened by human contributors                           |
| % of PRs raised (by agent) | {PRs raised by agent / Total PRs}                                 | Percentage of PRs opened by agent                                        |
| Total PRs auto-approved    | {Percentage of PRs with `rcore:eligible-for-auto-approval` label} | Percentage of PRs that have the `rcore:eligible-for-auto-approval` label |

=== Review Metric ===

Note: exclude all comments by `changeset-bot`, `github-actions`, `codesandbox-ci` bots in all the metrics below as they are not applicable

| Metric                                      | Value                                         | Description of Metric                                                         |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| Total comments on PRs                       | {Total comments on all PRs in timespan}       | Total number of review comments across all PRs in the timespan                |
| Comments on PRs (by agent)                  | {Comments by agent}                           | Comments by `rzp-slash`, `rzp-slash-public`, or `rzp-slash-reviewer` user/app |
| Comments on PRs (by human)                  | {Total comments minus comments by agent}      | Total comments minus comments made by agent                                   |
| % of comments on PRs (by human)             | {Comments by human / Total comments}          | Percentage of review comments made by human contributors                      |
| % of comments on PRs (by agent)             | {Comments by agent / Total comments}          | Percentage of review comments made by agent                                   |
| % of comments marked as resolved (by agent) | {Comments with "resolved by agent" mentioned} | Percentage of comments where "resolved by agent" is mentioned in the comment  |

=== Summary ===

<!-- Core metric summarisation -->

| Metric                                                | Value                                                             | Description of Metric                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Metric 1: % PRs with auto-approval label              | {Percentage of PRs with `rcore:eligible-for-auto-approval` label} | Percentage of PRs that received the `rcore:eligible-for-auto-approval` label |
| Submetric 1: % of comments on PRs (by human)          | {Comments by human / Total comments}                              | Percentage of review comments made by human contributors                     |
| Submetric 2: % comments marked as resolved (by agent) | {Comments with "resolved by agent" mentioned}                     | Percentage of comments that were resolved by agent                           |

</OutputFormat>
