<script lang="ts">
  // Type-level checks for CardGroup's prop shapes; svelte-check runs them
  // (`@ts-expect-error` is honoured in script, not in markup).
  import type { ComponentProps, Snippet } from 'svelte';
  import CardGroup from '../../components/card-group/CardGroup.svelte';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';

  type Group = ComponentProps<typeof CardGroup<string>>;
  type Item = ComponentProps<typeof CardGroupItem<string>>;
  const rows = null as unknown as Snippet;
  const content = null as unknown as Snippet;

  // Rows that act and hold nothing are gone: a pick that submits is onPick.
  // @ts-expect-error no selectionType="none"
  const actionGroup: Group = { selectionType: 'none', children: rows };
  // @ts-expect-error CardGroup has no search
  const searched: Group = { query: 'x', children: rows };
  const multiple: Group = { selectionType: 'multiple', children: rows };
  // @ts-expect-error the look is style props: no class map (that is the base's)
  const classed: Group = { classes: {}, children: rows };

  // @ts-expect-error a link has no content
  const linkContent: Item = { href: '/x', title: 'X', content };
  // @ts-expect-error a choice's content follows the pick: no toggle to report
  const choiceToggle: Item = { value: 'x', content, onExpandChange: () => {} };
  const choiceContent: Item = { value: 'x', title: 'X', content, isExpanded: true };
  const disclosure: Item = { title: 'X', content, isExpanded: false, onExpandChange: () => {} };
  void [actionGroup, searched, multiple, classed, linkContent, choiceToggle, choiceContent, disclosure];
</script>
