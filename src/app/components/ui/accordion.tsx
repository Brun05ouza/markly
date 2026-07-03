"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion, AnimatePresence, type HTMLMotionProps, type Transition } from "motion/react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

function useControlledState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : uncontrolled;
  const setValue = React.useCallback(
    (next: T) => {
      if (controlledValue === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [controlledValue, onChange],
  );
  return [value, setValue] as const;
}

function itemIsOpen(value: string | string[] | undefined, itemValue: string) {
  if (Array.isArray(value)) return value.includes(itemValue);
  return value === itemValue;
}

function useMeasuredHeight(
  ref: React.RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => setHeight(el.scrollHeight);

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [active, ref]);

  return height;
}

type AccordionContextType = {
  value: string | string[] | undefined;
};

type AccordionItemContextType = {
  isOpen: boolean;
};

const AccordionContext = React.createContext<AccordionContextType | null>(null);
const AccordionItemContext = React.createContext<AccordionItemContextType | null>(null);

function useAccordion() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("useAccordion must be used within Accordion");
  return ctx;
}

function useAccordionItem() {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error("useAccordionItem must be used within AccordionItem");
  return ctx;
}

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;

function Accordion({
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: AccordionProps) {
  const [value, setValue] = useControlledState<string | string[] | undefined>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <AccordionContext.Provider value={{ value }}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        {...props}
        value={value}
        onValueChange={setValue}
      />
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>;

function AccordionItem({ ...props }: AccordionItemProps) {
  const { value } = useAccordion();
  const [isOpen, setIsOpen] = React.useState(() => itemIsOpen(value, props.value));

  React.useEffect(() => {
    setIsOpen(itemIsOpen(value, props.value));
  }, [value, props.value]);

  return (
    <AccordionItemContext.Provider value={{ isOpen }}>
      <AccordionPrimitive.Item data-slot="accordion-item" {...props} />
    </AccordionItemContext.Provider>
  );
}

type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  showArrow?: boolean;
};

function AccordionTrigger({
  className,
  children,
  showArrow = true,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 transition-transform duration-300 ease-out" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

type AccordionContentProps = Omit<
  React.ComponentProps<typeof AccordionPrimitive.Content>,
  "asChild" | "forceMount"
> &
  Omit<HTMLMotionProps<"div">, "children"> & {
    keepRendered?: boolean;
    transition?: Transition;
    children?: React.ReactNode;
  };

const DEFAULT_TRANSITION: Transition = { type: "spring", stiffness: 150, damping: 22 };

function AnimatedAccordionPanel({
  open,
  className,
  children,
  transition,
  motionProps,
}: {
  open: boolean;
  className?: string;
  children: React.ReactNode;
  transition: Transition;
  motionProps?: Omit<HTMLMotionProps<"div">, "children">;
}) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const measuredHeight = useMeasuredHeight(innerRef, open);
  const {
    initial: initialProp,
    exit: exitProp,
    style: styleProp,
    transition: _transition,
    animate: _animate,
    ...restMotion
  } = motionProps ?? {};

  return (
    <motion.div
      data-slot="accordion-content"
      {...restMotion}
      initial={initialProp ?? false}
      animate={{
        height: open ? measuredHeight : 0,
        opacity: open ? 1 : 0,
      }}
      exit={exitProp}
      transition={transition}
      style={{ overflow: "hidden", ...styleProp }}
    >
      <div ref={innerRef} className={cn("pt-0 pb-4", className)}>
        {children}
      </div>
    </motion.div>
  );
}

function AccordionContent({
  className,
  children,
  keepRendered = false,
  transition = DEFAULT_TRANSITION,
  ...props
}: AccordionContentProps) {
  const { isOpen } = useAccordionItem();

  if (keepRendered) {
    return (
      <AccordionPrimitive.Content asChild forceMount>
        <AnimatedAccordionPanel
          open={isOpen}
          className={className}
          transition={transition}
          motionProps={props}
        >
          {children}
        </AnimatedAccordionPanel>
      </AccordionPrimitive.Content>
    );
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <AccordionPrimitive.Content asChild forceMount>
          <AnimatedAccordionPanel
            open
            className={className}
            transition={transition}
            motionProps={{
              initial: { height: 0, opacity: 0 },
              exit: { height: 0, opacity: 0 },
              ...props,
            }}
          >
            {children}
          </AnimatedAccordionPanel>
        </AccordionPrimitive.Content>
      )}
    </AnimatePresence>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
