"use client";

import Link from "next/link";

import { FOOTER_LINK_GROUPS } from "@/constants/navigation";
import { useMe } from "@/features/auth/use-me";

export function FooterLinks() {
  const profile = useMe();
  const user = profile.data?.user;

  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {FOOTER_LINK_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="text-sm font-semibold text-white">{group.title}</p>
          <ul className="mt-3 space-y-2">
            {group.links.map((link) => {
              const accountLink =
                group.title === "Account" && link.href === "/login" && user
                  ? { href: "/account", label: user.firstName }
                  : link;

              return (
                <li key={link.href}>
                  <Link
                    href={accountLink.href}
                    className="text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    {accountLink.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
