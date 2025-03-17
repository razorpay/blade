import React from 'react';
import { Card, CardBody } from '~components/Card';
import { StoryFn } from '@storybook/react';
import { CodeBlock } from './CodeBlock';

export default {
    title: 'Components/CodeBlock',
    component: CodeBlock,
};

export const JsonExample: StoryFn = () => {
    const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": 12345
  },
  "tags": ["developer", "designer", "product"],
  "projects": null
}`;

    return (
        <Card>
            <CardBody>
                <CodeBlock lang="json">{jsonExample}</CodeBlock>
            </CardBody>
        </Card>
    );
};

JsonExample.storyName = 'JSON';

export const ProtobufExample: StoryFn = () => {
    const protobufExample = `syntax = "proto3";

package example;


// User profile information
message User {
  string name = 1;
  int32 age = 2;
  bool is_active = 3;
  
  enum Role {
    ADMIN = 0;
    MEMBER = 1;
    GUEST = 2;
  }
  
  Role role = 4;
  
  message Address {
    string street = 1;
    string city = 2;
    int32 zip_code = 3;
  }
  
  Address address = 5;
  repeated string tags = 6;
}

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);
}`;

    return (
        <Card>
            <CardBody>
                <CodeBlock lang="protobuf">{protobufExample}</CodeBlock>
            </CardBody>
        </Card>
    );
};

ProtobufExample.storyName = 'Protobuf';

export const WithoutBackground: StoryFn = () => {
    const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true
}`;

    return (
        <Card>
            <CardBody>
                <CodeBlock lang="json" showBackground={false}>{jsonExample}</CodeBlock>
            </CardBody>
        </Card>
    );
};

WithoutBackground.storyName = 'Without Background'; 