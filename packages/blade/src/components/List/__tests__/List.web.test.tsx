import { List } from '../List';
import { ListItem } from '../ListItem';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { ArrowRightIcon, ArrowUpIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

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
});
