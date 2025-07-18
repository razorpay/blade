import { isIconComponent } from '.';
import { IconButton } from '~components/Button/IconButton';
import { BankIcon } from '~components/Icons';

describe('isIconComponent', () => {
  it('isIconComponent -> BankIcon', () => {
    const isIcon = isIconComponent(BankIcon);
    expect(isIcon).toEqual(true);
  });
  it('isIconComponent -> IconButton', () => {
    // @ts-expect-error Testing invalid input
    const isIcon = isIconComponent(IconButton);
    expect(isIcon).toEqual(false);
  });
});
