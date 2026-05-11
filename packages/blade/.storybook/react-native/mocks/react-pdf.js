import React from 'react';
import { Text } from 'react-native';

export const Document = (props) => props.children || null;
export const Page = () => React.createElement(Text, null, 'PDF not available on native');
export const pdfjs = { GlobalWorkerOptions: {} };
