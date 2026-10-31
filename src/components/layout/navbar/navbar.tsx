import { Container, Logo } from "@/components/common";

import { CATEGORY_LINKS } from "@/constants/navigation";
import { getCategoryTree } from "@/features/catalog";
import { getSiteSettings } from "@/features/site-settings/api";

import { CategoryNav, type CategoryNavLink } from "./category-nav";
import { MobileNav } from "./mobile-nav";
import { NavActions } from "./nav-actions";
import { SearchBar } from "./search-bar";
import { TopBar } from "./top-bar";

export async function Navbar() {
  const [tree, settings] = await Promise.all([
    getCategoryTree(),
    getSiteSettings(),
  ]);
  const categories: CategoryNavLink[] =
    tree.length > 0
      ? tree.map((category) => ({
          slug: category.slug,
          label: category.name,
          href: `/products?category=${category.slug}`,
        }))
      : CATEGORY_LINKS.map((item) => ({
          slug: item.slug,
          label: item.label,
          href: item.href,
        }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 shadow-sm backdrop-blur-md">
      <TopBar settings={settings} />
      <Container className="flex h-14 items-center gap-2 sm:h-16 sm:gap-4 lg:gap-6">
        <MobileNav categories={categories} />
        <Logo priority className="shrink-0 [&_img]:h-6 sm:[&_img]:h-7" />
        <SearchBar className="hidden min-w-0 flex-1 md:block" />
        <div className="ml-auto shrink-0 md:ml-0">
          <NavActions />
        </div>
      </Container>
      <div className="border-t border-border/70 px-4 py-2 md:hidden">
        <SearchBar />
      </div>
      <CategoryNav categories={categories} />
    </header>
  );
}
