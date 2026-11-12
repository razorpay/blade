export type FontFamily = {
  /** Used for all type of textual content except code snippets, and headings */
  text: string;
  /** Used for code snippets  */
  code: string;
  /** Used for headings */
  heading: string;
  /**
   * Serif font (PT Serif, regular weight only).
   *
   * **Reserved for `<Heading size="2xlarge" isSerif />`** on the agentic dashboard.
   * Do not use it anywhere else. Web only for now: on React Native it maps to the heading font.
   */
  serif: string;
};
