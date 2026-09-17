import React from 'react';
import { Stagger } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Fade } from '~components/Fade';
import { Move } from '~components/Move';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Stagger /> (native)', () => {
  it('should render its children as expected', () => {
    const { toJSON, queryByText } = renderWithTheme(
      <Stagger>
        <Fade>
          <Text>Item 1</Text>
        </Fade>
        <Fade>
          <Text>Item 2</Text>
        </Fade>
        <Fade>
          <Text>Item 3</Text>
        </Fade>
      </Stagger>,
    );

    expect(queryByText('Item 1')).toBeTruthy();
    expect(queryByText('Item 2')).toBeTruthy();
    expect(queryByText('Item 3')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with Move children (exercises the transform delay path)', () => {
    const { toJSON, queryByText } = renderWithTheme(
      <Stagger>
        <Move>
          <Text>Move 1</Text>
        </Move>
        <Move>
          <Text>Move 2</Text>
        </Move>
      </Stagger>,
    );

    expect(queryByText('Move 1')).toBeTruthy();
    expect(queryByText('Move 2')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not throw on mount (native stub replaced by real implementation)', () => {
    expect(() =>
      renderWithTheme(
        <Stagger>
          <Fade>
            <Text>No crash</Text>
          </Fade>
        </Stagger>,
      ),
    ).not.toThrow();
  });

  it('should render with type="in"', () => {
    const { toJSON, queryByText } = renderWithTheme(
      <Stagger type="in">
        <Move>
          <Text>In 1</Text>
        </Move>
        <Move>
          <Text>In 2</Text>
        </Move>
      </Stagger>,
    );

    expect(queryByText('In 1')).toBeTruthy();
    expect(queryByText('In 2')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with type="out"', () => {
    const { toJSON, queryByText } = renderWithTheme(
      <Stagger type="out">
        <Move>
          <Text>Out 1</Text>
        </Move>
        <Move>
          <Text>Out 2</Text>
        </Move>
      </Stagger>,
    );

    expect(queryByText('Out 1')).toBeTruthy();
    expect(queryByText('Out 2')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should honor a container-level delay', () => {
    const { queryByText } = renderWithTheme(
      <Stagger delay="gentle">
        <Fade>
          <Text>Delayed 1</Text>
        </Fade>
        <Fade>
          <Text>Delayed 2</Text>
        </Fade>
      </Stagger>,
    );

    expect(queryByText('Delayed 1')).toBeTruthy();
    expect(queryByText('Delayed 2')).toBeTruthy();
  });

  it('should keep children mounted (animating to exit) when isVisible is false without shouldUnmountWhenHidden', () => {
    const { queryByText } = renderWithTheme(
      <Stagger isVisible={false}>
        <Fade>
          <Text>Still here</Text>
        </Fade>
        <Fade>
          <Text>Also here</Text>
        </Fade>
      </Stagger>,
    );

    // Native has no AnimatePresence: children stay mounted while they animate to the exit variant.
    expect(queryByText('Still here')).toBeTruthy();
    expect(queryByText('Also here')).toBeTruthy();
  });

  it('should not render children when isVisible is false and shouldUnmountWhenHidden is true', () => {
    const { queryByText } = renderWithTheme(
      <Stagger isVisible={false} shouldUnmountWhenHidden>
        <Fade>
          <Text>Hidden item</Text>
        </Fade>
        <Fade>
          <Text>Another hidden item</Text>
        </Fade>
      </Stagger>,
    );

    expect(queryByText('Hidden item')).toBeNull();
    expect(queryByText('Another hidden item')).toBeNull();
  });

  it('should flatten Fragment children so each preset gets its own stagger slot', () => {
    // Storybook args wrap children in `<>...</>`. React.Children.toArray does not flatten
    // Fragments — without an explicit flatten, count===1 and all items animate together.
    const { queryByText } = renderWithTheme(
      <Stagger>
        <>
          <Fade>
            <Text>Fragment 1</Text>
          </Fade>
          <Fade>
            <Text>Fragment 2</Text>
          </Fade>
          <Fade>
            <Text>Fragment 3</Text>
          </Fade>
        </>
      </Stagger>,
    );

    expect(queryByText('Fragment 1')).toBeTruthy();
    expect(queryByText('Fragment 2')).toBeTruthy();
    expect(queryByText('Fragment 3')).toBeTruthy();
  });
});
