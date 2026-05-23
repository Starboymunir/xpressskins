/**
 * Renders a small <style> tag for any per-instance CSS produced by
 * resolveStyle(). Use inside every block:
 *   const { className, inline, css } = resolveStyle(style);
 *   return (<><StyleTag css={css} /><div className={className} style={inline}>…</div></>)
 */
"use client";

import type { ReactNode } from "react";

export function StyleTag({ css }: { css: string }) {
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export function StyledWrapper({
  tag: Tag = "div",
  className,
  inline,
  css,
  children,
  extraClassName = "",
  ...rest
}: {
  tag?: keyof React.JSX.IntrinsicElements;
  className: string;
  inline: React.CSSProperties;
  css: string;
  children?: ReactNode;
  extraClassName?: string;
} & React.HTMLAttributes<HTMLElement>) {
  // Tag is dynamic; cast to any inevitable due to JSX intrinsic union.
  const Component = Tag as unknown as React.ElementType;
  return (
    <>
      <StyleTag css={css} />
      <Component
        className={`${className} ${extraClassName}`.trim()}
        style={inline}
        {...rest}
      >
        {children}
      </Component>
    </>
  );
}
