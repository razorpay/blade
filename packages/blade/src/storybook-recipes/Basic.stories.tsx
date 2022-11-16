import { makeRecipe } from '~src/_helpers/storybook/makeRecipe';
import { isReactNative } from '~utils';

// This has to be defined statically. We can't use dynamic variables here.
// Copy paste this in all recipe stories and change the paths with the example you want to load in that story
const exampleSrcContext = isReactNative()
  ? // require.context is webpack thing. Doesn't work on React Native
    null
  : require.context(`!!raw-loader!../../../../examples/basic/src`, true, /.tsx/);
const exampleBaseContext = isReactNative()
  ? null
  : require.context('../../../../examples/basic/', false, /.json/);

const { meta, Example } = makeRecipe({
  recipeTitle: 'Basic',
  exampleBaseContext,
  exampleSrcContext,
});

export default meta;
export const Basic = Example;
