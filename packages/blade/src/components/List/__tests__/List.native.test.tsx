import { List } from '../List';
import { ListItem } from '../ListItem';
import { ListItemLink } from '../ListItemLink';
import { ListItemCode } from '../ListItemCode';
import { ListItemText } from '../ListItemText';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { ArrowRightIcon, ArrowUpIcon } from '~components/Icons';
import { Heading } from '~components/Typography';

describe('<List />', () => {
  it('should render List with default properties', () => {
    const { toJSON, queryAllByRole, getByText } = renderWithTheme(
      <List>
        <ListItem>
          Level 1
          <List>
            <ListItem>
              Level 2
              <List>
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(queryAllByRole('list')).toHaveLength(3);
    expect(getByText('Level 1')).toBeTruthy();
    expect(getByText('Level 2')).toBeTruthy();
    expect(getByText('Level 3')).toBeTruthy();
  });

  it('should render List with inline ListItemLink', () => {
    const linkText = 'Google';
    const { toJSON, getByText } = renderWithTheme(
      <List>
        <ListItem>
          Level 1
          <ListItemLink href="https://www.google.com/" target="_blank" rel="noreferrer noopener">
            {linkText}
          </ListItemLink>
        </ListItem>
        <ListItem>Level 2</ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText(linkText)).toBeTruthy();
  });

  it('should render List with inline ListItemText', () => {
    const { toJSON } = renderWithTheme(
      <List>
        <ListItem>
          <ListItemText weight="semibold" color="interactive.text.primary.normal">
            Level 1
          </ListItemText>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render List with inline ListItemCode', () => {
    const codeText = 'Google';
    const { toJSON } = renderWithTheme(
      <List>
        <ListItem>
          Level 1 <ListItemCode>{codeText}</ListItemCode>
        </ListItem>
        <ListItem>Level 2</ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render unordered List of small size', () => {
    const { toJSON } = renderWithTheme(
      <List variant="unordered" size="small">
        <ListItem>
          Level 1
          <List>
            <ListItem>
              Level 2
              <List>
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small unordered List with icon', () => {
    const { toJSON } = renderWithTheme(
      <List variant="unordered" size="small" icon={ArrowRightIcon}>
        <ListItem>
          Level 1
          <List>
            <ListItem icon={ArrowUpIcon} iconColor="feedback.icon.positive.intense">
              Level 2
              <List>
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium unordered List with icon', () => {
    const { toJSON } = renderWithTheme(
      <List variant="unordered" size="medium" icon={ArrowRightIcon}>
        <ListItem>
          Level 1
          <List>
            <ListItem icon={ArrowUpIcon}>
              Level 2
              <List>
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large unordered List with icon', () => {
    const { toJSON } = renderWithTheme(
      <List variant="unordered" size="large" icon={ArrowRightIcon}>
        <ListItem>
          Level 1
          <List>
            <ListItem icon={ArrowUpIcon}>
              Level 2
              <List>
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small ordered List', () => {
    const { toJSON } = renderWithTheme(
      <List variant="ordered" size="small">
        <ListItem>
          Level 1
          <List>
            <ListItem>
              Level 2
              <List>
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium ordered List', () => {
    const { toJSON } = renderWithTheme(
      <List variant="ordered" size="medium">
        <ListItem>
          Level 1
          <List>
            <ListItem>
              Level 2
              <List>
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large ordered List', () => {
    const { toJSON } = renderWithTheme(
      <List variant="ordered" size="large">
        <ListItem>
          Level 1
          <List>
            <ListItem>
              Level 2
              <List>
                <ListItem>Level 3</ListItem>
              </List>
            </ListItem>
          </List>
        </ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small ordered-filled List', () => {
    const { toJSON } = renderWithTheme(
      <List variant="ordered-filled" size="small">
        <ListItem>Level 1</ListItem>
        <ListItem>Level 2</ListItem>
        <ListItem>Level 3</ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium ordered-filled List', () => {
    const { toJSON } = renderWithTheme(
      <List variant="ordered-filled" size="medium">
        <ListItem>Level 1</ListItem>
        <ListItem>Level 2</ListItem>
        <ListItem>Level 3</ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large ordered-filled List', () => {
    const { toJSON } = renderWithTheme(
      <List variant="ordered-filled" size="large">
        <ListItem>Level 1</ListItem>
        <ListItem>Level 2</ListItem>
        <ListItem>Level 3</ListItem>
      </List>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw error on nesting more than 3 levels', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <List>
          <ListItem>
            Level 1
            <List>
              <ListItem>
                Level 2
                <List>
                  <ListItem>
                    Level 3
                    <List>
                      <ListItem>Level 4</ListItem>
                    </List>
                  </ListItem>
                </List>
              </ListItem>
            </List>
          </ListItem>
        </List>,
      ),
    ).toThrow('[Blade: List]: List Nesting is allowed only upto 3 levels.');
    mockConsoleError.mockRestore();
  });

  it('should throw error on using a non-valid component in ListItem', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <List>
          <ListItem>
            Level 1<Heading>Incorrect component</Heading>
          </ListItem>
        </List>,
      ),
    ).toThrow(
      '[Blade: ListItem]: You can only pass a List, ListItemLink, ListItemCode, ListItemText or a string as a child to ListItem.',
    );
    mockConsoleError.mockRestore();
  });

  it('should throw error on using a non-valid component in List', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <List>
          <Heading>Incorrect component</Heading>
        </List>,
      ),
    ).toThrow('[Blade: List]: You can only pass a ListItem as a child to List.');
    mockConsoleError.mockRestore();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <List testID="list-test">
        <ListItem testID="list-item-test">
          Level 1<ListItemLink testID="list-item-link-test">Link</ListItemLink>
          <ListItemCode testID="list-item-code-test">Code</ListItemCode>
        </ListItem>
      </List>,
    );
    expect(getByTestId('list-test')).toBeTruthy();
    expect(getByTestId('list-item-test')).toBeTruthy();
    expect(getByTestId('list-item-link-test')).toBeTruthy();
    expect(getByTestId('list-item-code-test')).toBeTruthy();
  });
});
