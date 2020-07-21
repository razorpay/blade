import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import TextArea from '../index';

const SAMPLE_ID = 'sample-id';
const SAMPLE_LABEL = 'Sample Label';

describe('<TextArea />', () => {
  describe('variant', () => {
    it('renders outlined variant with default props', () => {
      const { container } = renderWithTheme(<TextArea variant="outlined" />);
      expect(container).toMatchSnapshot();
    });

    it('renders filled variant with default props', () => {
      const { container } = renderWithTheme(<TextArea variant="filled" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('label', () => {
    it('renders input with labelPosition on top(default) and variant outlined(default)', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="top" />,
      );
      const textArea = queryByLabelText(SAMPLE_LABEL);
      expect(textArea).not.toBeNull();
      expect(container).toMatchSnapshot();
    });

    it('renders input with labelPosition on top(default) and variant filled', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="top" variant="filled" />,
      );
      const textArea = queryByLabelText(SAMPLE_LABEL);
      expect(textArea).not.toBeNull();
      expect(container).toMatchSnapshot();
    });

    it('renders input with labelPosition on left and variant filled', () => {
      const { queryByLabelText, container } = renderWithTheme(
        <TextArea label={SAMPLE_LABEL} id={SAMPLE_ID} labelPosition="left" variant="filled" />,
      );
      const textArea = queryByLabelText(SAMPLE_LABEL);
      expect(textArea).not.toBeNull();
      expect(container).toMatchSnapshot();
    });
  });
});
