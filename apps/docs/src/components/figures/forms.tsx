/** Figures for the Forms guide. */
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/ui/error-summary";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Arrow, Fig, Live, Note, R, Screen, Side } from "./kit";

const IC_ERROR = "Enter your IC number in the format 900101-14-5678";

/** Plate: one field, taken apart. */
export function Hero() {
  return (
    <div className="sheet sheet--pad">
      <div className="anat anat--field">
        <Live className="anat-contents">
          <Field name="ic" invalid>
            <FieldLabel>IC number</FieldLabel>
            <FieldDescription>For example, 900101-14-5678</FieldDescription>
            <Input defaultValue="900101145678" />
            <FieldError>{IC_ERROR}</FieldError>
          </Field>
        </Live>
        <Note row={1} name={<R to="field">FieldLabel</R>} />
        <Note row={2} name={<R to="field">FieldDescription</R>} />
        <Note row={3} name={<R to="input">Input</R>} />
        <Note row={4} name={<R to="field">FieldError</R>} />
      </div>
    </div>
  );
}

export function Parts() {
  return (
    <Fig caption="A form just after a failed submit, with the part that does each job.">
      <div className="anat">
        <Live className="anat-contents">
          <ErrorSummary
            title="There is a problem"
            autoFocus={false}
            errors={[
              { id: "fig-ic", message: IC_ERROR },
              { id: "fig-email", message: "Enter your email address" },
            ]}
          />
          <Field name="ic-2" invalid>
            <FieldLabel>IC number</FieldLabel>
            <Input defaultValue="900101145678" />
            <FieldError>{IC_ERROR}</FieldError>
          </Field>
          <Field name="name-2">
            <FieldLabel>Full name</FieldLabel>
            <Input defaultValue="Nur Aisyah binti Ahmad" />
          </Field>
          <div>
            <Button>Continue</Button>
          </div>
        </Live>
        <Note row={1} name={<R to="error-summary">ErrorSummary</R>}>
          Every error, linked to its field.
        </Note>
        <Note row={2} name={<R to="field">Field</R>}>
          Keeps the label, control and error together.
        </Note>
        <Note row={3} name={<R to="input">Input</R>}>
          Picks up the state of the field it sits in.
        </Note>
        <Note row={4} name={<R to="form">Form</R>}>
          Wraps it all and collects the values.
        </Note>
      </div>
    </Fig>
  );
}

function IcField({ error }: { error: string }) {
  return (
    <Live>
      <Field name="ic-m" invalid>
        <FieldLabel>IC number</FieldLabel>
        <Input defaultValue="900101145678" />
        <FieldError>{error}</FieldError>
      </Field>
    </Live>
  );
}

export function Messages() {
  return (
    <Fig caption="Tell people what to do next, and keep the label where they can always see it.">
      <div className="fig-pair">
        <Side good={false} label="Names a fault, and leaves people guessing.">
          <IcField error="Invalid input" />
        </Side>
        <Side good label="Says exactly what to enter.">
          <IcField error={IC_ERROR} />
        </Side>
        <Side
          good={false}
          label="The placeholder is pale, and it disappears on typing."
        >
          <Live>
            <Input placeholder="Email address" aria-label="Email address" />
          </Live>
        </Side>
        <Side good label="A label that stays, with a hint above the control.">
          <Live>
            <Field name="email-m">
              <FieldLabel>Email address</FieldLabel>
              <FieldDescription>
                We will send your receipt here
              </FieldDescription>
              <Input />
            </Field>
          </Live>
        </Side>
      </div>
    </Fig>
  );
}

export function Journey() {
  return (
    <Fig
      tone="plate"
      caption="One service from question to confirmation, with sample data."
    >
      <div className="fig-cascade">
        <Screen
          id="react-app-citizen-examples--Application"
          title="A question page in a long application"
        />
        <Screen
          id="react-app-citizen-examples--CheckYourAnswers"
          title="A page for checking answers before submitting"
        />
        <Screen
          id="react-app-citizen-examples--Submitted"
          title="A confirmation page after submitting"
        />
      </div>
      <div className="fig-steps">
        <R to="form-step">FormStep</R>
        <Arrow />
        <R to="check-answers">CheckAnswers</R>
        <Arrow />
        <R to="confirmation-panel">ConfirmationPanel</R>
      </div>
    </Fig>
  );
}
