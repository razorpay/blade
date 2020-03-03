import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from './TextInput';
import View from '../View';
import Space from '../Space';
import Text from '../Text';
import { select } from '@storybook/addon-knobs';

const sizeOptions = {
  small: 'small',
  medium: 'medium',
  block: 'block',
};

storiesOf('TextInput', module)
  .addParameters({
    component: TextInput,
  })
  .add('default', () => (
    <View>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined:</Text>
            </View>
          </Space>
          <TextInput
            size={select('Size', sizeOptions, 'medium')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText=""
            errorText=""
            onChangeText={() => {}}
            variant="outlined"
          />
        </View>
      </Space>

      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined Leading Icon:</Text>
            </View>
          </Space>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft="info"
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="outlined"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined Trailing Icon:</Text>
            </View>
          </Space>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight="info"
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="outlined"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined prefix:</Text>
            </View>
          </Space>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="outlined"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Outlined suffix:</Text>
            </View>
          </Space>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix="₹"
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="outlined"
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
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="outlined"
            maxLength={10}
            showCharacterCount
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
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft="info"
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText="This is the reason for the error"
            onChangeText={() => {}}
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
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
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
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="outlined"
          >
            This is disabled
          </TextInput>
        </View>
      </Space>

      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled:</Text>
            </View>
          </Space>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="filled"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled Leading Icon:</Text>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft="info"
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="filled"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled Trailing Icon:</Text>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight="info"
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="filled"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled prefix:</Text>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="filled"
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled suffix:</Text>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix="₹"
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
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
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="filled"
            maxLength={10}
            showCharacterCount
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled error:</Text>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft="info"
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText="This is the reason for the error"
            onChangeText={() => {}}
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
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
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
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChangeText={() => {}}
            variant="filled"
          >
            This is disabled
          </TextInput>
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View />
          </Space>
          <Text>Filled with left label:</Text>
          <TextInput
            size={select('Size', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText=""
            errorText=""
            onChangeText={() => {}}
            variant="filled"
            labelPosition="left"
          />
        </View>
      </Space>
    </View>
  ));
