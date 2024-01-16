import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the ActionList component', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
            <ActionList surfaceLevel={2}>
                <ActionListSection title="Help">
                <ActionListItem
                    leading={<ActionListItemIcon icon={SettingsIcon} />}
                    title="Settings"
                    value="settings"
                    isDisabled={true}
                />
                <ActionListItem
                    leading={<ActionListItemIcon icon={DownloadIcon} />}
                    title="Download"
                    value="download"
                />
                
                </ActionListSection>
            </ActionList>

            <ActionList surfaceLevel={3}>
                <ActionListSection title="Help">
                <ActionListItem
                    leading={<ActionListItemIcon icon={SettingsIcon} />}
                    title="Settings"
                    value="settings"
                    isDisabled={true}
                />
                <ActionListItem
                    leading={<ActionListItemIcon icon={DownloadIcon} />}
                    title="Download"
                    value="download"
                />
                
                </ActionListSection>
            </ActionList>
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
                <ActionList>
                    <ActionListSection title="Help">
                    <ActionListItem
                        leading={<ActionListItemIcon icon={SettingsIcon} />}
                        title="Settings"
                        value="settings"
                        isDisabled={true}
                    />
                    <ActionListItem
                        leading={<ActionListItemIcon icon={DownloadIcon} />}
                        title="Download"
                        value="download"
                    />
                    
                    </ActionListSection>
                </ActionList>

                <ActionList>
                    <ActionListSection title="Help">
                    <ActionListItem
                        leading={<ActionListItemIcon icon={SettingsIcon} />}
                        title="Settings"
                        value="settings"
                        isDisabled={true}
                    />
                    <ActionListItem
                        leading={<ActionListItemIcon icon={DownloadIcon} />}
                        title="Download"
                        value="download"
                    />
                    
                    </ActionListSection>
                </ActionList>
            </>
          );"
  `);
});
