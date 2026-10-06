import Link from "next/link";

import { FOOTER_LINK_GROUPS } from "@/constants/navigation";

export function FooterLinks() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {FOOTER_LINK_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="text-sm font-semibold text-white">{group.title}</p>
          <ul className="mt-3 space-y-2">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
