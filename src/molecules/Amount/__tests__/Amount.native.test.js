import React from 'react';
import Amount from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Amount />', () => {
  describe('variant', () => {
    it('renders camel variant amount', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount variant="camel">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });

    it('renders normal variant amount', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount variant="normal">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('size', () => {
    describe(' with camel variant', () => {
      it('renders amount with medium size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="medium" variant="camel">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with large size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="large" variant="camel">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xlarge" variant="camel">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xxlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xxlarge" variant="camel">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xxxlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xxxlarge" variant="camel">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
    });

    describe(' with camel variant and subtle', () => {
      it('renders amount with medium size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="medium" variant="camel" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with large size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="large" variant="camel" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xlarge" variant="camel" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xxlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xxlarge" variant="camel" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xxxlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xxxlarge" variant="camel" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
    });

    describe(' with normal variant', () => {
      it('renders amount with medium size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="medium" variant="normal">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with large size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="large" variant="normal">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xlarge" variant="normal">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xxlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xxlarge" variant="normal">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xxxlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xxxlarge" variant="normal">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
    });

    describe(' with normal variant and subtle', () => {
      it('renders amount with medium size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="medium" variant="normal" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with large size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="large" variant="normal" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xlarge" variant="normal" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xxlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xxlarge" variant="normal" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders amount with xxxlarge size', () => {
        const displayText = '1234.00';
        const { container } = renderWithTheme(
          <Amount size="xxxlarge" variant="normal" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('decimal formatting', () => {
    it('renders 3 digit amount with indian currency format', () => {
      const displayText = '123';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 4 digit amount with indian currency format', () => {
      const displayText = '1234';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 5 digit amount with indian currency format', () => {
      const displayText = '12345';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 6 digit amount with indian currency format', () => {
      const displayText = '123456';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 7 digit amount with indian currency format', () => {
      const displayText = '1234567';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 8 digit amount with indian currency format', () => {
      const displayText = '12345678';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('fractional formatting', () => {
    it('renders 0 digit fractional part', () => {
      const displayText = '123';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 1 digit fractional part', () => {
      const displayText = '123.4';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 2 digit fractional part', () => {
      const displayText = '123.45';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 3 digit fractional part', () => {
      const displayText = '123.456';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('error', () => {
    it('throws error for a non numeric amount', () => {
      const displayText = 'abcd';
      const errorMessage = 'Expected children to be number \n(Eg. "1234", "12.34")';
      expect(() => renderWithTheme(<Amount>{displayText}</Amount>)).toThrow(errorMessage);
    });
  });

  describe('currency', () => {
    it('renders amount in INR', () => {
      const displayText = '1234';
      const { container } = renderWithTheme(<Amount currency="INR">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders amount in EUR', () => {
      const displayText = '1234';
      const { container } = renderWithTheme(<Amount currency="EUR">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('weight', () => {
    describe('with camel variant', () => {
      it('renders bold amount', () => {
        const displayText = '1234';
        const { container } = renderWithTheme(
          <Amount weight="bold" variant="camel">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders regular amount', () => {
        const displayText = '1234';
        const { container } = renderWithTheme(
          <Amount weight="regular" variant="camel">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
    });

    describe('with camel variant and subtle', () => {
      it('renders bold amount', () => {
        const displayText = '1234';
        const { container } = renderWithTheme(
          <Amount weight="bold" variant="camel" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders regular amount', () => {
        const displayText = '1234';
        const { container } = renderWithTheme(
          <Amount weight="regular" variant="camel" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
    });

    describe('with normal variant', () => {
      it('renders bold amount', () => {
        const displayText = '1234';
        const { container } = renderWithTheme(
          <Amount weight="bold" variant="normal">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders regular amount', () => {
        const displayText = '1234';
        const { container } = renderWithTheme(
          <Amount weight="regular" variant="normal">
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
    });

    describe('with normal variant and subtle', () => {
      it('renders bold amount', () => {
        const displayText = '1234';
        const { container } = renderWithTheme(
          <Amount weight="bold" variant="normal" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
      it('renders regular amount', () => {
        const displayText = '1234';
        const { container } = renderWithTheme(
          <Amount weight="regular" variant="normal" subtle={true}>
            {displayText}
          </Amount>,
        );
        expect(container).toMatchSnapshot();
      });
    });
  });
});
