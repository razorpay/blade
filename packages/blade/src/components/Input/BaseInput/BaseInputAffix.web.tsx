import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';

/**
 * Wraps the prefix and suffix text of BaseInput.
 *
 * An `<input>` centres its text using the font's natural line height, so the
 * affix text uses `line-height: normal` too. Without this, the affix and the
 * input text can render 1px apart (e.g. medium size: 14px text, 20px line height).
 */
const BaseInputAffix = styled(BaseBox)({
  // `&&` doubles the class so this rule always beats the child Text's own
  // line-height rule, instead of depending on which stylesheet rule comes last.
  '&& > *': {
    lineHeight: 'normal',
  },
});

export { BaseInputAffix };
