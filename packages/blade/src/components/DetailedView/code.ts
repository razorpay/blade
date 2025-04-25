export const DetailedViewStoryCode = `
  import React from 'react';
  import { Drawer, DrawerHeader, DrawerBody, Box, Text, IconButton } from '@razorpay/blade/components'; 

  // KeyValueGrid
  // KeyValueItem
  // Timeline
  // DetailedViewHeader
  // DetailedViewSection
  // TableExample

  // Custom elements inside DetailedViewDrawerHeader
  const DetailedViewDrawerHeader = () => {
    return (
      <Box>

      </Box>
    )
  }

  const DetailedViewDrawer = ({ isOpen, onDismiss, onUnmount, selectedItem }) => {
    return (
      <Drawer isOpen={isOpen} onDismiss={onDismiss} onUnmount={onUnmount}>
        <DrawerHeader 
          title="Settlements" 
          trailing={
            <IconButton icon={MoreHorizontalIcon} 
              accessibilityLabel="Options" 
              onClick={() => console.log('Options Clicked')} 
              size="large" 
            />
          }
        >

        </DrawerHeader>
        <DrawerBody>
        
        </DrawerBody>
      </Drawer>
    )
  }



  const App = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);

    const handleRowClick = ({ item }) => {
      setSelectedItem(item);
      setIsDrawerOpen(true);
    }

    return (
      <Box>
        <TableExample onRowClick={handleRowClick} />
        <DetailedViewDrawer 
          isOpen={isDrawerOpen} 
          onDismiss={() => setIsDrawerOpen(false)} 
          onUnmount={() => setSelectedItem(null)} 
          selectedItem={selectedItem}
        />
      </Box>
    )
  }

  export default App;
`;
