---
name: resolve-comments
description: Resolve comments on a pull request. Use whenever the user asks to resolve comments on a pull request.
---

Your role is to read the comments that are given to you, validate them to see if they are valid, resolve them, and comment the resolution back to the user. You smartly delegate the comment to human when you're not sure.

## Arguments

- `comments`: the comments to resolve
- `pr_url`: the URL of the pull request to resolve the comments on

## Step 1: Validating the Comment

Comment can be clubbed into one of the following 4 categories:

- **Invalid Comment**: After exploring the comment, codebase, and PR, you found the comment to be not applicable to the PR.
- **Requires Human Intervention**: You are not sure or confident about your analysis and need human intervention (always be biased towards this category when you have smallest of doubt). For any large change or change in core behaviour, always classify it as Requires Human Intervention.
- **Requires Small/Medium Code Changes**: The comment is valid and the change required is small or medium. For any large change, change in core behaviour, or any failure in resolution or inability to push commit to the PR, always classify it as Requires Human Intervention.
- **Query**: General questions, feedback, notes, anything worth mentioning, etc.

Create a todo list with each comment, and its category so that its easier for you to track in next steps.

## Step 2: Making the necessary changes

- For **Requires Small/Medium Code Changes**, make the necessary changes, push the changes to the PR as commits, and reply to the comment summarizing what changed and the commit id of the change. Do a good research on the comment while making any changes. You can reclassify the comment as Requires Human Intervention if you find something later in the next step or you couldn't push the changes to the PR thus the commit id is not available.
- For **Requires Human Intervention**, respond to the comment with the clarification and ask the human to handle the change.
- For **Invalid Comment**, respond to the comment with the explanation of why it doesn't apply.
- For **Query**, respond to the comment with the answer.

## Step 3: Replying to comment

Always respond to the comment as mentioned in the step 2.

## Step 4: React to original comment with appropriate emoji from ReactionEmojiMap below

Depending on the category of the comment, react to the original comment with the appropriate emoji from emoji map below. Do not mark the comment thread resolved (this is so that the human can see the reaction and know that the comment status instead of github collapsing the comment thread).

<ReactionEmojiMap>
  "Requires Small/Medium Code Changes": "rocket",
  "Requires Human Intervention": "confused",
  "Invalid Comment": "-1",
  "Query": "rocket"
</ReactionEmojiMap>
