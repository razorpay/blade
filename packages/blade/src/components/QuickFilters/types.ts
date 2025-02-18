interface QuickFilterGroupProps {
  /*
   onChange is a function that is called when the selected quick filter changes.
*/
  onChange?: () => void;
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
  /*
        leadingElement is a React node that is displayed before the quick filter.
  */
  leadingElement?: React.ReactNode;
}

export type { QuickFilterGroupProps, QuickFilterProps };
