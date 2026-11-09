/** The Forms guide's complete example, running. */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Callout, CalloutTitle } from "@/components/ui/callout";
import { ErrorSummary } from "@/components/ui/error-summary";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Errors = Record<string, string>;

function validate(values: Record<string, unknown>): Errors {
  const errors: Errors = {};
  const ic = String(values.ic ?? "");
  if (!ic) errors.ic = "Enter your IC number";
  else if (!/^\d{6}-\d{2}-\d{4}$/.test(ic))
    errors.ic = "Enter your IC number in the format 900101-14-5678";
  if (!values.email) errors.email = "Enter your email address";
  return errors;
}

export default function FormDemo() {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const list = Object.entries(errors).map(([id, message]) => ({ id, message }));

  return (
    <figure className="fig fig--sheet">
      <div className="fig-body">
        <div data-density="comfortable">
          <Form
            className="gap-stack-lg flex max-w-xl flex-col"
            errors={errors}
            onFormSubmit={(values) => {
              const found = validate(values);
              setErrors(found);
              setDone(Object.keys(found).length === 0);
            }}
          >
            {list.length > 0 && (
              <ErrorSummary title="There is a problem" errors={list} />
            )}
            {done && (
              <Callout variant="success">
                <CalloutTitle>Your details are valid</CalloutTitle>
              </Callout>
            )}
            <Field name="ic">
              <FieldLabel>IC number</FieldLabel>
              <FieldDescription>For example, 900101-14-5678</FieldDescription>
              <Input id="ic" inputMode="numeric" autoComplete="off" />
              <FieldError />
            </Field>
            <Field name="email">
              <FieldLabel>Email address</FieldLabel>
              <Input id="email" type="email" autoComplete="off" />
              <FieldError />
            </Field>
            <Button type="submit" className="w-fit">
              Continue
            </Button>
          </Form>
        </div>
      </div>
      <figcaption>
        This form is running. Press Continue with the fields empty to see the
        errors.
      </figcaption>
    </figure>
  );
}
