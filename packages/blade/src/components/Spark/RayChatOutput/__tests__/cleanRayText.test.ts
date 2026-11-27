import { cleanRayText } from '../cleanRayText';

describe('cleanRayText', () => {
  describe('RAY’s JSON wrapper', () => {
    it('sends the reply inside a fenced wrapper', () => {
      expect(cleanRayText('```json\n{"assistant_reply": "Hi **there**"}\n```')).toBe(
        'Hi **there**',
      );
    });

    it('sends the reply inside a bare wrapper, decoding its escapes', () => {
      expect(cleanRayText('{"assistant_reply": "Line \\"one\\"\\nTwo \\u20b9"}')).toBe(
        'Line "one"\nTwo ₹',
      );
    });

    it('sends what has arrived of a wrapper that is still streaming', () => {
      expect(cleanRayText('```json\n{"assistant_reply": "Your payout of ₹5')).toBe(
        'Your payout of ₹5',
      );
      expect(cleanRayText('{"assistant_reply": "Half an escape \\u20')).toBe('Half an escape');
    });

    it('leaves any other JSON alone', () => {
      expect(cleanRayText('{"other": 1}')).toBe('{"other": 1}');
    });
  });

  describe('literal \\n', () => {
    it('becomes a real line break in the text', () => {
      expect(cleanRayText('Line one\\nLine two')).toBe('Line one\nLine two');
    });

    it('stays as written inside inline code and code blocks', () => {
      expect(cleanRayText('Use `a\\nb` here')).toBe('Use `a\\nb` here');
      expect(cleanRayText('```\nprint("a\\nb")\n```')).toBe('```\nprint("a\\nb")\n```');
    });
  });

  describe('emoji', () => {
    it('are dropped with the space they leave', () => {
      expect(cleanRayText('Hi 👋 there ✅')).toBe('Hi there');
      expect(cleanRayText('- ✅ Paid\n- Done 🎉\n- 👍 OK')).toBe('- Paid\n- Done\n- OK');
    });

    it('are dropped as whole sequences: joined, skin tones, keycaps, flags, emoji style', () => {
      expect(cleanRayText('Team 👨‍👩‍👧 ok 👍🏽 1️⃣ 🇮🇳 ✔️ done')).toBe('Team ok done');
    });

    it('leave text symbols alone', () => {
      expect(cleanRayText('© 2026 ₹500 ™ → ✔')).toBe('© 2026 ₹500 ™ → ✔');
    });

    it('keep the indent of a nested list', () => {
      expect(cleanRayText('- one\n  - two 🎉')).toBe('- one\n  - two');
    });
  });

  describe('Markdown tables', () => {
    // Tables are drawn as cards, so the chat doesn't parse them (no remark-gfm). A table RAY
    // writes in its text becomes a ray-table block: one row per line, cells split by tabs, and the
    // columns' alignment after the block's name. RayChatOutput draws it as aligned plain text.
    it('become a ray-table block', () => {
      expect(
        cleanRayText(
          [
            'Here are your payments:',
            '',
            '| Date | Amount | Status |',
            '|---|---:|---|',
            '| 21 Sep 2026 | **₹500** | Paid ✅ |',
            '| 22 Sep | ₹1,200 | `captured` |',
            '',
            'Anything else?',
          ].join('\n'),
        ),
      ).toBe(
        [
          'Here are your payments:',
          '',
          '```ray-table l r l',
          'Date\tAmount\tStatus',
          '21 Sep 2026\t₹500\tPaid',
          '22 Sep\t₹1,200\tcaptured',
          '```',
          '',
          'Anything else?',
        ].join('\n'),
      );
    });

    it('keep IDs, links’ text and escaped pipes', () => {
      expect(
        cleanRayText('ID | Note\n--- | ---\norder_id_123 | [docs](https://x.test) a \\| b'),
      ).toBe('```ray-table l l\nID\tNote\norder_id_123\tdocs a | b\n```');
    });

    it('are a block from their first row, so a streaming table never changes block', () => {
      expect(cleanRayText('Fees:\n\n|')).toBe('Fees:\n\n```ray-table\n\n```');
      expect(cleanRayText('Fees:\n\n| Route | Fee |')).toBe(
        'Fees:\n\n```ray-table l l\nRoute\tFee\n```',
      );
      expect(cleanRayText('| Route | Fee |\n|---')).toBe('```ray-table l l\nRoute\tFee\n```');
      expect(cleanRayText('| Route | Fee |\n|---|---:|\n| Direct | ₹5')).toBe(
        '```ray-table l r\nRoute\tFee\nDirect\t₹5\n```',
      );
    });

    it('keep an escaped pipe inside a cell, also in a row that opens and closes with pipes', () => {
      expect(cleanRayText('| a \\| b | c |\n|---|---|\n| x | y \\| |')).toBe(
        '```ray-table l l\na | b\tc\nx\ty |\n```',
      );
    });

    it('parse in every browser: no regex lookbehind, which Safari before 16.4 cannot load', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
      const source: string = require('fs').readFileSync(require.resolve('../cleanRayText'), 'utf8');
      expect(source).not.toMatch(/\(\?<[!=]/);
    });

    it('leave a table inside a code block, and a heading underlined with ---, alone', () => {
      expect(cleanRayText('```\n| a | b |\n|---|---|\n```')).toBe('```\n| a | b |\n|---|---|\n```');
      expect(cleanRayText('Fees\n---\nTwo kinds.')).toBe('Fees\n---\nTwo kinds.');
    });
  });

  it('returns an empty string for an empty reply', () => {
    expect(cleanRayText('')).toBe('');
    expect(cleanRayText('  🎉  ')).toBe('');
  });
});
