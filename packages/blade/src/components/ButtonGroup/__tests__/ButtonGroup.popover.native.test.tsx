import { fireEvent } from '@testing-library/react-native';
import { ButtonGroup } from '../ButtonGroup';
import { Button } from '~components/Button';
import { Popover } from '~components/Popover';
import { Text } from '~components/Typography';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

jest.useFakeTimers();

describe('ButtonGroup + Popover', () => {
  it('opens popover inside ButtonGroup on touchEnd', () => {
    const { getByRole, getByTestId, queryByTestId } = renderWithTheme(
      <ButtonGroup>
        <Popover title="Sync Data" content={<Text>Are you sure?</Text>}>
          <Button>Sync</Button>
        </Popover>
        <Button>Share</Button>
      </ButtonGroup>,
    );
    expect(queryByTestId('popover-modal-backdrop')).toBeNull();
    fireEvent(getByRole('button', { name: 'Sync' }), 'touchEnd');
    expect(getByTestId('popover-modal-backdrop')).toBeTruthy();
  });

  it('opens popover inside ButtonGroup on press', () => {
    const { getByRole, getByTestId, queryByTestId } = renderWithTheme(
      <ButtonGroup>
        <Popover title="Sync Data" content={<Text>Are you sure?</Text>}>
          <Button>Sync</Button>
        </Popover>
        <Button>Share</Button>
      </ButtonGroup>,
    );
    expect(queryByTestId('popover-modal-backdrop')).toBeNull();
    fireEvent.press(getByRole('button', { name: 'Sync' }));
    expect(getByTestId('popover-modal-backdrop')).toBeTruthy();
  });
});
