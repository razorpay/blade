import { RayChatOutput } from './RayChatOutput';
import type { GenUIComponentDefinition, GenUIComponentRenderer } from '~components/GenUI';

// Web only for now: on native, GenUI's TEXT reaches RayChatOutput's not-implemented error.
const RayChatOutputText = ({ content }: { content?: string }): React.ReactElement => (
  <RayChatOutput>{content ?? ''}</RayChatOutput>
);

const rayChatOutputGenUI: GenUIComponentDefinition = {
  renderer: RayChatOutputText as GenUIComponentRenderer,
};

export { rayChatOutputGenUI };
