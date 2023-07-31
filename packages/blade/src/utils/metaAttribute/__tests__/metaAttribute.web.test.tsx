import { metaAttribute } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import BaseBox from '~components/Box/BaseBox';

describe('metaAttribute', () => {
  it('add the correct meta attributes', () => {
    const { getByText } = renderWithTheme(
      <BaseBox {...metaAttribute({ name: 'new-box', testID: 'box-test' })}>{'Click'}</BaseBox>,
    );
    expect(getByText('Click')).toHaveAttribute('data-blade-component', 'new-box');
    expect(getByText('Click')).toHaveAttribute('data-testid', 'box-test');
  });
});
