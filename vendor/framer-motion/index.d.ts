import * as React from "react";

export type Variants = Record<string, Record<string, unknown>>;

type MotionProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] & {
  initial?: Record<string, unknown> | string;
  animate?: Record<string, unknown> | string;
  whileInView?: Record<string, unknown> | string;
  whileHover?: Record<string, unknown>;
  variants?: Variants;
  viewport?: Record<string, unknown>;
  transition?: Record<string, unknown>;
};

export const motion: {
  [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<MotionProps<K>>;
};

export function AnimatePresence({ children }: { children?: React.ReactNode }): React.ReactNode;
