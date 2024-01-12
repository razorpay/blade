import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the Dropdown component', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => {
        const [status, setStatus] = React.useState<string | undefined>('latest-added');
        const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

        return (
            <Box padding="spacing.10" display="flex" alignItems="center" gap="spacing.2">
                <Text>Sort By</Text>
                <Box flex="1">
                    <Dropdown onDismiss={() => setIsDropdownOpen(false)}>
                        <DropdownLink
                            icon={isDropdownOpen ? ChevronUpIcon : ChevronDownIcon}
                            iconPosition="right"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {status ?? ''}
                        </DropdownLink>
                        <DropdownOverlay>
                            <ActionList>
                                <ActionListItem
                                    onClick={({ name, value }) => {
                                    console.log({ name, value });
                                    setStatus(name);
                                    }}
                                    isSelected={status === 'latest-added'}
                                    title="Latest Added"
                                    value="latest-added"
                                />
                                <ActionListItem
                                    onClick={({ name, value }) => {
                                    console.log({ name, value });
                                    setStatus(name);
                                    }}
                                    isSelected={status === 'latest-invoice'}
                                    title="Latest Invoice"
                                    value="latest-invoice"
                                />
                            </ActionList>
                        </DropdownOverlay>
                    </Dropdown>
                </Box>
            </Box>
        );
    }
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => {
            const [status, setStatus] = React.useState<string | undefined>('latest-added');
            const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

            return (
                <Box padding="spacing.10" display="flex" alignItems="center" gap="spacing.2">
                    <Text>Sort By</Text>
                    <Box flex="1">
                        <Dropdown onOpenChange={isOpen => {
                            if (!isOpen) {
                                setIsDropdownOpen(false);
                            }
                        }}>
                            <DropdownLink
                                icon={isDropdownOpen ? ChevronUpIcon : ChevronDownIcon}
                                iconPosition="right"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                {status ?? ''}
                            </DropdownLink>
                            <DropdownOverlay>
                                <ActionList>
                                    <ActionListItem
                                        onClick={({ name, value }) => {
                                        console.log({ name, value });
                                        setStatus(name);
                                        }}
                                        isSelected={status === 'latest-added'}
                                        title="Latest Added"
                                        value="latest-added"
                                    />
                                    <ActionListItem
                                        onClick={({ name, value }) => {
                                        console.log({ name, value });
                                        setStatus(name);
                                        }}
                                        isSelected={status === 'latest-invoice'}
                                        title="Latest Invoice"
                                        value="latest-invoice"
                                    />
                                </ActionList>
                            </DropdownOverlay>
                        </Dropdown>
                    </Box>
                </Box>
            );
        }"
  `);
});

it('should migrate various scenarios for the onDismiss prop', async () => {
  const result = await applyTransform(
    transformer,
    `
      const App = () => {
          return (
            <Box padding="spacing.10" display="flex" alignItems="center" gap="spacing.2">
                <Dropdown
                    onDismiss={() => console.log("Dismissed!!!")}
                >
                    <DropdownButton icon={MyAccountIcon} variant="secondary">
                        My Account
                    </DropdownButton>
                    <DropdownOverlay>
                        <ActionList>
                            <ActionListItem
                                intent="negative"
                                title="Log Out"
                                value="logout"
                            />
                        </ActionList>
                    </DropdownOverlay>
                </Dropdown>

                <Dropdown
                    onDismiss={function () {
                        console.log("Dismissed!!!")
                        setIsDropdownOpen(false);
                    }}
                >
                    <DropdownButton icon={MyAccountIcon} variant="secondary">
                        My Account
                    </DropdownButton>
                    <DropdownOverlay>
                        <ActionList>
                            <ActionListItem
                                intent="negative"
                                title="Log Out"
                                value="logout"
                            />
                        </ActionList>
                    </DropdownOverlay>
                </Dropdown>

                <Dropdown
                    onDismiss={() => {
                        console.log("Dismissed!!!");
                        setIsDropdownOpen(false);
                    }}
                >
                    <DropdownButton icon={MyAccountIcon} variant="secondary">
                        My Account
                    </DropdownButton>
                    <DropdownOverlay>
                        <ActionList>
                            <ActionListItem
                                intent="negative"
                                title="Log Out"
                                value="logout"
                            />
                        </ActionList>
                    </DropdownOverlay>
                </Dropdown>
            
                <Dropdown onDismiss={handleDropdownDismiss} >
                    <DropdownButton icon={MyAccountIcon} variant="secondary">
                        My Account
                    </DropdownButton>
                    <DropdownOverlay>
                        <ActionList>
                            <ActionListItem
                                intent="negative"
                                title="Log Out"
                                value="logout"
                            />
                        </ActionList>
                    </DropdownOverlay>
                </Dropdown>
            </Box>
          );
      }
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => {
              return (
                  <Box padding="spacing.10" display="flex" alignItems="center" gap="spacing.2">
                      <Dropdown
                          onOpenChange={isOpen => {
                              if (!isOpen) {
                                  console.log("Dismissed!!!");
                              }
                          }}
                      >
                          <DropdownButton icon={MyAccountIcon} variant="secondary">
                              My Account
                          </DropdownButton>
                          <DropdownOverlay>
                              <ActionList>
                                  <ActionListItem
                                      intent="negative"
                                      title="Log Out"
                                      value="logout"
                                  />
                              </ActionList>
                          </DropdownOverlay>
                      </Dropdown>

                      <Dropdown
                          onOpenChange={isOpen => {
                              if (!isOpen) {
                                  console.log("Dismissed!!!")
                                  setIsDropdownOpen(false);
                              }
                          }}
                      >
                          <DropdownButton icon={MyAccountIcon} variant="secondary">
                              My Account
                          </DropdownButton>
                          <DropdownOverlay>
                              <ActionList>
                                  <ActionListItem
                                      intent="negative"
                                      title="Log Out"
                                      value="logout"
                                  />
                              </ActionList>
                          </DropdownOverlay>
                      </Dropdown>

                      <Dropdown
                          onOpenChange={isOpen => {
                              if (!isOpen) {
                                  console.log("Dismissed!!!");
                                  setIsDropdownOpen(false);
                              }
                          }}
                      >
                          <DropdownButton icon={MyAccountIcon} variant="secondary">
                              My Account
                          </DropdownButton>
                          <DropdownOverlay>
                              <ActionList>
                                  <ActionListItem
                                      intent="negative"
                                      title="Log Out"
                                      value="logout"
                                  />
                              </ActionList>
                          </DropdownOverlay>
                      </Dropdown>
                  
                      <Dropdown onOpenChange={isOpen => {
                          if (!isOpen) {
                              handleDropdownDismiss();
                          }
                      }} >
                          <DropdownButton icon={MyAccountIcon} variant="secondary">
                              My Account
                          </DropdownButton>
                          <DropdownOverlay>
                              <ActionList>
                                  <ActionListItem
                                      intent="negative"
                                      title="Log Out"
                                      value="logout"
                                  />
                              </ActionList>
                          </DropdownOverlay>
                      </Dropdown>
                  </Box>
              );
          }"
  `);
});
