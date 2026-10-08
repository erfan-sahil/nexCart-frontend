import { Container, Logo } from "@/components/common";

import { CategoryNav } from "./category-nav";
import { MobileNav } from "./mobile-nav";
import { NavActions } from "./nav-actions";
import { SearchBar } from "./search-bar";
import { TopBar } from "./top-bar";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 shadow-sm backdrop-blur-md">
      <TopBar />
      <Container className="flex h-14 items-center gap-2 sm:h-16 sm:gap-4 lg:gap-6">
        <MobileNav />
        <Logo priority className="shrink-0 [&_img]:h-6 sm:[&_img]:h-7" />
        <SearchBar className="hidden min-w-0 flex-1 md:block" />
        <div className="ml-auto shrink-0 md:ml-0">
          <NavActions />
        </div>
      </Container>
      <div className="border-t border-border/70 px-4 py-2 md:hidden">
        <SearchBar />
      </div>
      <CategoryNav />
    </header>
  );
}
