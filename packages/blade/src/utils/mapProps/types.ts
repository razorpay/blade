import type { AccessibilityRole } from 'react-native';

// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
export type AccessibilityRoles =
  | Exclude<AccessibilityRole, 'header' | 'adjustable' | 'image' | 'none' | 'summary'>
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem'
  | (string & Record<never, never>);

export type CommonAccessibilityKeys = keyof CommonAccessibilityProps;
export type CommonAccessibilityProps = {
  accessibilityRole: AccessibilityRoles;
  /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
  accessibilityActiveDescendant?: string;
  /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
  accessibilityAtomic?: boolean;
  /**
   * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
   * presented if they are made.
   */
  accessibilityAutoComplete?: 'none' | 'inline' | 'list' | 'both';
  /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
  accessibilityBusy?: boolean;
  /**
   * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
   * @see aria-pressed @see aria-selected.
   */
  accessibilityChecked?: boolean | 'mixed';
  /**
   * Defines the total number of columns in a table, grid, or treegrid.
   * @see aria-colindex.
   */
  accessibilityColCount?: number;
  /**
   * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
   * @see aria-colcount @see aria-colspan.
   */
  accessibilityColIndex?: number;
  /**
   * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-colindex @see aria-rowspan.
   */
  accessibilityColSpan?: number;
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   * @see aria-owns.
   */
  accessibilityControls?: string;
  /** Indicates the element that represents the current item within a container or set of related elements. */
  accessibilityCurrent?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  /**
   * Identifies the element (or elements) that describes the object.
   * @see aria-labelledby
   */
  accessibilityDescribedBy?: string;
  /**
   * Identifies the element that provides a detailed, extended description for the object.
   * @see aria-describedby.
   */
  accessibilityDetails?: string;
  /**
   * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
   * @see aria-hidden @see aria-readonly.
   */
  accessibilityDisabled?: boolean;
  /**
   * Indicates what functions can be performed when a dragged object is released on the drop target.
   * @deprecated in ARIA 1.1
   */
  accessibilityDropEffect?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
  /**
   * Identifies the element that provides an error message for the object.
   * @see aria-invalid @see aria-describedby.
   */
  accessibilityErrorMessage?: string;
  /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
  accessibilityExpanded?: boolean;
  /**
   * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
   * allows assistive technology to override the general default of reading in document source order.
   */
  accessibilityFlowTo?: string;
  /**
   * Indicates an element's "grabbed" state in a drag-and-drop operation.
   * @deprecated in ARIA 1.1
   */
  accessibilityGrabbed?: boolean;
  /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
  accessibilityHasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /**
   * Indicates whether the element is exposed to an accessibility API.
   * @see aria-disabled.
   */
  accessibilityHidden?: boolean;
  /**
   * Indicates the entered value does not conform to the format expected by the application.
   * @see aria-errormessage.
   */
  accessibilityInvalid?: boolean | 'grammar' | 'spelling';
  /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
  accessibilityKeyShortcuts?: string;
  /**
   * Defines a string value that labels the current element.
   * @see aria-labelledby.
   */
  accessibilityLabel?: string;
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see aria-describedby.
   */
  accessibilityLabelledBy?: string;
  /** Defines the hierarchical level of an element within a structure. */
  accessibilityLevel?: number;
  /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
  accessibilityLiveRegion?: 'off' | 'assertive' | 'polite';
  /** Indicates whether an element is modal when displayed. */
  accessibilityModal?: boolean;
  /** Indicates whether a text box accepts multiple lines of input or only a single line. */
  accessibilityMultiline?: boolean;
  /** Indicates that the user may select more than one item from the current selectable descendants. */
  accessibilityMultiSelectable?: boolean;
  /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
  accessibilityOrientation?: 'horizontal' | 'vertical';
  /**
   * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
   * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
   * @see aria-controls.
   */
  accessibilityOwns?: string;
  /**
   * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
   * A hint could be a sample value or a brief description of the expected format.
   */
  accessibilityPlaceholder?: string;
  /**
   * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-setsize.
   */
  accessibilityPosInSet?: number;
  /**
   * Indicates the current "pressed" state of toggle buttons.
   * @see aria-checked @see aria-selected.
   */
  accessibilityPressed?: boolean | 'mixed';
  /**
   * Indicates that the element is not editable, but is otherwise operable.
   * @see aria-disabled.
   */
  accessibilityReadOnly?: boolean;
  /**
   * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
   * @see aria-atomic.
   */
  accessibilityRelevant?:
    | 'additions'
    | 'additions removals'
    | 'additions text'
    | 'all'
    | 'removals'
    | 'removals additions'
    | 'removals text'
    | 'text'
    | 'text additions'
    | 'text removals';
  /** Indicates that user input is required on the element before a form may be submitted. */
  accessibilityRequired?: boolean;
  /** Defines a human-readable, author-localized description for the role of an element. */
  accessibilityRoleDescription?: string;
  /**
   * Defines the total number of rows in a table, grid, or treegrid.
   * @see aria-rowindex.
   */
  accessibilityRowCount?: number;
  /**
   * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @see aria-rowcount @see aria-rowspan.
   */
  accessibilityRowIndex?: number;
  /**
   * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-rowindex @see aria-colspan.
   */
  accessibilityRowSpan?: number;
  /**
   * Indicates the current "selected" state of various widgets.
   * @see aria-checked @see aria-pressed.
   */
  accessibilitySelected?: boolean;
  /**
   * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-posinset.
   */
  accessibilitySetSize?: number;
  /** Indicates if items in a table or grid are sorted in ascending or descending order. */
  accessibilitySort?: 'none' | 'ascending' | 'descending' | 'other';
  /** Defines the maximum allowed value for a range widget. */
  accessibilityValueMax?: number;
  /** Defines the minimum allowed value for a range widget. */
  accessibilityValueMin?: number;
  /**
   * Defines the current value for a range widget.
   * @see aria-valuetext.
   */
  accessibilityValueNow?: number;
  /** Defines the human readable text alternative of aria-valuenow for a range widget. */
  accessibilityValueText?: string;
};
