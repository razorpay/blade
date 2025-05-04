FormGroup Error Wrapper Decision Doc

What’s the Idea?
A FormGroup Error wrapper component that standardizes form error handling by:
Accepts errors from form libraries (Formik, React Hook Form, etc.)
Consumes them in a standardized way
Displaying form-level errors via Alert or custom component
Renders form fields (children) underneath the error display

API Decision
Direct Error Display
<Formik>
{({errors}) => (
<Form>
{errors && <Alert color="negative" description={errors} />}
<TextInput />
</Form>
)}
</Formik>

Wrapper Component

interface FormErrorProps {
error: Record<string, any>;
children: React.ReactNode;
errorComponent?: React.ComponentType<{error: any}>;
errorText?: string;
}
<Formik>
{({errors}) => (
<Form>
<FormError error={errors} errorComponent={<Text>Error in the submitted form</Text>}>
// or <FormError error={errors} errorText=”Error in submitted form”>
<TextInput ... />
</FormError>
</Form>
)}
</Formik>

Note: errorComponent, errorText is optional if not passed we will show Alert for consistency but can give user flexibility to pass component or text

Pros & Cons of FormErrorWrapper

✅ Pros
❌ Cons
DRY — eliminates repetitive error alert logic across forms
Introduces an extra wrapper component in the tree
Centralized, consistent error display config and UX styling
Slight additional cognitive overhead
Easier to update global error handling in one place
Might be unnecessary overhead for simple forms
Scalable — easily integrates with multiple form libraries (Formik, RHF, etc.)
Relies on predictable error object structures
Promotes cleaner, focused form component code
Adds minor indirection when debugging error flow

Cons: Do We Really Need a Wrapper Component?
User Can Opt-Out — Since the user can always choose not to use the wrapper and instead manually handle error display with greater flexibility (using direct error display), the question arises: Do we really need an additional layout component?

Overhead for Simpler Forms — For simpler forms or where maximum flexibility is needed, using the wrapper might feel like unnecessary overhead. Developers could handle errors more directly without relying on a standardized layout component

Trade-offs to Consider:

1. Standardization vs Flexibility

- Wrapper provides consistent error handling
- Direct implementation offers more control

2. Development Speed vs Control

- Wrapper accelerates development
- Direct handling allows custom implementations

.When to Use FormErrorWrapper
✅ Recommended For:
Complex forms with multiple fields
Forms needing consistent error handling UX
When a global form error state or summary alert is required
Enterprise-grade applications where standardized form patterns are important

❌ Not Recommended For:
Simple single or two-field forms
Forms with intentionally unique or custom error handling (like toast, tooltips)
Highly flexible forms where error display varies heavily between fields

Working example:
FormError.tsx
import React from "react";
import { Alert } from "@razorpay/blade/components";

interface FormErrorProps {
error?: any;
children: React.ReactNode;
errorComponent?: React.ComponentType<{error: any}>;
errorText?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error, children, errorComponent }) => {
const hasError = Object.keys(error).length > 0;

return (

   <div>
     {hasError && (
      errorComponent ? (
	  errorComponent 
) :(
         <Alert
          color="negative"
          marginTop="spacing.2"
          description={errorText ||  "There are issues with the details you’ve entered"}
          isDismissible={false}
        />
       )
     )}
     {children}
   </div>
 );
};
Formik + FormError
import React from "react";
import { Formik, Form } from "formik";
import { FormError } from "./FormError.tsx";
import { TextInput, Button } from "@razorpay/blade/components";
import * as Yup from "yup";

export const FormikExample = () => {
const validationSchema = Yup.object().shape({
email: Yup.string()
.email("Please enter a valid email id.")
.required("Contact Email is a required field.")
.nullable(),
name: Yup.string()
.min(5, "Name must be at least 5 characters")
.required("Name is a required field.")
.nullable(),
});

const handleSubmit = (values, { setSubmitting }) => {
// Formik runs internal validation (this.runValidations()) before invoking onSubmit.
// By default, if errors are present, the form submission is blocked.
console.log("Form submitted:", values);
setSubmitting(false);

Or
// To allow form submission even with errors, we manually invoke validateForm and bypass blocking logic.
// Manually validate the form and allow submission regardless of errors

validateForm().then((errors) => {
if (Object.keys(errors).length === 0) {
console.log("Form submitted:", values);
setSubmitting(false); // Proceed with submission if no errors
} else {
setSubmitting(false); // Stop loading, but form is still submitted with errors
console.log("Form has errors but was submitted anyway.");
}
});
};

return (
<Formik
initialValues={{ email: "", name: "" }}
onSubmit={handleSubmit} // Blocks handle submit if errors present internally formik runs this.runvalidations() on click
validationSchema={validationSchema}
validateOnChange={false}
validateOnBlur={true}

>

     {({
       errors,
       touched,
       setFieldValue,
       setFieldTouched,
       values,
       isSubmitting,
     }) => (
       <Form>


         <FormError error={errors}>
           Alternative :  // {Object.keys(error).length > 0 && <Alert  color="negative"
          marginTop="spacing.2"
          description="There are issues with the details you’ve entered"
          isDismissible={false} />}


           <TextInput
             label="Name"
             type="text"
             name="name"
             value={values.name}
             onChange={(e) => {
               const value = e?.value || "";
               setFieldValue("name", value, false);
             }}
             onBlur={() => {
               setFieldTouched("name", true, true);
             }}
             validationState={touched.name && errors.name ? "error" : "none"}
             errorText={touched.name ? errors.name : undefined}
             marginBottom="spacing.4"
           />
           <TextInput
             label="Email"
             type="email"
             name="email"
             value={values.email}
             onChange={(e) => {
               const value = e?.value || "";
               setFieldValue("email", value, false);
             }}
             onBlur={() => {
               setFieldTouched("email", true, true);
             }}
             validationState={touched.email && errors.email ? "error" : "none"}
             errorText={touched.email ? errors.email : undefined}
             marginBottom="spacing.4"
           />
           <Button type="submit" isLoading={isSubmitting} variant="primary">
             Submit
           </Button>
         </FormError>
       </Form>
     )}

   </Formik>
 );
};

React hook form + FormError
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "./FormError.tsx";
import { TextInput, Button } from "@razorpay/blade/components";
import { yupResolver } from "@hookform/resolvers/yup";
import \* as yup from "yup";

export const ReactHookFormExample = () => {
const validationSchema = yup.object().shape({
email: yup
.string()
.email("Please enter a valid email id.")
.required("Contact Email is a required field."),
name: yup
.string()
.min(5, "Name must be at least 5 characters")
.required("Name is a required field."),
});

const {
register,
handleSubmit,
formState: { errors, isSubmitting, touchedFields },
setValue,
trigger,
} = useForm({
defaultValues: {
email: "",
name: "",
},
mode: "onBlur",
resolver: yupResolver(validationSchema),
});

const onSubmit = async (data) => {
console.log("Form submitted:", data);
};

return (
{/_
Note: handleSubmit internally runs validation via the yupResolver before invoking onSubmit.
If any field has validation errors, it populates the 'errors' object and prevents onSubmit from being called.
This is by design to avoid processing invalid form data.
_/}

   <form onSubmit={handleSubmit(onSubmit)}>

     <FormError error={errors}>  Alternative :  // {Object.keys(error).length > 0 && <Alert  color="negative"
          marginTop="spacing.2"
          description="There are issues with the details you’ve entered"
          isDismissible={false} />}




       <TextInput
         label="Name"
         type="text"
         {...register("name")}
         onChange={(e) => {
           const value = e?.value || "";
           setValue("name", value, {
             shouldValidate: true,
             shouldTouch: true,
           });
         }}
         onBlur={() => trigger("name")}
         validationState={touchedFields.name && errors.name ? "error" : "none"}
         errorText={
           touchedFields.name && errors.name ? errors.name?.message : undefined
         }
         marginBottom="spacing.4"
       />


       <TextInput
         label="Email"
         type="email"
         {...register("email")}
         onChange={(e) => {
           const value = e?.value || "";
           setValue("email", value, {
             shouldValidate: true,
             shouldTouch: true,
           });
         }}
         onBlur={() => trigger("email")}
         validationState={
           touchedFields.email && errors.email ? "error" : "none"
         }
         errorText={
           touchedFields.email && errors.email
             ? errors.email?.message
             : undefined
         }
         marginBottom="spacing.4"
       />


       <Button type="submit" isLoading={isSubmitting} variant="primary">
         Submit
       </Button>
     </FormError>

   </form>
 );
};

Enhanced FormError Wrapper- Prevents Missing Validation States on Individual Form Fields

Iterates over children
Clones fields like TextInput
Adds validationState and errorText from error object if missing
Displays form-level Alert if errors exist

Caveat:
Needs explicit mapping/handling for different form field types (Checkbox, Select, etc.)
Slight maintenance overhead as form component types grow

import { Alert, TextInput } from "@razorpay/blade/components";
import React, { Children, cloneElement, isValidElement } from "react";  
interface FormErrorProps {
error?: Record<string, any>;
children: React.ReactNode;
errorComponent?: React.ComponentType<{ error: any }>;
}

export const FormError2: React.FC<FormErrorProps> = ({
error = {},
children,
errorComponent: ErrorComponent,
}) => {
const hasError = Object.keys(error).length > 0;
const enhancedChildren = Children.map(children, (child) => {
if (!isValidElement(child)) return child;

if (child.type === TextInput) { // or switch case to handle diff type
const fieldName = child.props.name;
if (!fieldName) return child;

     return cloneElement(child, {
       validationState: error[fieldName] ? "error" : "none",
       errorText: error[fieldName],
       ...child.props,
     });

}

return child;
});

return (

   <div>
     {hasError && (
       <Alert
         color="negative"
         marginTop="spacing.2"
         description="There are issues with the details you’ve entered"
         isDismissible={false}
       />
     )}
     {enhancedChildren}
   </div>
 );
}

Cons
Needs explicit handling for different input types (TextInput, Checkbox, RadioGroup, etc.)
Increases maintenance overhead as new form components are added
Need to maintain a whitelist/mapping of supported components
