/** Figures for the Page Layouts guide. */
import { Footer, FooterCopyright } from "@/components/ui/footer";
import {
  Masthead,
  MastheadHeader,
  MastheadTitle,
  MastheadTrigger,
} from "@/components/ui/masthead";
import { PhaseBanner, PhaseBannerLink } from "@/components/ui/phase-banner";
import { Fig, Live, Note, R, Screen } from "./kit";

const FRAMES = [
  {
    id: "public",
    tab: "Public service",
    screen: "react-app-citizen-examples--Application",
    about:
      "Apply, pay or declare, in a centred column that keeps people on one task.",
    density: "Comfortable",
    parts: [
      ["Masthead", "masthead"],
      ["Navbar", "navbar"],
      ["PageHeader", "page-header"],
      ["Footer", "footer"],
    ],
  },
  {
    id: "access",
    tab: "Sign in",
    screen: "react-app-access-examples--SignIn",
    about:
      "Sign in, sign up, password and verification, ready as whole blocks.",
    density: "Comfortable",
    parts: [
      ["AuthLayout", "auth-layout"],
      ["SignInForm", "sign-in-form"],
      ["SignUpForm", "sign-up-form"],
      ["OtpVerify", "otp-verify"],
    ],
  },
  {
    id: "account",
    tab: "Account",
    screen: "react-app-account-examples--Profile",
    about: "Profile and settings, grouped into clear sections.",
    density: "Comfortable",
    parts: [["SettingsLayout", "settings-layout"]],
  },
  {
    id: "shell",
    tab: "Officer tool",
    screen: "react-app-shell",
    width: 1024,
    about:
      "For tools with labelled, grouped navigation. Set compact density on it.",
    density: "Compact",
    parts: [
      ["AppShell", "app-shell"],
      ["Sidebar", "app-shell"],
    ],
  },
  {
    id: "desk",
    tab: "Workstation",
    screen: "react-app-officer-examples--Queue",
    about:
      "For officers in one tool all day: a dense, keyboard-first desk. Compact is set for you.",
    density: "Compact",
    parts: [
      ["DeskShell", "desk-shell"],
      ["WorkQueue", "work-queue"],
    ],
  },
  {
    id: "split",
    tab: "Split view",
    screen: "react-split-pane",
    width: 640,
    about: "Cases or applications beside their detail, inside either shell.",
    density: "Inherits",
    parts: [["SplitPane", "split-pane"]],
  },
  {
    id: "site",
    tab: "Website",
    screen: "astro-agency-home",
    about: "Agency and landing sites, assembled from marketing blocks.",
    density: "Comfortable",
    parts: [
      ["Navbar", "navbar"],
      ["Hero", "hero"],
      ["FeatureGrid", "feature-grid"],
      ["Faq", "faq"],
      ["CtaBand", "cta-band"],
      ["SiteFooter", "site-footer"],
    ],
  },
];

function Wire({ kind }: { kind: "public" | "desk" | "site" }) {
  if (kind === "public")
    return (
      <div className="wire">
        <div className="w-bar" />
        <div className="w-nav" />
        <div className="w-column">
          <b />
          <i />
          <i />
          <i />
          <u />
        </div>
        <div className="w-foot" />
      </div>
    );
  if (kind === "desk")
    return (
      <div className="wire wire--desk">
        <div className="w-rail" />
        <div className="w-work">
          <div className="w-tabs" />
          <div className="w-rows">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="w-status" />
        </div>
      </div>
    );
  return (
    <div className="wire">
      <div className="w-nav" />
      <div className="w-hero">
        <b />
        <i />
      </div>
      <div className="w-tiles">
        <span />
        <span />
        <span />
      </div>
      <div className="w-foot w-foot--tall" />
    </div>
  );
}

/** Plate: the three kinds of page. */
export function Hero() {
  return (
    <div className="wires">
      {(
        [
          ["public", "Public service"],
          ["desk", "Officer tool"],
          ["site", "Website"],
        ] as const
      ).map(([kind, label]) => (
        <div key={kind}>
          <Wire kind={kind} />
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

/** Replaces the page-to-frame table: choose a frame, see a real one. */
export function Frames() {
  return (
    <Fig
      tone="plate"
      caption="Each preview is a working FTDS page, with sample data."
    >
      <div data-tabs>
        <div className="fig-tabs" role="tablist" aria-label="Page frames">
          {FRAMES.map((frame, i) => (
            <button
              key={frame.id}
              type="button"
              role="tab"
              id={`tab-${frame.id}`}
              aria-controls={`panel-${frame.id}`}
              aria-selected={i === 0}
              tabIndex={i === 0 ? 0 : -1}
            >
              {frame.tab}
            </button>
          ))}
        </div>
        {FRAMES.map((frame, i) => (
          <div
            key={frame.id}
            role="tabpanel"
            id={`panel-${frame.id}`}
            aria-labelledby={`tab-${frame.id}`}
            hidden={i !== 0}
          >
            <Screen
              id={frame.screen}
              title={`Example of a ${frame.tab.toLowerCase()} page`}
              width={frame.width}
            />
            <div className="fig-frame-meta">
              <p>{frame.about}</p>
              <dl>
                <div>
                  <dt>Start with</dt>
                  <dd>
                    {frame.parts.map(([name, to]) => (
                      <R key={name} to={to}>
                        {name}
                      </R>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt>Density</dt>
                  <dd>{frame.density}</dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </Fig>
  );
}

export function Official() {
  return (
    <Fig caption="The official elements of a government page, in the order they appear.">
      <div className="anat anat--page">
        <Live className="anat-contents">
          <div className="fig-skip">Skip to main content</div>
          <Masthead>
            <MastheadHeader>
              <MastheadTitle>
                Official Malaysia Government Website
              </MastheadTitle>
              <MastheadTrigger>Here's how you know</MastheadTrigger>
            </MastheadHeader>
          </Masthead>
          <PhaseBanner phase="Beta">
            This is a new service.{" "}
            <PhaseBannerLink href="/feedback">Give feedback</PhaseBannerLink> to
            help us improve it.
          </PhaseBanner>
          <div className="fig-topbar">
            <strong>Your service</strong>
            <span>Home</span>
            <span>Applications</span>
            <span>Help</span>
          </div>
          <div className="fig-pagebody">
            <b />
            <i />
            <i />
          </div>
          <Footer>
            <FooterCopyright>© 2026 Your agency name</FooterCopyright>
          </Footer>
        </Live>
        <Note row={1} name={<R to="skiplink">Skiplink</R>}>
          Appears on keyboard focus.
        </Note>
        <Note row={2} name={<R to="masthead">Masthead</R>}>
          Explains how to verify the site.
        </Note>
        <Note row={3} name={<R to="phase-banner">PhaseBanner</R>}>
          While in alpha or beta.
        </Note>
        <Note row={4} name={<R to="navbar">Navbar</R>}>
          Or a simple top bar.
        </Note>
        <Note row={5} name="Your content" />
        <Note row={6} name={<R to="footer">Footer</R>}>
          Copyright and required links.
        </Note>
      </div>
    </Fig>
  );
}

export function Officer() {
  return (
    <Fig
      tone="well"
      caption="Two frames for officers. Choose by how much of the day people spend in the tool."
    >
      <div className="shells">
        <div>
          <div className="shell">
            <div className="shell-side">
              <strong>Sidebar</strong>
              <span>Labels</span>
              <span>Groups</span>
              <span>Nesting</span>
            </div>
            <div className="shell-main">
              <div className="w-rows w-rows--tone">
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>
          </div>
          <p className="shell-name">
            <R to="app-shell">AppShell</R>
          </p>
          <p>For tools people visit through the day.</p>
        </div>
        <div>
          <div className="shell shell--desk">
            <div className="shell-rail">
              <span className="shell-dim">48px</span>
            </div>
            <div className="shell-main">
              <div className="shell-top">
                <span>Section tabs</span>
                <kbd>⌘K</kbd>
              </div>
              <div className="w-rows w-rows--tone">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
              <div className="shell-status">Status bar</div>
            </div>
          </div>
          <p className="shell-name">
            <R to="desk-shell">DeskShell</R>
          </p>
          <p>For people who work in one tool all day, mostly by keyboard.</p>
        </div>
      </div>
    </Fig>
  );
}
