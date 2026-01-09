## Arguments

prompt: {prompt of the task}

## Steps

- Create agentic flow for the task so that we can execute the task in subagents flow (STRICTLY USE THE `run-agent` rule. Do not read the flow-scaffolder-agent.md file yourself. Do not update the prompt. Send prompt as is.)
  ```
  @run-agent ~/.local/share/agentic-tools/agents/flow-scaffolder-agent.md "# Prompt \n\n - {prompt}"
  ```
- Print the mermaid diagram returned by previously run agent
- Read newly created orchestrator and start running the task
