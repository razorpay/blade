import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';

/**
 * Wrapper for ListView content (e.g. ListViewFilters + Table). When Table is rendered
 * below ListViewFilters, the table surface has rounded corners by default.
 * This styled wrapper targets the table surface and sets top border radius to 0
 * so the table connects visually with the filters above (square top edge).
 *
 * Usage: ListView uses this as its root wrapper so any Table inside gets square top corners.
 */
const StyledListView = styled(BaseBox)`
  & .__blade-table-surface {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
`;

export { StyledListView };
