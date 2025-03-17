import React from 'react';
import { StoryFn } from '@storybook/react';
import { CodeBlock } from './CodeBlock';
import { Card, CardBody } from '~components/Card';

export default {
    title: 'Components/CodeBlock/_KitchenSink',
    component: CodeBlock,
};

export const JsonExamples: StoryFn = () => {
    const complexJson = `{
  "person": {
    "name": "John Doe",
    "age": 30,
    "isActive": true,
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "zipCode": 12345
    },
    "tags": ["developer", "designer", "product"],
    "projects": null,
    "scores": [98, 95, 92, 87],
    "contactInfo": {
      "email": "john.doe@example.com",
      "phone": "+1-555-555-5555"
    }
  },
  "company": "Acme Inc.",
  "department": "Engineering",
  "startDate": "2023-01-15"
}`;

    return (
        <Card>
            <CardBody>
                <h3>JSON Example - Complex Object</h3>
                <CodeBlock lang="json">{complexJson}</CodeBlock>
            </CardBody>
        </Card>
    );
};

export const ProtobufExamples: StoryFn = () => {
    const protoExample = `syntax = "proto3";

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
  map<string, string> attributes = 7;
}

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);
  rpc UpdateUser(UpdateUserRequest) returns (User);
  rpc DeleteUser(DeleteUserRequest) returns (google.protobuf.Empty);
}`;

    return (
        <Card>
            <CardBody>
                <h3>Protobuf Example</h3>
                <CodeBlock lang="protobuf">{protoExample}</CodeBlock>
            </CardBody>
        </Card>
    );
};

export const WithoutBackground: StoryFn = () => {
    const simpleJson = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true
}`;

    return (
        <Card>
            <CardBody>
                <h3>Without Background</h3>
                <CodeBlock lang="json" showBackground={false}>{simpleJson}</CodeBlock>
            </CardBody>
        </Card>
    );
}; 