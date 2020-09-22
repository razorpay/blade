import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import View from '../View';
import Space from '../Space';
import Text from '../Text';
import ScrollView from '../ScrollView';
import TextArea from './TextArea';

const sizeOptions = {
  small: 'small',
  medium: 'medium',
  auto: 'auto',
};

const autoCapitalizeOptions = {
  none: 'none',
  sentences: 'sentences',
  words: 'words',
  characters: 'characters',
};

storiesOf('TextArea', module)
  .addParameters({
    component: TextArea,
  })
  .add('default', () => (
    <ScrollView>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined:</Text>
            </View>
          </Space>
          <TextArea
            width={select('Width', sizeOptions, 'medium')}
            label="Label"
            disabled={false}
            placeholder="Type here"
            helpText=""
            errorText=""
            onChange={() => {}}
            variant="outlined"
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Common')}
          />
        </View>
      </Space>

      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined character count:</Text>
            </View>
          </Space>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
            variant="outlined"
            maxLength={10}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined error:</Text>
            </View>
          </Space>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            placeholder="Type here"
            helpText="This is a help text"
            errorText="This is the reason for the error"
            onChange={() => {}}
            variant="outlined"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined Disabled:</Text>
            </View>
          </Space>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
            variant="outlined"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined Disabled With Text:</Text>
            </View>
          </Space>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
            variant="outlined"
          >
            This is disabled
          </TextArea>
        </View>
      </Space>

      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled:</Text>
            </View>
          </Space>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
            variant="filled"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled character count:</Text>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
            variant="filled"
            maxLength={10}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled error:</Text>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            placeholder="Type here"
            helpText="This is a help text"
            errorText="This is the reason for the error"
            onChange={() => {}}
            variant="filled"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled Disabled:</Text>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
            variant="filled"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled Disabled With Text:</Text>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
            variant="filled"
          >
            This is disabled
          </TextArea>
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled with left label:</Text>
          <TextArea
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            placeholder="Type here"
            helpText=""
            errorText=""
            onChange={() => {}}
            variant="filled"
            labelPosition="left"
          />
        </View>
      </Space>
    </ScrollView>
  ));
