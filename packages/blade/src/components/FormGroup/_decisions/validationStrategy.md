Research & Scoping: Form Validation Strategy:

## Overview
This document outlines the validation strategy for the FormGroup component in Blade. The goal is to provide a flexible, type-safe, and easy-to-use validation system that can work with various validation libraries while maintaining consistency across different dashboards.


## Quick Summary
Option
Pros
Cons
Best For
Adapter Pattern
Library-agnostic, scalable, easy to swap libraries later
Need to build/maintain adapter per library
Large apps using multiple validation libraries or abstractions
Context-based
Simple to implement for local forms, enables real-time validation
Harder to standardize across large apps or complex forms
Small/medium forms where validation is contextually scoped
Registry-based
Supports dynamic, per-field validation, flexible for complex forms
Slightly more complex to implement and manage state
Forms with dynamic fields or conditional validation rules
Simple function-based
Max flexibility, least overhead, no additional dependencies, Teams maintain full control


No built-in type safety, validation logic can get scattered
Small apps or isolated forms with minimal validation needs
Native Solutions are Sufficient
Leverages built-in HTML5 validation APIs (required, pattern, etc.), minimal code overhead, Teams maintain full control
Limited customization, no async validation, poor UX control
Basic forms with simple constraints and no complex business rules


## Current State Analysis
### Existing Implementation
- Individual input components (`TextInput`, `TextArea`, etc.) have their own validation states
- No centralized form validation context
- Each form implementation handles validation independently
- Mixed validation approaches across different dashboards:
  - Merchant Dashboard: Uses Yup
  - Admin Dashboard: Uses function-based validation


Evaluation of Validation Libraries

Criteria for Selection:
- Bundle size (<5KB)
- TypeScript support
- Active maintenance
- Performance
- Learning curve

Top Candidates:

1. Zod (~5.6KB)
  - Pros:
    - First-class TypeScript support
    - Runtime type checking
    - Rich validation primitives
  - Cons:
    - Steeper learning curve

2. Yup (~23KB)
  - Pros:
    - Familiar API
    - Rich ecosystem
    - Good documentation
  - Cons:
    - Larger bundle size
    - TypeScript support added later

3. Vest (~12KB)
  - Pros:
    - Test-like syntax
    - Unit testing approach
    - Good for complex validations
  - Cons:
    - Less popular
    - Different mental model

4. Custom Validator Functions
  - Pros:
    - Zero additional bundle size
    - Maximum flexibility
    - Simple to understand
  - Cons:
    - No built-in type inference
    - More boilerplate
    - Inconsistent implementations

Current Usage in Razorpay:
 - Merchant Dashboard: Uses Yup + Formilk
 - Admin Dashboard: Uses custom function validation
 - No standardization across products


```tsx
// Example: Different approaches currently used
// Merchant Dashboard (Yup)
const tncValidattionSchema = Yup.object().shape({
 support_email: Yup.string()
   .email('Please enter a valid email id.')
   .required('Support email is a required field')
   .nullable(),
 shipping_period: Yup.string().required('Shipping time is a required field').nullable(),
 refund_request_period: Yup.string()
   .required('Refund request time is a required field')
   .nullable(),
 refund_process_period: Yup.string()
   .required('Refund process time is a required field')
   .nullable(),
 warranty_period: Yup.string().required('Warranty time is a required field').nullable(),
});


// Admin Dashboard (Function)
const validate = (values) => {
 const errors = {};
 if (!values.name) errors.name = 'Required';
 if (!isValidEmail(values.email)) errors.email = 'Invalid email';
 return errors;
};


    export const FIELD_VALIDATION = {
      alphanumeric: '^[a-zA-Z0-9]+$',
      number: '^[0-9]+$',
      alphabet: '^[a-zA-Z]+$',
      amount: '^d+(.d{1,2})?$',
      date: '^d{4}-d{2}-d{2}$',
      string: '^[a-zA-Z0-9\\s\\W]+$'
    };
```


## Validation Strategy Options

### Option 1: Generic Validation Adapter Pattern

The Adapter Pattern is needed because different validation libraries have different APIs for validation:
- Yup uses `schema.validate()`
- Zod uses `schema.parse()`
- Joi uses `schema.validate()`
- etc.

Without an adapter, we would need to handle each library's specific API in our FormGroup component, making it tightly coupled to specific libraries. The adapter pattern:
1. Provides a consistent interface (`validate` and `getErrors`)
2. Abstracts away library-specific validation calls
3. Makes it easy to add support for new validation libraries
4. Keeps the FormGroup component library-agnostic

- Validates entire form at once
  - Uses a single schema
  - Good for simple forms
  - Validates on form submission



**Generic Validation Layer:**
```typescript
// 1. Define the adapter interfaces
interface ValidationAdapter<T> {
 validate: (values: T) => Promise<ValidationResult>;
 getErrors: (values: T) => Record<string, string>;
}


interface ValidationResult {
 isValid: boolean;
 errors: Record<string, string>;
}
type ValidationStrategy = ValidationAdapter<any>;


// 2. Create adapters for different validation libraries


// Yup Adapter
const createYupAdapter = (schema: any): ValidationAdapter<any> => ({
 validate: async (values) => {
   try {
     await schema.validate(values, { abortEarly: false });
     return { isValid: true, errors: {} };
   } catch (err) {
     const errors = {};
     err.inner.forEach((error) => {
       errors[error.path] = error.message;
     });
     return { isValid: false, errors };
   }
 },
 getErrors: (values) => {
   try {
     schema.validateSync(values, { abortEarly: false });
     return {};
   } catch (err) {
     const errors = {};
     err.inner.forEach((error) => {
       errors[error.path] = error.message;
     });
     return errors;
   }
 },
});


// Zod Adapter
const createZodAdapter = (schema: any): ValidationAdapter<any> => ({
 validate: async (values) => {
   try {
     await schema.parseAsync(values);
     return { isValid: true, errors: {} };
   } catch (err) {
     const errors = {};
     err.errors.forEach((error) => {
       errors[error.path.join('.')] = error.message;
     });
     return { isValid: false, errors };
   }
 },
 getErrors: (values) => {
   try {
     schema.parse(values);
     return {};
   } catch (err) {
     const errors = {};
     err.errors.forEach((error) => {
       errors[error.path.join('.')] = error.message;
     });
     return errors;
   }
 },
});


function createValidationAdapter(config: {
type: 'yup' | 'zod' | 'function';
schema?: any;
validate?: (values: any) => any;
}): ValidationStrategy {
switch (config.type) {
  case 'yup':
    return new createYupAdapter(config.schema); // Resolver
  case 'zod':
    return new createZodAdapter(config.schema);
  case 'function':
    return new FunctionAdapter(config.validate);
}
}




// Usage in FormGroup
function FormGroup({
validation,
children,
...props
}: FormGroupProps) {
const validator = useMemo(() =>
  createValidationAdapter(validation),
  [validation]
);




// FormGroup implementation
}
```




// Usage Example
const MyForm = () => {


 return (
   <FormGroup
      validation={{
      type: 'yup', // zod
      schema: yup.object({
        name: yup.string().required(),
        email: yup.string().email()
      })
    }}
     onSubmit={(values) => console.log(values)}
   >
     <FormField name="name">
       <TextInput label="Name" />
     </FormField>
     <FormField name="email">
       <TextInput label="Email" />
     </FormField>
   </FormGroup>
 );
};
```






// 2. With Function Validation
function UserForm() {
 return (
   <FormGroup
     validation={{
       type: 'function',
       validate: (values) => {
         // Custom validation logic
         return errors;
       }
     }}
   >
     <TextField name="name" label="Name" />
     <TextField name="email" label="Email" />
   </FormGroup>
 );
}
```


Why adapter?
Each of these libraries has its own API and method signatures, which makes it challenging for our form component to interact with them uniformly.
To solve this, we're using the Adapter Pattern — a structural design pattern that allows objects with incompatible interfaces to work together by translating one interface into another.
How It Helps:
It abstracts away the differences between various validation libraries.
Our form component can now interact with a single, consistent interface:

validator.validate(values)
validator.validateField(name, value)
This makes our form logic library-agnostic, cleaner, and more maintainable.


 Example:
If the form calls validator.validate(values):
If it’s a YupAdapter, it internally runs Yup’s .validate().


If it’s a ZodAdapter, it internally runs Zod’s .safeParse().


If it’s a FunctionAdapter, it runs your custom validation function.

Cons of This Approach
An adapter must be created for every new validation library or strategy we want to support.


✅ If you want to add Joi or Superstruct later — you’ll need to write a JoiAdapter.


### Option 2: Function-Based Validation with Context
This pattern is best suited for:
- Forms that need real-time validation feedback
- Forms with complex validation logic that changes based on form state
- Teams that want to maintain validation logic within React components
- Forms that need to share validation state across multiple components

```typescript
// 1. Define the context
interface FormValidationContext {
 validate: (values: any) => Promise<boolean>;
 errors: Record<string, string>;
 setErrors: (errors: Record<string, string>) => void;
}


const FormValidationContext = createContext<FormValidationContext>({
 validate: async () => true,
 errors: {},
 setErrors: () => {},
});


// 2. Create the FormGroup component
const FormGroup = ({ children, validation }: FormGroupProps) => {
 const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = async (values: any) => {
   const result = await validation(values);
   setErrors(result.errors);
   return result.isValid;
 };


 return (
   <FormValidationContext.Provider value={{ validate, errors, setErrors }}>
     {children}
   </FormValidationContext.Provider>
 );
};


// 3. Create a hook to use the context
const useFormValidation = () => {
 const context = useContext(FormValidationContext);
 if (!context) {
   throw new Error('useFormValidation must be used within a FormGroup');
 }
 return context;
};


// 4. Usage Example
const MyForm = () => {
 const validation = async (values: any) => {
   const errors = {};
  
   if (!values.name) {
     errors.name = 'Name is required';
   }
  
   if (!values.email) {
     errors.email = 'Email is required';
   } else if (!isValidEmail(values.email)) {
     errors.email = 'Invalid email format';
   }
  
   return {
     isValid: Object.keys(errors).length === 0,
     errors
   };
 };


 return (
   <FormGroup validation={validation}>
     <FormField name="name">
       <TextInput label="Name" />
     </FormField>
     <FormField name="email">
       <TextInput label="Email" />
     </FormField>
   </FormGroup>
 );
};


// 5. Field Component Example
const TextInput = ({ name, label, ...props }) => {
 const { errors } = useFormValidation();
  return (
   <div>
     <label>{label}</label>
     <input name={name} {...props} />
     {errors[name] && <span className="error">{errors[name]}</span>}
   </div>
 );
};
```




### Option 3: Hybrid Approach with Validation Registry

 - Validates individual fields
  - Can have different validation rules per field
  - Supports field dependencies
  - Can validate in real-time
  - Good for complex forms with dynamic rules

```typescript
// 1. Define the registry interfaces
interface Validator {
 validate: (value: any) => Promise<ValidationResult>;
}


interface ValidationRegistry {
 register: (name: string, validator: Validator) => void;
 unregister: (name: string) => void;
 validate: (name: string, value: any) => Promise<ValidationResult>;
}


// 2. Create the registry
const createValidationRegistry = (): ValidationRegistry => {
 const validators = new Map<string, Validator>();
  return {
   register: (name, validator) => validators.set(name, validator),
   unregister: (name) => validators.delete(name),
   validate: async (name, value) => {
     const validator = validators.get(name);
     if (!validator) return { isValid: true, errors: {} };
     return validator.validate(value);
   },
 };
};


// 3. Create validators
const createYupValidator = (schema: any): Validator => ({
 validate: async (value) => {
   try {
     await schema.validate(value);
     return { isValid: true, errors: {} };
   } catch (err) {
     return {
       isValid: false,
       errors: { [err.path]: err.message }
     };
   }
 },
});


// 4. Usage Example
const MyForm = () => {
 const registry = useMemo(() => createValidationRegistry(), []);
  // Register validators
 useEffect(() => {
   const nameSchema = yup.string().required('Name is required');
   const emailSchema = yup.string().email('Invalid email').required('Email is required');
  
   registry.register('name', createYupValidator(nameSchema));
   registry.register('email', createYupValidator(emailSchema));
  
   return () => {
     registry.unregister('name');
     registry.unregister('email');
   };
 }, [registry]);


 return (
   <FormGroup validation={registry}>
     <FormField name="name">
       <TextInput label="Name" />
     </FormField>
     <FormField name="email">
       <TextInput label="Email" />
     </FormField>
   </FormGroup>
 );
};
```















### Option 4: Simple Function-Based Validation (Recommended)

This approach provides maximum flexibility by allowing users to pass their own validation function, regardless of the validation library they use. The FormGroup only cares about the error structure returned.





```typescript
interface ValidationResult {
 isValid: boolean;
 errors: Record<string, string>;
}


interface FormGroupProps {
 children: React.ReactNode;
 validate?: (formData: Record<string, any>) => ValidationResult | Promise<ValidationResult>;
 onSubmit?: (values: any) => void;
 onError?: (errors: Record<string, string>) => void;
 showToast?: boolean;
 blockSubmit?: boolean;
}


// Usage Examples:


// 1. Using Yup
const yupSchema = yup.object({
 name: yup.string().required(),
 email: yup.string().email().required(),
});


<FormGroup
 validate={async (formData) => {
   try {
     await yupSchema.validate(formData, { abortEarly: false });
     return { isValid: true, errors: {} };
   } catch (err) {
     const errors = {};
     err.inner.forEach((error) => {
       errors[error.path] = error.message;
     });
     return { isValid: false, errors };
   }
 }}
>
 <TextInput label="Name" />
 <TextInput label="Email" />
</FormGroup>


// 2. Using Zod
const zodSchema = z.object({
 name: z.string().min(1),
 email: z.string().email(),
});


<FormGroup
 validate={(formData) => {
   try {
     zodSchema.parse(formData);
     return { isValid: true, errors: {} };
   } catch (err) {
     const errors = {};
     err.errors.forEach((error) => {
       errors[error.path.join('.')] = error.message;
     });
     return { isValid: false, errors };
   }
 }}
>
 <TextInput label="Name" />
 <TextInput label="Email" />
</FormGroup>


// 3. Using Custom Function
<FormGroup
 validate={(formData) => {
   const errors = {};
  
   if (!formData.name) {
     errors.name = 'Name is required';
   }
  
   if (!formData.email) {
     errors.email = 'Email is required';
   } else if (!isValidEmail(formData.email)) {
     errors.email = 'Invalid email format';
   }
  
   return {
     isValid: Object.keys(errors).length === 0,
     errors
   };
 }}
>
 <TextInput label="Name" />
 <TextInput label="Email" />
</FormGroup>
```

### Benefits of This Approach


1. **Maximum Flexibility**
  - Users can use any validation library they prefer
  - No need to create adapters for different libraries
  - Easy to switch between validation libraries


2. **Simple Interface**
  - FormGroup only cares about the error structure
  - Clear contract between FormGroup and validation function
  - Easy to understand and implement


3. **No Additional Dependencies**
  - FormGroup doesn't need to know about specific validation libraries
  - Users can bring their own validation solution
  - Smaller bundle size for FormGroup


4. **Easy Migration**
  - Existing validation logic can be wrapped in the validate function
  - No need to rewrite validation rules
  - Gradual adoption possible


### Implementation Details


```typescript
const FormGroup = ({ children, validate, onSubmit, onError, showToast, blockSubmit }: FormGroupProps) => {
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (formData: Record<string, any>) => {
   if (!validate) {
     onSubmit?.(formData);
     return;
   }


   setIsSubmitting(true);
   try {
     const result = await validate(formData);
     setErrors(result.errors);
    
     if (result.isValid) {
       onSubmit?.(formData);
     } else {
       onError?.(result.errors);
       if (showToast) {
         // Show toast with first error
         const firstError = Object.values(result.errors)[0];
         showErrorToast(firstError);
       }
     }
   } finally {
     setIsSubmitting(false);
   }
 };


 return (
   <FormValidationContext.Provider value={{ errors, isSubmitting }}>
     <form onSubmit={handleSubmit}>
       {children}
     </form>
   </FormValidationContext.Provider>
 );
};
```


### Field-Level Integration


```typescript
const TextInput = ({ name, label, ...props }) => {
 const { errors } = useFormValidation();
  return (
   <div>
     <label>{label}</label>
     <input name={name} {...props} />
     {errors[name] && <span className="error">{errors[name]}</span>}
   </div>
 );
};
```


## Proposed API Design


```typescript
interface FormGroupProps {
 // Required props
 children: React.ReactNode;
  // Optional props
 validation?: ValidationAdapter<any> | ((values: any) => Promise<ValidationResult>);
 onSubmit?: (values: any) => void;
 onError?: (errors: Record<string, string>) => void;
 showToast?: boolean;
 blockSubmit?: boolean;
}


interface FormFieldProps {
 name: string;
 children: React.ReactNode;
 validate?: (value: any) => Promise<ValidationResult>;
}


// Usage Example
const MyForm = () => {
 const validation = createYupAdapter(yup.object({
   email: yup.string().email().required(),
   password: yup.string().min(8).required(),
 }));


 return (
   <FormGroup
     validation={validation}
     showToast
     blockSubmit
     onSubmit={(values) => console.log(values)}
   >
     <FormField name="email">
       <TextInput label="Email" />
     </FormField>
     <FormField name="password">
       <PasswordInput label="Password" />
     </FormField>
   </FormGroup>
 );
};
```




## Pros and Cons


### Pros
1. Centralized validation logic
2. Consistent error handling
3. Reusable validation adapters
4. Flexible integration with existing code
5. Type-safe validation
6. Reduced boilerplate


### Cons
1. Additional abstraction layer
2. Learning curve for new patterns
3. Potential performance impact
4. Need to maintain multiple validation adapters
5. Migration effort for existing forms








Research Findings

1. Current Ecosystem Analysis
  - Diverse Ecosystem
  - Merchant Dashboard: Uses Yup + Formik
  - Admin Dashboard: Custom validation with regex patterns
  - Different teams have different validation needs and patterns
  - No standardization across products (and that's okay)

2. Validation Libraries Evaluated
  - Yup (~23KB): Used in Merchant Dashboard
  - Zod (~5.6KB): Modern TypeScript-first approach
  - Custom Functions: Used in Admin Dashboard
  - Each has its own benefits for different use cases

3. Key Insights
  - Teams have established working validation solutions
  - Validation needs vary significantly by product
  - Field names and rules are highly domain-specific
  - No one-size-fits-all validation solution

Verdict: Option 4: Simple Function-Based Validation or No Form Infrastructure Needed

Option 4 example given above or 

Native Solutions are Sufficient
  ```tsx
  // Simple, flexible, native approach
  <form onSubmit={handleSubmit}>
    <Box gap="spacing.4">
      <TextField
        name="email"
        validation={teamValidation}
        error={teamError}
      />
      <Button type="submit">Submit</Button>
    </Box>
  </form>
  ```


1. **Benefits of This Approach**
  - Teams maintain full control over validation
  - No unnecessary abstractions
  - Reduced maintenance burden
  - No migration needed
  - Smaller bundle size
  - Simpler mental model

2. **Validation Ownership**
  - Teams choose their validation libraries
  - Teams handle their validation logic
  - Teams manage their error states
  - Teams control their schemas

 Why Option 4: Simple Function-Based Validation or No Form Infrastructure Needed
 
1. **Current Landscape at Razorpay**
  - Merchant Dashboard: Uses Yup + Formik
  - Admin Dashboard: Custom validation with regex patterns
  - No standardization across products
  - Teams have established validation patterns

2. **Why Not Provide Validation Implementation**

  #### Cons of Providing Validation:
  - **Schema Complexity**
    - Field names vary greatly across products (e.g., `support_email` vs `email`)
    - Validation rules are often domain-specific
    - Would result in a bloated, hard-to-maintain schema library
 
  - **Redundant Abstraction**
    - If teams need to define their schema anyway, our validation layer adds unnecessary complexity
    - Teams would still need to understand validation libraries to define schemas
 
  - **Mixed Usage Issues**
    - Partial usage (some fields using our validation, others custom) creates confusion
    - Inconsistent error handling between built-in and custom validation
 
  - **Maintenance Burden**
    - Need to keep up with all validation use cases
    - Regular updates for new field types
    - Version management for different validation rules


