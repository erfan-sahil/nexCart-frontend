import { cn } from "@/lib/utils";

import { initials } from "../lib/profile";
import type { AuthUser } from "../types";

type UserAvatarProps = {
  user: AuthUser;
  className?: string;
};

export function UserAvatar({ user, className }: UserAvatarProps) {
  const label = initials(user);

  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt=""
        className={cn("size-8 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-[#fff4f2]",
        className,
      )}
    >
      {label}
    </span>
  );
}
