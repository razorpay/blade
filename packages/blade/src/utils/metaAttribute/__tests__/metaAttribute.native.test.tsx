import { metaAttribute } from '..';
import { Button } from '~components/Button';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('metaAttribute', () => {
  it('add the correct meta attributes', () => {
    const { getByRole } = renderWithTheme(
      <Button {...metaAttribute({ name: 'Button', testID: 'button-test' })}>{'Click'}</Button>,
    );
    expect(getByRole('button')).toHaveProp('data-blade-component', 'Button');
    expect(getByRole('button')).toHaveProp('testID', 'button-test');
  });
});
