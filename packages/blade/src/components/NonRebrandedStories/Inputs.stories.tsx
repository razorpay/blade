import { Message } from './Message';

export const TextInput = (): React.ReactElement => <Message storyLink="Input/TextInput" />;
TextInput.storyName = 'TextInput';
export const PasswordInput = (): React.ReactElement => <Message storyLink="Input/PasswordInput" />;
PasswordInput.storyName = 'PasswordInput';
export const OTPInput = (): React.ReactElement => <Message storyLink="Input/OTPInput" />;
OTPInput.storyName = 'OTPInput';
export const SelectInput = (): React.ReactElement => <Message storyLink="Input/SelectInput" />;
SelectInput.storyName = 'SelectInput';

export default {
  title: 'Components/Inputs',
};
