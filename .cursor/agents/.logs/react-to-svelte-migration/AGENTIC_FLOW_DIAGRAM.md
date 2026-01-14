# React to Svelte Migration - Agentic Flow Architecture

This diagram shows the complete agentic flow for migrating React components to Svelte in the Blade Design System.

```mermaid
graph TB
    Start([User: Provide Component Name]) --> Orchestrator[Orchestrator Agent]
    
    Orchestrator --> Phase0[Phase 0: Discovery]
    
    subgraph Phase0["🔍 Phase 0: Discovery Phase"]
        style Phase0 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
        A1[React Component Discovery Agent]
        A1 --> A1Out[Output: REACT_COMPONENT_DISCOVERY.md]
    end
    
    Phase0 --> Phase1[Phase 1: Planning]
    
    subgraph Phase1["📋 Phase 1: Planning Phase"]
        style Phase1 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
        B1[Svelte Migration Planner Agent]
        B1 --> B1Out[Output: MIGRATION_PLAN.md]
        B1Out --> B2[Migration Plan Reviewer Agent]
        B2 --> B2Out[Output: Updated MIGRATION_PLAN.md<br/>with Review]
    end
    
    Phase1 --> Phase2[Phase 2: Execution]
    
    subgraph Phase2["⚙️ Phase 2: Execution Phase"]
        style Phase2 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
        C1[Svelte Component Executor Agent]
        C1 --> C1Out[Output: MIGRATION_CHANGELOG.md]
        
        C1 -.-> Files1[Creates: Svelte Component Files]
        C1 -.-> Files2[Creates: CSS Modules in blade-core]
        C1 -.-> Files3[Creates/Updates: Utilities in blade-core]
    end
    
    Phase2 --> Phase3[Phase 3: Testing]
    
    subgraph Phase3["🧪 Phase 3: Test & Validation Phase"]
        style Phase3 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
        D1[Svelte Story Creator Agent]
        D1 --> D1Out[Output: STORY_CREATION_LOG.md]
        D1 -.-> Story[Creates: Storybook Stories]
        D1Out --> D2[Svelte Migration Validator Agent]
        D2 --> D2Out[Output: VALIDATION_REPORT.md]
    end
    
    Phase3 --> Decision{Validation<br/>Passed?}
    
    Decision -->|✅ Yes| Success([Migration Complete])
    Decision -->|❌ No| Review[Review Issues]
    Review --> Phase2
    
    style Start fill:#fce4ec,stroke:#c2185b,stroke-width:3px
    style Orchestrator fill:#fff9c4,stroke:#f57f17,stroke-width:3px,color:#000
    style Success fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
    style Decision fill:#ffccbc,stroke:#d84315,stroke-width:2px
    style Review fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    
    style A1 fill:#bbdefb,stroke:#1565c0,color:#000
    style A1Out fill:#e3f2fd,stroke:#0d47a1,color:#000
    
    style B1 fill:#e1bee7,stroke:#6a1b9a,color:#000
    style B1Out fill:#f3e5f5,stroke:#4a148c,color:#000
    style B2 fill:#e1bee7,stroke:#6a1b9a,color:#000
    style B2Out fill:#f3e5f5,stroke:#4a148c,color:#000
    
    style C1 fill:#c8e6c9,stroke:#2e7d32,color:#000
    style C1Out fill:#e8f5e9,stroke:#1b5e20,color:#000
    style Files1 fill:#dcedc8,stroke:#558b2f,color:#000
    style Files2 fill:#dcedc8,stroke:#558b2f,color:#000
    style Files3 fill:#dcedc8,stroke:#558b2f,color:#000
    
    style D1 fill:#ffe0b2,stroke:#e65100,color:#000
    style D1Out fill:#fff3e0,stroke:#bf360c,color:#000
    style Story fill:#ffccbc,stroke:#d84315,color:#000
    style D2 fill:#ffe0b2,stroke:#e65100,color:#000
    style D2Out fill:#fff3e0,stroke:#bf360c,color:#000
```

## Flow Overview

### Phase 0: Discovery 🔍
**Purpose**: Understand the React component structure before migration

1. **React Component Discovery Agent**
   - Analyzes React component in `packages/blade/src/components`
   - Extracts props, dependencies, styling approach
   - Identifies compound components and special features
   - **Output**: `REACT_COMPONENT_DISCOVERY.md`

### Phase 1: Planning 📋
**Purpose**: Create and review a detailed migration plan

2. **Svelte Migration Planner Agent**
   - Creates migration plan based on discovery
   - Maps React props to Svelte props
   - Plans CSS module and CVA structure
   - Identifies utilities needed in blade-core
   - **Output**: `MIGRATION_PLAN.md`

3. **Migration Plan Reviewer Agent**
   - Reviews plan for guideline compliance
   - Validates directory structure, CSS approach, CVA usage
   - Ensures no inline styles planned
   - Checks prop consistency
   - **Output**: Updated `MIGRATION_PLAN.md` with review

### Phase 2: Execution ⚙️
**Purpose**: Implement the Svelte component

4. **Svelte Component Executor Agent**
   - Creates Svelte component files in `packages/blade-svelte/src/components`
   - Creates CSS modules in `packages/blade-core/src/styles`
   - Adds/updates utilities in `packages/blade-core/src/utils`
   - Implements component following guidelines
   - Uses CVA for conditional styling
   - **Output**: `MIGRATION_CHANGELOG.md`

### Phase 3: Testing & Validation 🧪
**Purpose**: Create stories and validate the migration

5. **Svelte Story Creator Agent**
   - Creates comprehensive Storybook stories
   - Tests all props and variants
   - Includes accessibility scenarios
   - **Output**: `STORY_CREATION_LOG.md` + Story files

6. **Svelte Migration Validator Agent**
   - Compares React and Svelte implementations
   - Validates props completeness
   - Checks guidelines compliance
   - Verifies CSS modules, CVA, and utilities
   - Generates quality score
   - **Output**: `VALIDATION_REPORT.md`

### Iteration Loop
If validation fails, issues are reviewed and execution phase is repeated until validation passes.

## Key Guidelines Enforced

- ✅ Props consistency between React and Svelte
- ✅ CSS classes only (no inline styles)
- ✅ CVA for conditional styling
- ✅ Utilities in blade-core (platform-agnostic)
- ✅ Prop-based event handlers
- ✅ PascalCase naming conventions
- ✅ Compound components structure
- ✅ TypeScript strict checks

## File Outputs

All log files are created in:
```
.cursor/agents/.logs/{component_name}/
├── REACT_COMPONENT_DISCOVERY.md
├── MIGRATION_PLAN.md
├── MIGRATION_CHANGELOG.md
├── STORY_CREATION_LOG.md
└── VALIDATION_REPORT.md
```

## Usage

To start the migration flow:

```bash
/react-to-svelte-migration-orchestrator component_name: "ComponentName"
```

Example:
```bash
/react-to-svelte-migration-orchestrator component_name: "Badge"
```


