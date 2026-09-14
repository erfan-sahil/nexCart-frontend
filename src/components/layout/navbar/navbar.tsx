import { Container, Logo } from "@/components/common";

import { CategoryNav } from "./category-nav";
import { MobileNav } from "./mobile-nav";
import { NavActions } from "./nav-actions";
import { SearchBar } from "./search-bar";
import { TopBar } from "./top-bar";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <TopBar />
      <Container className="flex h-16 items-center gap-3 sm:gap-6">
        <MobileNav />
        <Logo priority />
        <SearchBar className="hidden flex-1 md:block" />
        <div className="ml-auto md:ml-0">
          <NavActions />
        </div>
      </Container>
      <div className="border-t border-border px-4 py-2 md:hidden">
        <SearchBar />
      </div>
      <CategoryNav />
    </header>
  );
}
