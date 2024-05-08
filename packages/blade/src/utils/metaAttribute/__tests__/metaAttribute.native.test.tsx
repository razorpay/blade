import { metaAttribute } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import BaseBox from '~components/Box/BaseBox';

describe('metaAttribute', () => {
  it('add the correct meta attributes', () => {
    const { getByTestId } = renderWithTheme(
      <BaseBox {...metaAttribute({ name: 'new-box', testID: 'box-test' })} />,
    );
    expect(getByTestId('box-test')).toHaveProp('data-blade-component', 'new-box');
  });
});
