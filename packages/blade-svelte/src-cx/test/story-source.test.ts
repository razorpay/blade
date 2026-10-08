// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { toExample } from '../stories/helpers';

const story = `<script lang="ts">
  import { Badge, type BadgeStyleProps } from '../../index';

  interface Props {
    args: BadgeStyleProps & { content?: string; withIcon?: boolean };
  }

  let { args }: Props = $props();
</script>

<Badge color={args.color} size={args.size} title={args.title || undefined} isOpen={args.isOpen} icon={args.withIcon ? CheckIcon : undefined}>
  {args.content}
</Badge>`;

describe('toExample', () => {
  it("drops the story's plumbing and fills in the controls' values", () => {
    const code = toExample(story, { color: 'positive', isOpen: true, content: 'New' });
    expect(code).not.toContain('interface Props');
    expect(code).not.toContain('$props()');
    expect(code).not.toContain('args.');
    expect(code).toContain('<Badge color="positive" isOpen={true}>');
    expect(code).toContain("import { Badge } from '@razorpay/blade-svelte';");
    expect(code).not.toMatch(/\n\s*\n<\/script>/);
    expect(toExample(story, { withIcon: true })).toContain('icon={CheckIcon}');
    expect(code).toContain('>\n  New\n</Badge>');
  });

  it('leaves a story without controls as written, but for its import paths', () => {
    const matrix = `<script lang="ts">\n  import { Badge } from '../../index';\n</script>\n\n<Badge>New</Badge>`;
    expect(toExample(matrix, {})).toBe(matrix.replace("'../../index'", "'@razorpay/blade-svelte'"));
  });
});
