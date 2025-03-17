import React from 'react';
import { Code } from '../';
import { Box, Text } from '../../';

const jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "tags": ["developer", "designer", "product"]
}`;

// More comprehensive Protobuf example with realistic payment service definitions
const protobufExample = `syntax = "proto3";

package payment;

option go_package = "github.com/razorpay/payment-service/proto";
option java_package = "com.razorpay.payment.proto";
option java_multiple_files = true;

import "google/protobuf/timestamp.proto";

// Payment represents a payment transaction
message Payment {
  string id = 1;
  string order_id = 2;
  int64 amount = 3;  // Amount in smallest currency unit (e.g., paise)
  string currency = 4;
  PaymentStatus status = 5;
  PaymentMethod method = 6;
  google.protobuf.Timestamp created_at = 7;
  google.protobuf.Timestamp updated_at = 8;
  map<string, string> metadata = 9;
  
  // Nested message for card details
  message CardDetails {
    string last4 = 1;
    string network = 2;  // visa, mastercard, etc.
    string type = 3;     // credit, debit
    int32 expiry_month = 4;
    int32 expiry_year = 5;
  }
  
  // Nested message for UPI details
  message UpiDetails {
    string vpa = 1;
    string provider = 2;  // gpay, phonepe, etc.
  }
  
  oneof payment_details {
    CardDetails card = 10;
    UpiDetails upi = 11;
  }
}

// PaymentStatus represents the status of a payment
enum PaymentStatus {
  PAYMENT_STATUS_UNSPECIFIED = 0;
  PAYMENT_STATUS_CREATED = 1;
  PAYMENT_STATUS_AUTHORIZED = 2;
  PAYMENT_STATUS_CAPTURED = 3;
  PAYMENT_STATUS_REFUNDED = 4;
  PAYMENT_STATUS_FAILED = 5;
}

// PaymentMethod represents the method used for payment
enum PaymentMethod {
  PAYMENT_METHOD_UNSPECIFIED = 0;
  PAYMENT_METHOD_CARD = 1;
  PAYMENT_METHOD_UPI = 2;
  PAYMENT_METHOD_NETBANKING = 3;
  PAYMENT_METHOD_WALLET = 4;
}

// PaymentService provides methods to process payments
service PaymentService {
  // CreatePayment creates a new payment
  rpc CreatePayment(CreatePaymentRequest) returns (Payment);
  
  // CapturePayment captures an authorized payment
  rpc CapturePayment(CapturePaymentRequest) returns (Payment);
  
  // RefundPayment refunds a captured payment
  rpc RefundPayment(RefundPaymentRequest) returns (RefundResponse);
  
  // GetPayment retrieves payment details
  rpc GetPayment(GetPaymentRequest) returns (Payment);
  
  // ListPayments lists payments with optional filters
  rpc ListPayments(ListPaymentsRequest) returns (ListPaymentsResponse);
}

// Request and response messages for the service methods
message CreatePaymentRequest {
  string order_id = 1;
  int64 amount = 2;
  string currency = 3;
  PaymentMethod method = 4;
  map<string, string> metadata = 5;
}

message CapturePaymentRequest {
  string payment_id = 1;
  int64 amount = 2;  // Optional: capture partial amount
}

message RefundPaymentRequest {
  string payment_id = 1;
  int64 amount = 2;  // Optional: refund partial amount
  string reason = 3;
}

message RefundResponse {
  string refund_id = 1;
  string payment_id = 2;
  int64 amount = 3;
  PaymentStatus status = 4;
}

message GetPaymentRequest {
  string payment_id = 1;
}

message ListPaymentsRequest {
  int32 page_size = 1;
  string page_token = 2;
  google.protobuf.Timestamp from_date = 3;
  google.protobuf.Timestamp to_date = 4;
  repeated PaymentStatus status = 5;
}

message ListPaymentsResponse {
  repeated Payment payments = 1;
  string next_page_token = 2;
  int32 total_count = 3;
}`;

const CodeExample = () => {
    return (
        <Box padding="spacing.4" gap="spacing.4">
            <Box>
                <Text size="large" weight="semibold" marginBottom="spacing.2">
                    Protobuf Example - Payment Service Definition
                </Text>
                <Code
                    lang="protobuf"
                    size="medium"
                    showLineNumbers={true}
                >
                    {protobufExample}
                </Code>
            </Box>

            <Box>
                <Text size="large" weight="semibold" marginBottom="spacing.2">
                    JSON Example
                </Text>
                <Code
                    language="json"
                    showLineNumbers={true}
                    size="small"
                >
                    {jsonExample}
                </Code>
            </Box>

            <Box>
                <Text size="large" weight="semibold" marginBottom="spacing.2">
                    Non-Highlighted Example with Custom Color
                </Text>
                <Code
                    lang="json"
                    isHighlighted={false}
                    color="interactive.text.positive.subtle"
                    weight="bold"
                >
                    {`{
  "success": true,
  "message": "Operation completed successfully"
}`}
                </Code>
            </Box>
        </Box>
    );
};

export default CodeExample; 