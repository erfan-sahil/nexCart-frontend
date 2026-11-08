"use client";

import { useServerInsertedHTML } from "next/navigation";

import { themeInitScript } from "@/lib/theme";

type RootHeadScriptsProps = {
  jsonLd: string;
};

/**
 * Injects blocking head/body scripts during SSR only (outside the client React tree).
 * Avoids React 19 warnings about <script> inside hydrated components.
 */
export function RootHeadScripts({ jsonLd }: RootHeadScriptsProps) {
  useServerInsertedHTML(() => (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </>
  ));

  return null;
}
