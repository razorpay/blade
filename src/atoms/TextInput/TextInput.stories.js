import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from './TextInput';
import View from '../View';
import Space from '../Space';
import Text from '../Text';
import ScrollView from '../ScrollView';
import { select } from '@storybook/addon-knobs';

const sizeOptions = {
  small: 'small',
  medium: 'medium',
  auto: 'auto',
};

storiesOf('TextInput', module)
  .addParameters({
    component: TextInput,
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
          <TextInput
            width={select('Width', sizeOptions, 'medium')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
            placeholder="Type here"
            helpText=""
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
              <Text>Outlined Leading Icon:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft="info"
            iconRight=""
            prefix=""
            suffix=""
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
              <Text>Outlined Trailing Icon:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight="info"
            prefix=""
            suffix=""
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
              <Text>Outlined prefix:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
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
              <Text>Outlined suffix:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix="₹"
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
              <Text>Outlined character count:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
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
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft="info"
            iconRight=""
            prefix=""
            suffix=""
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
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
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
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
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
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
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
            <View>
              <Text>Filled Leading Icon:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft="info"
            iconRight=""
            prefix=""
            suffix=""
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
            <View>
              <Text>Filled Trailing Icon:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight="info"
            prefix=""
            suffix=""
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
            <View>
              <Text>Filled prefix:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
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
            <View>
              <Text>Filled suffix:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix="₹"
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
            <View>
              <Text>Filled character count:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
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
            <View>
              <Text>Filled error:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft="info"
            iconRight=""
            prefix=""
            suffix=""
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
            <View>
              <Text>Filled Disabled:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
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
            <View>
              <Text>Filled Disabled With Text:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={true}
            iconLeft=""
            iconRight=""
            prefix="₹"
            suffix=""
            placeholder="Type here"
            helpText="This is a help text"
            errorText=""
            onChange={() => {}}
            variant="filled"
          >
            This is disabled
          </TextInput>
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled with left label:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large')}
            label="Label"
            disabled={false}
            iconLeft=""
            iconRight=""
            prefix=""
            suffix=""
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
