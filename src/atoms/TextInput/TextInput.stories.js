import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from './TextInput';
import styled from 'styled-components';
import { select } from '@storybook/addon-knobs';
import { withKnobs } from '@storybook/addon-ondevice-knobs';

const ScrollContainer = styled.ScrollView`
  width: 100%;
  height: 100%;
`;

const ItemContainer = styled.View`
  margin: 0px 10px 50px 0px;
`;

const ItemTitle = styled.Text`
  color: ${(props) => props.theme.colors.shade[700]};
  margin: 0px 0px 10px 0px;
`;

const sizeOptions = {
  small: 'small',
  medium: 'medium',
};

storiesOf('TextInput', module)
  .addParameters({
    component: TextInput,
  })
  .addDecorator(withKnobs)
  .add('default', () => (
    <ScrollContainer contentContainerStyle={{}}>
      <ItemContainer>
        <ItemTitle>Outline:</ItemTitle>
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
          variant="outline"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Outline Leading Icon:</ItemTitle>
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
          variant="outline"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Outline Trailing Icon:</ItemTitle>
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
          variant="outline"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Outline prefix:</ItemTitle>
        <TextInput
          size={select('Size', sizeOptions, 'large')}
          label="Label"
          disabled={false}
          iconLeft=""
          iconRight=""
          prefix="kg"
          suffix=""
          placeholder="Type here"
          helpText="This is a help text"
          errorText=""
          onChangeText={() => {}}
          variant="outline"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Outline suffix:</ItemTitle>
        <TextInput
          size={select('Size', sizeOptions, 'large')}
          label="Label"
          disabled={false}
          iconLeft=""
          iconRight=""
          prefix=""
          suffix="kg"
          placeholder="Type here"
          helpText="This is a help text"
          errorText=""
          onChangeText={() => {}}
          variant="outline"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Outline character count:</ItemTitle>
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
          variant="outline"
          maxLength={10}
          showCharacterCount
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Outline error:</ItemTitle>
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
          variant="outline"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Outline Disabled:</ItemTitle>
        <TextInput
          size={select('Size', sizeOptions, 'large')}
          label="Label"
          disabled={true}
          iconLeft=""
          iconRight=""
          prefix="kg"
          suffix=""
          placeholder="Type here"
          helpText="This is a help text"
          errorText=""
          onChangeText={() => {}}
          variant="outline"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Outline Disabled With Text:</ItemTitle>
        <TextInput
          size={select('Size', sizeOptions, 'large')}
          label="Label"
          disabled={true}
          iconLeft=""
          iconRight=""
          prefix="kg"
          suffix=""
          placeholder="Type here"
          helpText="This is a help text"
          errorText=""
          onChangeText={() => {}}
          variant="outline"
        >
          This is disabled
        </TextInput>
      </ItemContainer>

      <ItemContainer>
        <ItemTitle>Filled:</ItemTitle>
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
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled Leading Icon:</ItemTitle>
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
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled Trailing Icon:</ItemTitle>
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
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled prefix:</ItemTitle>
        <TextInput
          size={select('Size', sizeOptions, 'large')}
          label="Label"
          disabled={false}
          iconLeft=""
          iconRight=""
          prefix="kg"
          suffix=""
          placeholder="Type here"
          helpText="This is a help text"
          errorText=""
          onChangeText={() => {}}
          variant="filled"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled suffix:</ItemTitle>
        <TextInput
          size={select('Size', sizeOptions, 'large')}
          label="Label"
          disabled={false}
          iconLeft=""
          iconRight=""
          prefix=""
          suffix="kg"
          placeholder="Type here"
          helpText="This is a help text"
          errorText=""
          onChangeText={() => {}}
          variant="filled"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled character count:</ItemTitle>
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
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled error:</ItemTitle>
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
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled Disabled:</ItemTitle>
        <TextInput
          size={select('Size', sizeOptions, 'large')}
          label="Label"
          disabled={true}
          iconLeft=""
          iconRight=""
          prefix="kg"
          suffix=""
          placeholder="Type here"
          helpText="This is a help text"
          errorText=""
          onChangeText={() => {}}
          variant="filled"
        />
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled Disabled With Text:</ItemTitle>
        <TextInput
          size={select('Size', sizeOptions, 'large')}
          label="Label"
          disabled={true}
          iconLeft=""
          iconRight=""
          prefix="kg"
          suffix=""
          placeholder="Type here"
          helpText="This is a help text"
          errorText=""
          onChangeText={() => {}}
          variant="filled"
        >
          This is disabled
        </TextInput>
      </ItemContainer>
      <ItemContainer>
        <ItemTitle>Filled with left label:</ItemTitle>
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
      </ItemContainer>
    </ScrollContainer>
  ));
