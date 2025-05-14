const FormGroupStoryCode = `import React from 'react';
import {
  Box,
  Heading,
  TextInput,
  PasswordInput,
  Button,
  ArrowRightIcon,
  Alert,
} from '@razorpay/blade/components';

const FormExample = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [alert, setAlert] = React.useState<{
    type: 'positive' | 'negative' | null;
    title: string;
    description: string;
  } | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setAlert({
        type: 'positive',
        title: 'Success!',
        description: 'Your form has been submitted successfully.',
      });
    } else {
      setAlert({
        type: 'negative',
        title: 'Form Submission Failed',
        description: 'Please fix the errors in the form and try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
        <Box>
          <Heading size="large">Welcome to Blade Example</Heading>
          <Heading size="medium" weight="regular">
            This is an example form built with Blade
          </Heading>
        </Box>

        {alert && (
          <Alert
            color={alert.type}
            title={alert.title}
            description={alert.description}
            emphasis="subtle"
            isDismissible
            onDismiss={() => setAlert(null)}
          />
        )}

        <Box display="flex" flexDirection="column" gap="spacing.4">
          <TextInput
            isRequired
            label="Email"
            name="email"
            value={formData.email}
            onChange={({ value }) => handleChange('email', value)}
            validationState={errors.email ? 'error' : 'none'}
            errorText={errors.email}
          />
          <PasswordInput
            isRequired
            label="Password"
            name="password"
            value={formData.password}
            onChange={({ value }) => handleChange('password', value)}
            helpText="Should be more than 8 characters"
            validationState={errors.password ? 'error' : 'none'}
            errorText={errors.password}
          />
          <Button isFullWidth type="submit" icon={ArrowRightIcon} iconPosition="right">
            Sign In
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default FormExample;

`;

export { FormGroupStoryCode };
