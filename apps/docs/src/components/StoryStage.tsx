import { Component as ReactComponent, Suspense, type ReactNode } from "react";

/**
 * Runs one React story as an island. The story module is preloaded on the
 * server so the HTML is complete, then loaded on demand in the browser; the
 * server's markup stays on screen while that happens.
 */
type Module = Record<string, any>;

const loaders = import.meta.glob<Module>(
  "../../../storybook/stories/*.stories.tsx",
);

const cache = new Map<string, { mod?: Module; pending?: Promise<void> }>();

export async function preloadStory(file: string) {
  if (!cache.get(file)?.mod) cache.set(file, { mod: await loaders[file]() });
}

function readModule(file: string): Module {
  const entry = cache.get(file);
  if (entry?.mod) return entry.mod;
  if (!entry) {
    const pending = loaders[file]().then((mod) => {
      cache.set(file, { mod });
    });
    cache.set(file, { pending });
    throw pending;
  }
  throw entry.pending;
}

function Story({ file, id }: { file: string; id: string }) {
  const mod = readModule(file);
  const meta = mod.default ?? {};
  const story = mod[id] ?? {};

  const args: Record<string, any> = { ...meta.args, ...story.args };
  for (const key of Object.keys(args)) {
    const mapping =
      story.argTypes?.[key]?.mapping ?? meta.argTypes?.[key]?.mapping;
    if (mapping && args[key] in mapping) args[key] = mapping[args[key]];
  }

  const Target = meta.component;
  const render = story.render ?? meta.render ?? ((a: any) => <Target {...a} />);
  const context = {
    args,
    parameters: { ...meta.parameters, ...story.parameters },
    globals: {},
  };

  const decorated = [
    ...(story.decorators ?? []),
    ...(meta.decorators ?? []),
  ].reduce(
    (inner: () => ReactNode, decorator: any) => () => decorator(inner, context),
    () => render(args, context),
  );

  return <>{decorated()}</>;
}

class Boundary extends ReactComponent<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function StoryStage({ file, id }: { file: string; id: string }) {
  return (
    <Boundary
      fallback={
        <p className="text-txt-black-700 text-sm">
          This example only runs in Storybook.
        </p>
      }
    >
      <Suspense fallback={null}>
        <Story file={file} id={id} />
      </Suspense>
    </Boundary>
  );
}
