import { makeStyledProps, getStyledProps } from '~components/Box/styledProps';

describe('getStyledProps', () => {
  it('should ignore props that are not styledProps', () => {
    expect(getStyledProps({ marginTop: 'spacing.2', padding: 'spacing.1' })).toMatchInlineSnapshot(`
      {
        "marginTop": "spacing.2",
      }
    `);
  });

  it('should print all styledProps', () => {
    // This test is meant like an alert if we end up adding some prop unexpectedly.
    // Do update the snapshot if adding new prop was intentional
    expect(makeStyledProps({})).toMatchInlineSnapshot(`
      {
        "alignSelf": undefined,
        "bottom": undefined,
        "display": undefined,
        "gridArea": undefined,
        "gridColumn": undefined,
        "gridColumnEnd": undefined,
        "gridColumnStart": undefined,
        "gridRow": undefined,
        "gridRowEnd": undefined,
        "gridRowStart": undefined,
        "justifySelf": undefined,
        "left": undefined,
        "margin": undefined,
        "marginBottom": undefined,
        "marginLeft": undefined,
        "marginRight": undefined,
        "marginTop": undefined,
        "marginX": undefined,
        "marginY": undefined,
        "order": undefined,
        "placeSelf": undefined,
        "position": undefined,
        "right": undefined,
        "top": undefined,
        "visibility": undefined,
        "zIndex": undefined,
      }
    `);
  });
});
