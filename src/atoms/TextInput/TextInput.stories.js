import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import View from '../View';
import Space from '../Space';
import Text from '../Text';
import ScrollView from '../ScrollView';
import TextInput from './TextInput';

const sizeOptions = {
  small: 'small',
  medium: 'medium',
  auto: 'auto',
};

const keyboardTypeOptions = {
  'number-pad': 'number-pad',
  'decimal-pad': 'decimal-pad',
  numeric: 'numeric',
  'email-address': 'email-address',
  'phone-pad': 'phone-pad',
};

const returnKeyTypeOptions = {
  done: 'done',
  go: 'go',
  next: 'next',
  search: 'search',
  send: 'send',
};

const autoCapitalizeOptions = {
  none: 'none',
  sentences: 'sentences',
  words: 'words',
  characters: 'characters',
};

const typeOptions = {
  text: 'text',
  password: 'password',
  email: 'email',
  number: 'number',
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
            width={select('Width', sizeOptions, 'medium', 'Common')}
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
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
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label1"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
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
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label2"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
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
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label3"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
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
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label4"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
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
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label5"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
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
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label6"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
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
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label7"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
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
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label8"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          >
            This is disabled
          </TextInput>
        </View>
      </Space>

      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label9"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled Leading Icon:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label10"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled Trailing Icon:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label11"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled prefix:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label12"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled suffix:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label13"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled character count:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label14"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
            maxLength={10}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled error:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label15"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled Disabled:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label16"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          />
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled Disabled With Text:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label17"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
          >
            This is disabled
          </TextInput>
        </View>
      </Space>
      <Space margin={[0, 1, 4, 0]}>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space margin={[0, 0, 1, 0]}>
            <View>
              <Text>Filled with left label:</Text>
            </View>
          </Space>
          <TextInput
            width={select('Width', sizeOptions, 'large', 'Common')}
            label="Label18"
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
            type={select('Type', typeOptions, 'text')}
            keyboardType={select('Keyboard Type', keyboardTypeOptions, undefined, 'Native')}
            returnKeyType={select('Return Key Type', returnKeyTypeOptions, undefined, 'Native')}
            autoCapitalize={select('Auto Capitalize', autoCapitalizeOptions, undefined, 'Native')}
            labelPosition="left"
          />
        </View>
      </Space>
    </ScrollView>
  ));
