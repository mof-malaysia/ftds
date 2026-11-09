/** Figures for Choose a stack. */
import { Fig, Screen } from "./kit";

const QUESTIONS = [
  "Do people sign in?",
  "Does a form do real work, such as applying or paying?",
  "Is there a table or a dashboard?",
];

export function Decide() {
  return (
    <Fig tone="plate" caption="If any answer is yes, use React.">
      <div className="decide">
        <ol className="decide-q">
          {QUESTIONS.map((q) => (
            <li key={q}>
              <span>{q}</span>
              <em>Yes</em>
            </li>
          ))}
        </ol>
        <div className="decide-out decide-out--react">
          <strong>React</strong>
          <span>Portals, applications and officer tools</span>
        </div>
        <div className="decide-no">
          <em>No to all three</em>
        </div>
        <div className="decide-out decide-out--astro">
          <strong>Astro</strong>
          <span>Agency pages, landing pages and campaigns</span>
        </div>
      </div>
    </Fig>
  );
}

export function Compare() {
  return (
    <Fig tone="well" caption="Real pages from each stack, with sample data.">
      <div className="compare">
        <div>
          <h3>React</h3>
          <Screen
            id="react-app-officer-examples--Queue"
            title="An officer's case queue built with React"
          />
        </div>
        <div>
          <h3>Astro</h3>
          <Screen
            id="astro-service-landing"
            title="A service page built with Astro"
          />
        </div>
      </div>
    </Fig>
  );
}

/** Measured from this site's own build: the gzipped React and Astro client chunk. */
export function Weight() {
  return (
    <Fig caption="JavaScript sent before any component code. The React figure is measured from this site's build, compressed.">
      <div className="weight">
        <div>
          <span>React</span>
          <div className="weight-bar">
            <i />
          </div>
          <strong>56 KB</strong>
        </div>
        <div>
          <span>Astro</span>
          <div className="weight-bar weight-bar--none">
            <i />
          </div>
          <strong>0 KB</strong>
        </div>
      </div>
    </Fig>
  );
}

export function Island() {
  return (
    <Fig
      tone="well"
      caption="React loads only where it is needed. The rest of the page stays plain HTML."
    >
      <div className="island">
        <div className="island-page">
          <div className="island-r">Masthead</div>
          <div className="island-r island-r--tall">Hero</div>
          <div className="island-r island-r--react">
            <strong>Site search</strong>
            <span>React island</span>
          </div>
          <div className="island-row">
            <div className="island-r">Feature</div>
            <div className="island-r">Feature</div>
            <div className="island-r">Feature</div>
          </div>
          <div className="island-r">Footer</div>
        </div>
        <dl className="island-key">
          <div>
            <dt>
              <i className="key-astro" />
              Astro
            </dt>
            <dd>Rendered to HTML when the site is built.</dd>
          </div>
          <div>
            <dt>
              <i className="key-react" />
              React
            </dt>
            <dd>
              A heavy component, such as a combobox or site search, that runs in
              the browser.
            </dd>
          </div>
        </dl>
      </div>
    </Fig>
  );
}
