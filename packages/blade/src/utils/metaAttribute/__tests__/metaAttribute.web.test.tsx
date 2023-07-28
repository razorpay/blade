import { metaAttribute } from '..';
import { Button } from '~components/Button';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('metaAttribute', () => {
  it('add the correct meta attributes', () => {
    const { getByRole } = renderWithTheme(
      <Button {...metaAttribute({ name: 'Button', testID: 'button-test' })}>{'Click'}</Button>,
    );
    expect(getByRole('button')).toHaveAttribute('data-blade-component', 'button');
    expect(getByRole('button')).toHaveAttribute('data-testid', 'button-test');
  });
});
