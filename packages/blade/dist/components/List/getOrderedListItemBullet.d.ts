/**
 * Get the list item bullet number/roman number/alphabet for the passed level and list item number
 *
 */
declare const getOrderedListItemBullet: ({ itemNumber, level, }: {
    itemNumber: number;
    level: number;
}) => string;
export { getOrderedListItemBullet };
