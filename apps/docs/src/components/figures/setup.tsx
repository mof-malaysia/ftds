/** Figures for the setup guides. */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import { lightTokens } from "~/lib/tokens";
import { Fig, Live } from "./kit";

function Tree({
  command,
  added,
}: {
  command: string;
  added: [string, string][];
}) {
  return (
    <div className="tree-fig">
      <code className="tree-cmd">{command}</code>
      <svg
        className="tree-down"
        viewBox="0 0 12 28"
        width="12"
        height="28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 0v26M1.5 21.5 6 26l4.5-4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="sheet tree">
        <p className="tree-root">your-project</p>
        <ul>
          {added.map(([path, note]) => (
            <li key={path}>
              <code>{path}</code>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ReactHero() {
  return (
    <Tree
      command="npx shadcn@latest add @ftds/button"
      added={[
        ["components/ui/button.tsx", "The component"],
        ["components/ui/icons/", "Icons it uses"],
        ["lib/ftds/utils/", "Helpers"],
        ["styles/ftds.css", "Tokens and themes"],
      ]}
    />
  );
}

export function AstroHero() {
  return (
    <Tree
      command="npx shadcn@latest add @ftds/astro-hero"
      added={[
        ["components/blocks/hero.astro", "The block"],
        ["components/ui/button.astro", "What it depends on"],
        ["lib/ftds/i18n/", "Bahasa Melayu and English"],
        ["styles/ftds.css", "Tokens and themes"],
      ]}
    />
  );
}

function Panel({ dark }: { dark?: boolean }) {
  return (
    <div className={dark ? "dark" : "fig-light"}>
      <Live className="theme-panel bg-bg-gray-50">
        <div className="bg-bg-white theme-card">
          <p className="text-title text-txt-black-900 font-semibold">
            Case 2026-0412
          </p>
          <Tag variant="success">Approved</Tag>
          <Input defaultValue="Nur Aisyah binti Ahmad" />
          <Button>Continue</Button>
        </div>
      </Live>
    </div>
  );
}

export function Theme() {
  return (
    <Fig caption="The same components in each theme. Colours switch through the tokens.">
      {/* Keeps the left panel light when the page itself is in the dark theme */}
      <style
        dangerouslySetInnerHTML={{ __html: `.fig-light{${lightTokens()}}` }}
      />
      <div className="fig-pair fig-pair--flush">
        <Panel />
        <Panel dark />
      </div>
    </Fig>
  );
}
