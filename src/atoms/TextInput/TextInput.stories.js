import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from './TextInput';
import styled from 'styled-components';

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

storiesOf('TextInput', module)
  .addParameters({
    component: TextInput,
  })
  .add('default', () => (
    <ScrollContainer contentContainerStyle={{}}>
      <ItemContainer>
        <ItemTitle>Outline:</ItemTitle>
        <TextInput
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={true}
          error=""
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
          label="Label"
          disabled={true}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={false}
          error=""
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
          label="Label"
          disabled={true}
          error=""
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
          label="Label"
          disabled={true}
          error=""
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
    </ScrollContainer>
  ));
