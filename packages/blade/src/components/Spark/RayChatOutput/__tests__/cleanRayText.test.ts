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
      expect(cleanRayText('{"assistant_reply": "Half an escape \\u20')).toBe(
        'Half an escape',
      );
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

  it('returns an empty string for an empty reply', () => {
    expect(cleanRayText('')).toBe('');
    expect(cleanRayText('  🎉  ')).toBe('');
  });
});
