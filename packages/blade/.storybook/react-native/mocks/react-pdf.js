const React = require('react');
const { Text } = require('react-native');

const Document = (props) => props.children || null;
const Page = () => React.createElement(Text, null, 'PDF not available on native');
const pdfjs = { GlobalWorkerOptions: {} };

module.exports = { Document, Page, pdfjs };
