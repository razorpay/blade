import { List } from '../List';
import { ListItem } from '../ListItem';
import { ListItemLink } from '../ListItemLink';
import { ListItemCode } from '../ListItemCode';
import { ListItemText } from '../ListItemText';
import assertAccessible from '~utils/testing/assertAccessible.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { ArrowRightIcon, ArrowUpIcon } from '~components/Icons';
import { Heading } from '~components/Typography';

describe('<List />', () => {
  it('should render List with default properties', () => {
    const { container, queryAllByRole, getByText } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
    expect(queryAllByRole('list')).toHaveLength(3);
    expect(queryAllByRole('listitem')).toHaveLength(3);
    expect(getByText('Level 1')).toBeInTheDocument();
    expect(getByText('Level 2')).toBeInTheDocument();
    expect(getByText('Level 3')).toBeInTheDocument();
  });

  it('should render List with inline ListItemLink', () => {
    const linkText = 'Google';
    const { getByRole, getByText } = renderWithTheme(
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
    expect(getByText(linkText)).toBeInTheDocument();
    expect(getByRole('link')).toHaveAttribute('href', 'https://www.google.com/');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('should render List with inline ListItemText', () => {
    const { container } = renderWithTheme(
      <List>
        <ListItem>
          <ListItemText weight="semibold" color="interactive.text.primary.normal">
            Level 1
          </ListItemText>
        </ListItem>
      </List>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render List with inline ListItemCode', () => {
    const codeText = 'Google';
    const { container } = renderWithTheme(
      <List>
        <ListItem>
          Level 1 <ListItemCode>{codeText}</ListItemCode>
        </ListItem>
        <ListItem>Level 2</ListItem>
      </List>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render unordered List of small size', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render small unordered List with icon', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render medium unordered List with icon', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render large unordered List with icon', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render small ordered List', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render medium ordered List', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render large ordered List', () => {
    const { container } = renderWithTheme(
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
    expect(container).toMatchSnapshot();
  });

  it('should render small ordered-filled List', () => {
    const { container } = renderWithTheme(
      <List variant="ordered-filled" size="small">
        <ListItem>Level 1</ListItem>
        <ListItem>Level 2</ListItem>
        <ListItem>Level 3</ListItem>
      </List>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render medium ordered-filled List', () => {
    const { container } = renderWithTheme(
      <List variant="ordered-filled" size="medium">
        <ListItem>Level 1</ListItem>
        <ListItem>Level 2</ListItem>
        <ListItem>Level 3</ListItem>
      </List>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render large ordered-filled List', () => {
    const { container } = renderWithTheme(
      <List variant="ordered-filled" size="large">
        <ListItem>Level 1</ListItem>
        <ListItem>Level 2</ListItem>
        <ListItem>Level 3</ListItem>
      </List>,
    );
    expect(container).toMatchSnapshot();
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

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
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
    await assertAccessible(container);
  });

  it('should render List with default properties', () => {
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
