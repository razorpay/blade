import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { SearchInput } from '..';

import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { DropdownHeader } from '~components/Dropdown/DropdownHeaderFooter';

describe('<SearchInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(
      <SearchInput label="Search here" placeholder="Search payment products, settings, and more" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should display help text', () => {
    const label = 'Search here';
    const { getByText, getByLabelText } = renderWithTheme(
      <SearchInput
        label={label}
        placeholder="Search payment products, settings, and more"
        helpText="Enter an item to search"
      />,
    );

    const input = getByLabelText(label);
    const helpText = getByText('Enter an item to search');

    expect(helpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Enter an item to search');
    expect(input).toBeValid();
  });

  it('should render large size', () => {
    const { container } = renderWithTheme(
      <SearchInput
        label="Search here"
        placeholder="Search payment products, settings, and more"
        helpText="Enter an item to search"
        size="large"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Search here';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<SearchInput label={label} autoFocus />);

    const input = getByLabelText(label);

    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Search here';
    const { getByLabelText } = renderWithTheme(<SearchInput label={label} isDisabled />);

    const input = getByLabelText(label);

    expect(input).toBeDisabled();
  });

  it('should show spinner when isLoading is passed', async () => {
    const user = userEvent.setup();
    const label = 'Search here';

    const { getByLabelText, queryByRole } = renderWithTheme(
      <SearchInput label={label} isLoading={true} />,
    );

    const input = getByLabelText(label);
    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    await user.tab();
    /* We are intentionally making sure that the input is not disabled and focusable since we don't want the input to be disabled while the user is still typing. 
    For instance, in an autocomplete while the user types, API call is made for each letter and loader shows up but also allows the user to continue typing.
     */
    expect(input).toHaveFocus();
    await user.type(input, 'Kamlesh');
    clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    const loadingSpinner = queryByRole('progressbar');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should handle onChange', async () => {
    const label = 'Search here';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const userName = 'Kamlesh';

    const { getByLabelText } = renderWithTheme(
      <SearchInput label={label} name="name" onChange={onChange} />,
    );

    const input = getByLabelText(label);
    await user.type(input, userName);

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(userName.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'name', value: userName });
  });

  it('should handle onFocus', async () => {
    const user = userEvent.setup();
    const label = 'Search here';
    const name = 'userName';
    const userName = 'Kamlesh';
    const onFocus = jest.fn();

    renderWithTheme(
      <SearchInput label={label} name={name} defaultValue={userName} onFocus={onFocus} />,
    );

    // focus into textarea
    await user.tab();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith({ name, value: userName });
  });

  it('should handle onClick', async () => {
    const onClick = jest.fn();
    const label = 'Search here';
    const { getByLabelText } = renderWithTheme(<SearchInput label={label} onClick={onClick} />);

    const input = getByLabelText(label);
    await userEvent.click(input);
    //should be called for onClick
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle onBlur', async () => {
    const user = userEvent.setup();
    const label = 'Search here';
    const userName = 'Kamlesh';
    const onBlur = jest.fn();

    renderWithTheme(
      <SearchInput
        label={label}
        name="name"
        defaultValue={userName}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onBlur={onBlur}
      />,
    );

    // shifts user focus and therefore blurs the focussed input
    await user.tab();

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  it('should be focusable', async () => {
    const user = userEvent.setup();
    const label = 'Search here';
    const userName = 'Kamlesh';

    const { getByLabelText } = renderWithTheme(
      <SearchInput label={label} name="name" defaultValue={userName} />,
    );

    const input = getByLabelText(label);

    expect(input).not.toHaveFocus();

    await user.tab();
    expect(input).toHaveFocus();
  });

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Search here';
    const valueInitial = 'Kamlesh';
    const valueFinal = 'Kamlesh Chandnani';

    const { getByLabelText } = renderWithTheme(
      <SearchInput label={label} defaultValue={valueInitial} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Chandnani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should set value as a controlled input', async () => {
    const user = userEvent.setup();
    const label = 'Search here';
    const valueInitial = 'Kamlesh';
    const valueFinal = 'Kamlesh Chandnani';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return <SearchInput label={label} value={value} onChange={({ value }) => setValue(value)} />;
    };

    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' ');
    await user.type(input, 'Chandnani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should throw error when both value and defaultValue are passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <SearchInput label="Enter name" defaultValue="Kamlesh" value="Kamlesh Chandnani" />,
      ),
    ).toThrow(
      `[Blade: Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
    );
    mockConsoleError.mockRestore();
  });

  it('should clear input with defaultValue on clear button click', async () => {
    const user = userEvent.setup();
    const label = 'Search here';
    const onClearButtonClick = jest.fn();

    const { getByLabelText, getByRole } = renderWithTheme(
      <SearchInput label={label} defaultValue="Kamlesh" onClearButtonClick={onClearButtonClick} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue('Kamlesh');

    const clearButton = getByRole('button');
    await user.click(clearButton);
    expect(onClearButtonClick).toHaveBeenCalledTimes(1);

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('should only show clear button when the user type in something', async () => {
    const user = userEvent.setup();
    const label = 'Search here';
    const onClearButtonClick = jest.fn();

    const { getByLabelText, getByRole, queryByRole } = renderWithTheme(
      <SearchInput label={label} onClearButtonClick={onClearButtonClick} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue('');

    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();

    await user.tab();
    expect(input).toHaveFocus();

    await user.type(input, 'Kamlesh');
    expect(input).toHaveValue('Kamlesh');

    clearButton = getByRole('button');
    await user.click(clearButton);
    expect(onClearButtonClick).toHaveBeenCalledTimes(1);

    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('should pass a11y', async () => {
    const { getByRole } = renderWithTheme(
      <SearchInput
        label="Enter name"
        placeholder="Search payment products, settings, and more"
        helpText="First name and last name"
      />,
    );

    const input = getByRole('textbox');

    expect(input).not.toBeRequired();
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    await assertAccessible(input);
  });

  it(`should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Name';

    const { getByLabelText } = renderWithTheme(
      <SearchInput label={label} placeholder="Search payment products, settings, and more" />,
    );

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'search');
    expect(input).toHaveAttribute('enterKeyHint', 'search');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it(`should expose native element methods via ref`, async () => {
    const label = 'Search here';

    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <>
          <SearchInput ref={ref} label={label} />
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            Focus
          </Button>
        </>
      );
    };
    const { getByLabelText, getByRole } = renderWithTheme(<Example />);

    const input = getByLabelText(label);
    const button = getByRole('button');

    expect(input).not.toHaveFocus();

    await userEvent.click(button);
    expect(input).toHaveFocus();
  });

  it('should hide search icon', () => {
    const { container } = renderWithTheme(
      <SearchInput label="Search here" showSearchIcon={false} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render dropdown and make it visible on click', async () => {
    const user = userEvent.setup();

    const { container, queryByRole, getByLabelText } = renderWithTheme(
      <Dropdown>
        <SearchInput
          label="Search here"
          placeholder="Search payment products, settings, and more"
        />
        <DropdownOverlay zIndex={1002}>
          <DropdownHeader title="Recent Searches" />
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const searchInput = getByLabelText('Search here');

    expect(searchInput).toBeInTheDocument();
    expect(queryByRole('dialog')).toBeNull();
    await user.click(searchInput);
    expect(container).toMatchSnapshot();
  });

  it('should not open dropdown when input is disabled', async () => {
    const user = userEvent.setup();

    const { queryByRole, getByLabelText } = renderWithTheme(
      <Dropdown>
        <SearchInput
          label="Search here"
          placeholder="Search payment products, settings, and more"
          isDisabled
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Banana" value="banana" />
            <ActionListItem title="Orange" value="orange" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const searchInput = getByLabelText('Search here');

    expect(searchInput).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();

    await user.click(searchInput);
    expect(queryByRole('listbox')).toBeNull();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <SearchInput label="Search here" testID="search-input-test-id" />,
    );

    expect(getByTestId('search-input-test-id')).toBeTruthy();
  });
  it('should accept data-analytics attribute', () => {
    const { getByLabelText, container } = renderWithTheme(
      <SearchInput label="Search here" data-analytics-name="search-input" />,
    );

    expect(container).toMatchSnapshot();
    expect(getByLabelText('Search here')).toHaveAttribute('data-analytics-name', 'search-input');
  });
});
