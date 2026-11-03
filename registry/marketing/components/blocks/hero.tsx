// registry:block — composed page section, installs to components/blocks
import {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useId,
} from "react";
import { clx } from "@/lib/ftds/utils";
import { Tag } from "@/components/ui/tag";
import { renderAction, type BlockAction } from "@/components/ui/section-heading";
import {
  actions_cva,
  band_cva,
  container_cva,
  content_cva,
  media_cva,
  secondary_action_cva,
} from "@/components/ui/hero.variants";

/**
 * Hero is the opening section of an agency or landing page: an optional
 * eyebrow tag, the page's single h1, supporting text, a primary and a
 * secondary action, and optional media.
 *
 * Layouts: `stacked` (text only; the default without media), `split` (text
 * beside the media on desktop; the default with media, `mediaPosition` picks
 * the side) and `image` (the media fills the band and the text sits on a
 * solid panel over it, so it stays readable on any photo; on mobile the
 * picture is above the text). `align="center"` centres a stacked hero.
 * `tone` sets the band: Paper (default), Well, or `primary`, the primary
 * wash. No gradients.
 *
 * Actions accept `{ label, href }` (rendered as links styled as buttons) or
 * any node, such as your own `<Button>`.
 *
 * @example
 * <Hero
 *   eyebrow="New"
 *   title="Pay your government bills in one place"
 *   description="Settle fees, fines and assessments from 30 agencies with one MyDigital ID."
 *   primaryAction={{ label: "Start a payment", href: "/pay" }}
 *   secondaryAction={{ label: "How it works", href: "#how" }}
 *   media={<img src="/hero.png" alt="" />}
 * />
 */

type HeroAction = BlockAction;

interface HeroProps extends Omit<ComponentProps<"section">, "title"> {
  /** Short label above the title. A string renders a primary Tag. */
  eyebrow?: ReactNode;
  /** The page title, rendered as the only h1. */
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  /** Image or illustration: beside the text (`split`) or behind it (`image`). */
  media?: ReactNode;
  /** Extra content under the actions, e.g. a short reassurance line. */
  footnote?: ReactNode;
  /** Defaults to `"split"` with media, `"stacked"` without. */
  layout?: "stacked" | "split" | "image";
  /** Text alignment of a stacked hero. Defaults to `"start"`. */
  align?: "start" | "center";
  /** Side of the media in a split hero on desktop. Defaults to `"right"`. */
  mediaPosition?: "left" | "right";
  /** Band: Paper (default), Well, or the primary wash. On `image`, the panel's colour. */
  tone?: "paper" | "well" | "primary";
}

const Hero: ForwardRefExoticComponent<HeroProps & RefAttributes<HTMLElement>> =
  forwardRef(
    (
      {
        eyebrow,
        title,
        description,
        primaryAction,
        secondaryAction,
        media,
        footnote,
        layout: layoutProp,
        align: alignProp = "start",
        mediaPosition = "right",
        tone = "paper",
        className,
        children,
        ...props
      },
      ref,
    ) => {
      const titleId = useId();
      const hasMedia = Boolean(media);
      // Without media a split or image hero has nothing to show beside the text
      const layout = hasMedia ? (layoutProp ?? "split") : "stacked";
      const align = layout === "stacked" ? alignProp : "start";

      return (
        <section
          ref={ref}
          aria-labelledby={titleId}
          className={clx(band_cva({ tone, layout }), className)}
          {...props}
        >
          <div className={container_cva({ layout })}>
            <div
              className={content_cva({ layout, align, mediaPosition, tone })}
            >
              {eyebrow &&
                (typeof eyebrow === "string" ? (
                  <Tag variant="primary" size="medium">
                    {eyebrow}
                  </Tag>
                ) : (
                  eyebrow
                ))}
              <div className="flex flex-col gap-4">
                <h1
                  id={titleId}
                  className="text-txt-black-900 text-heading-sm md:text-heading-md lg:text-heading-lg font-semibold tracking-[-0.02em] text-balance"
                >
                  {title}
                </h1>
                {description && (
                  <p
                    className={clx(
                      "text-txt-black-700 text-body-lg md:text-body-xl max-w-[60ch]",
                      align === "center" && "mx-auto",
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>
              {(primaryAction || secondaryAction) && (
                <div className={actions_cva({ align })}>
                  {primaryAction && renderAction(primaryAction, "primary-fill")}
                  {secondaryAction &&
                    renderAction(
                      secondaryAction,
                      "default-outline",
                      secondary_action_cva({ tone, layout }),
                    )}
                </div>
              )}
              {footnote && (
                <p className="text-txt-black-700 text-body-md">{footnote}</p>
              )}
              {children}
            </div>
            {hasMedia && <div className={media_cva({ layout })}>{media}</div>}
          </div>
        </section>
      );
    },
  );
Hero.displayName = "Hero";

export { Hero };
export type { HeroProps, HeroAction };
