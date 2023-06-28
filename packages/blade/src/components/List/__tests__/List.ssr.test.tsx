import { List } from '../List';
import { ListItem } from '../ListItem';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<List />', () => {
  it('should render List with default properties', () => {
    const { container, queryAllByRole, getByText } = renderWithSSR(
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
});
