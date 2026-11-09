/** Figures for the Conventions guide. */
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/ui/error-summary";
import { Arrow, Fig, Live, R, Screen, Side } from "./kit";

function Part({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="part">
      <R to="dialog">{name}</R>
      {children}
    </div>
  );
}

/** Plate: a dialog with its parts showing. */
export function Hero() {
  return (
    <div className="sheet sheet--pad sheet--free">
      <Part name="DialogBody">
        <Part name="DialogHeader">
          <Part name="DialogTitle">
            <p className="text-title text-txt-black-900 font-semibold">
              Withdraw this application?
            </p>
          </Part>
          <Part name="DialogDescription">
            <p className="text-content text-txt-black-700">
              You will need to start again to apply.
            </p>
          </Part>
        </Part>
        <Part name="DialogFooter">
          <Live className="flex flex-wrap justify-end gap-2">
            <Button variant="default-outline">Keep application</Button>
            <Button variant="danger-fill">Withdraw application</Button>
          </Live>
        </Part>
      </Part>
    </div>
  );
}

export function Render() {
  const rows = [
    {
      code: "<Button>",
      output: "<button>",
      button: <Button>Continue</Button>,
      note: "On its own, a button.",
    },
    {
      code: "render={<a href />}",
      output: "<a>",
      button: <Button>Start now</Button>,
      note: "A link that looks like a button.",
    },
    {
      code: "render={<Link to />}",
      output: "Your router",
      button: <Button>Open case</Button>,
      note: "Navigation through your router.",
    },
  ];
  return (
    <Fig caption="The look and behaviour stay the same. Only the element underneath changes.">
      <div className="renders">
        {rows.map((row) => (
          <div key={row.code} className="render-row">
            <code>{row.code}</code>
            <Arrow />
            <Live>{row.button}</Live>
            <Arrow />
            <code className="render-out">{row.output}</code>
            <p>{row.note}</p>
          </div>
        ))}
      </div>
    </Fig>
  );
}

export function State() {
  return (
    <Fig
      tone="well"
      caption="Leave state to the component until your code needs to read or change it."
    >
      <div className="states">
        <div>
          <h3>Uncontrolled</h3>
          <div className="state-flow">
            <div className="state-box state-box--quiet">
              <code>defaultValue</code>
              <span>Where it starts</span>
            </div>
            <Arrow />
            <div className="state-box state-box--on">
              <strong>Component</strong>
              <span>Holds the value</span>
            </div>
          </div>
        </div>
        <div>
          <h3>Controlled</h3>
          <div className="state-flow">
            <div className="state-box state-box--on">
              <strong>Your state</strong>
              <span>Holds the value</span>
            </div>
            <div className="state-arrows">
              <Arrow label="value" />
              <Arrow label="onValueChange" flip />
            </div>
            <div className="state-box state-box--quiet">
              <strong>Component</strong>
              <span>Shows it, reports changes</span>
            </div>
          </div>
        </div>
      </div>
    </Fig>
  );
}

export function Classes() {
  return (
    <Fig
      caption={
        <>
          Use <code>className</code> to place a component. Use{" "}
          <code>variant</code> and <code>size</code> to change how it looks.
        </>
      }
    >
      <div className="fig-pair">
        <Side
          good
          label={
            <>
              <code>className="w-full"</code> sets the layout.
            </>
          }
        >
          <Live>
            <Button className="w-full">Continue</Button>
          </Live>
        </Side>
        <Side good={false} label="Recolouring loses dark mode and consistency.">
          <Live>
            <Button className="w-full rounded-none bg-emerald-700 hover:bg-emerald-800">
              Continue
            </Button>
          </Live>
        </Side>
      </div>
    </Fig>
  );
}

export function Language() {
  const pair = [
    {
      lang: "English",
      title: "There is a problem",
      message: "Enter your IC number",
    },
    {
      lang: "Bahasa Melayu",
      title: "Terdapat masalah",
      message: "Masukkan nombor MyKad anda",
    },
  ];
  return (
    <Fig caption="The same component, with its built-in text passed in.">
      <div className="fig-pair">
        {pair.map((item) => (
          <div key={item.lang} className="fig-side">
            <p className="fig-lang">{item.lang}</p>
            <Live>
              <ErrorSummary
                title={item.title}
                autoFocus={false}
                errors={[{ id: "ic", message: item.message }]}
              />
            </Live>
          </div>
        ))}
      </div>
    </Fig>
  );
}

export function Blocks() {
  return (
    <Fig
      tone="plate"
      caption={
        <>
          A whole sign-in screen from <R to="sign-in-form">SignInForm</R>, with
          sample data.
        </>
      }
    >
      <div className="fig-wide-screen">
        <Screen
          id="react-app-access-examples--SignIn"
          title="A sign-in screen built from a block"
        />
      </div>
    </Fig>
  );
}

export function Avoid() {
  return (
    <Fig>
      <div className="fig-pair">
        <Side good={false} label="Two filled buttons compete for attention.">
          <Live className="flex flex-wrap gap-2">
            <Button>Save draft</Button>
            <Button>Submit</Button>
          </Live>
        </Side>
        <Side good label="One filled button shows the next step.">
          <Live className="flex flex-wrap gap-2">
            <Button variant="default-outline">Save draft</Button>
            <Button>Submit</Button>
          </Live>
        </Side>
        <Side good={false} label="Outlined boxes inside boxes add noise.">
          <div className="box-out">
            <strong>Applicant</strong>
            <div>Nur Aisyah binti Ahmad</div>
            <div>900101-14-5678</div>
          </div>
        </Side>
        <Side good label="Space and tone do the grouping.">
          <div className="box-tone">
            <strong>Applicant</strong>
            <span>Nur Aisyah binti Ahmad</span>
            <span>900101-14-5678</span>
          </div>
        </Side>
      </div>
    </Fig>
  );
}
