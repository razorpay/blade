const React = require('react');
const { View, Text } = require('react-native');

const Document = ({ children }) => React.createElement(View, null, children);
const Page = () => React.createElement(Text, null, 'PDF (web only)');
const pdfjs = { GlobalWorkerOptions: {} };

module.exports = { Document, Page, pdfjs };
