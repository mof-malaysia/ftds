import React, {
  Children,
  ComponentProps,
  ComponentPropsWithRef,
  ForwardRefExoticComponent,
  ReactNode,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
} from "react";
import { cva, VariantProps } from "class-variance-authority";
import {
  input_box_class,
  input_cva,
  input_icon_cva,
} from "@/components/ui/input.variants";
import { clx } from "@/lib/ftds/utils";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { Input as InputPrimitive } from "@base-ui/react/input";

type InputContextProps = {
  size: "small" | "medium" | "large" | null;
};

const InputContext = createContext<InputContextProps>({
  size: "small",
});

interface InputProps
  extends
    Omit<InputPrimitive.Props, "size" | "className">,
    VariantProps<typeof input_cva> {
  className?: string;
  prepend?: ReactNode;
  append?: ReactNode;
  children?: ReactNode;
}

const Input: ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prepend, append, children, size = "small", ...props }, ref) => {
    const has_icon = useMemo(() => {
      if (!children) return { left: false, right: false };
      const _children = Children.toArray(children);
      return {
        left: _children.some(
          (child) =>
            isValidElement<ComponentPropsWithRef<typeof InputIcon>>(child) &&
            child.props.position === "left",
        ),
        right: _children.some(
          (child) =>
            isValidElement<ComponentPropsWithRef<typeof InputIcon>>(child) &&
            child.props.position === "right",
        ),
      };
    }, [children]);

    return (
      <div className={clx(input_box_class, className)}>
        <div className="flex w-full flex-row">
          <InputContext.Provider value={{ size }}>
            {prepend}
            <div className="relative w-full">
              {/* Base UI Input joins the surrounding Field: label, hint, error, validity */}
              <InputPrimitive
                ref={ref}
                className={input_cva({ size })}
                data-has-prepend={!!prepend}
                data-has-append={!!append}
                data-has-left-icon={has_icon.left}
                data-has-right-icon={has_icon.right}
                {...props}
              />
              {children}
            </div>
            {append}
          </InputContext.Provider>
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

/*========================================================================================================================*/

const input_addon_cva = cva(
  [
    "flex items-center",
    "border border-transparent outline-none box-border ",
    "[&:not(:last-child)]:border-r-otl-gray-200 [&:not(:first-child)]:border-l-otl-gray-200",
  ],
  {
    variants: {
      size: {
        small: "h-[calc(var(--ctl-h-sm)-2px)] px-3 text-label-sm",
        medium: "h-[calc(var(--ctl-h-md)-2px)] px-3 text-label-md",
        large: "h-[calc(var(--ctl-h-lg)-2px)] px-3.5 text-label-lg",
      },
    },
  },
);

interface InputAddonProps extends useRender.ComponentProps<"div"> {}

const InputAddon: ForwardRefExoticComponent<InputAddonProps> = forwardRef(
  ({ className, render, ...props }, ref) => {
    const { size } = useContext(InputContext);

    return useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        { className: input_addon_cva({ size, className }) },
        props,
      ),
    });
  },
);

InputAddon.displayName = "InputAddon";

/*========================================================================================================================*/

interface InputIconProps extends ComponentProps<"div"> {
  position: "left" | "right";
}

const InputIcon: ForwardRefExoticComponent<InputIconProps> = forwardRef(
  ({ className, position = "left", children, ...props }, ref) => {
    const { size } = useContext(InputContext);
    const childIsElement = isValidElement(children);

    // Merges the icon classes onto its single child element (e.g. an svg icon).
    return useRender({
      defaultTagName: "div",
      render: childIsElement ? children : undefined,
      ref,
      props: mergeProps<"div">(
        { className: input_icon_cva({ position, size, className }) },
        childIsElement ? props : { ...props, children },
      ),
    });
  },
);

InputIcon.displayName = "InputIcon";

/*========================================================================================================================*/

export { Input, InputAddon, InputIcon };
