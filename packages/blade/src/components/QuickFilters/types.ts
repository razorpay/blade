import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type QuickFilterGroupProps = {
  /*
   onChange is a function that is called when the selected quick filter changes.
   it returns an object with either value or values.
   values is an array of strings that are the selected quick filters if the selectionType is 'multiple'.
   value is a string that is the selected quick filter if the selectionType is 'single'. 
*/
  onChange?: (params: { values?: string[] | string }) => void;
  /*
       selectionType is a string that can be either 'single' or 'multiple'.
 */
  selectionType: 'single' | 'multiple';
  /*
         children is an array of QuickFilter components.
  */
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

type QuickFilterProps = {
  /*
      title is a string that is displayed as the title of the quick filter.
  */
  title: string;
  /*
        value is a string that is displayed as the value of the quick filter.
  */
  value: string;
  /*
        trailingElement is a React node that is displayed after the quick filter.
  */
  trailingElement?: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

type QuickFilterContentProps = Pick<QuickFilterProps, 'trailingElement' | 'value' | 'title'> &
  Pick<QuickFilterGroupProps, 'selectionType'> &
  TestID &
  DataAnalyticsAttribute & {
    isSelected?: boolean;
  };

export type { QuickFilterGroupProps, QuickFilterProps, QuickFilterContentProps };
