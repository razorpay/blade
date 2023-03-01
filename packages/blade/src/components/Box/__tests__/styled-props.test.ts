import { removeUndefinedValues } from './getBaseBoxStyles.test';
import { getStyledProps } from '~components/Box/styled-props';

describe('getStyledProps', () => {
  it('should ignore props that are not styled-props', () => {
    expect(removeUndefinedValues(getStyledProps({ marginTop: 'spacing.2', padding: 'spacing.1' })))
      .toMatchInlineSnapshot(`
      Object {
        "marginTop": "spacing.2",
      }
    `);
  });

  it('should print all styled-props', () => {
    // This test is meant like an alert if we end up adding some prop unexpectedly.
    // Do update the snapshot if adding new prop was intentional
    expect(getStyledProps({})).toMatchInlineSnapshot(`
      Object {
        "alignSelf": undefined,
        "bottom": undefined,
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
        "zIndex": undefined,
      }
    `);
  });
});
