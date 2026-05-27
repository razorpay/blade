const React = require('react');
const { Text } = require('react-native');

const noop = () => null;
const NoopComponent = (props) => React.createElement(Text, null, props.children || '');

module.exports = {
  Title: NoopComponent,
  Subtitle: NoopComponent,
  Description: NoopComponent,
  Primary: noop,
  ArgsTable: noop,
  Stories: noop,
  DocsContainer: NoopComponent,
  Meta: noop,
  PRIMARY_STORY: '',
};
