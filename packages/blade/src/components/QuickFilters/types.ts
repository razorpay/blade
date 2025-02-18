interface QuickFilterGroupProps {
  /*
   onChange is a function that is called when the selected quick filter changes.
   it returns an object with either value or values.
   value is a string that is the value of the selected quick filter. it is returned when the selectionType is 'single'.
   values is an array of strings that are the values of the selected quick filters. it is returned when the selectionType is 'multiple'.
*/
  onChange?: (params: { value?: string; values?: string[] }) => void;
  /*
       selectionType is a string that can be either 'single' or 'multiple'.
 */
  selectionType: 'single' | 'multiple';
  /*
         children is an array of QuickFilter components.
  */
  children: React.ReactNode;
}

interface QuickFilterProps {
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
}

export type { QuickFilterGroupProps, QuickFilterProps };
