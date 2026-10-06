export const CATEGORY_LINKS = [
  {
    href: "/products?category=electronics",
    slug: "electronics",
    label: "Electronics",
  },
  { href: "/products?category=fashion", slug: "fashion", label: "Fashion" },
  { href: "/products?category=home", slug: "home", label: "Home & Living" },
  { href: "/products?category=beauty", slug: "beauty", label: "Beauty" },
  { href: "/products?category=sports", slug: "sports", label: "Sports" },
  { href: "/products?category=grocery", slug: "grocery", label: "Grocery" },
  {
    href: "/products?category=automotive",
    slug: "automotive",
    label: "Automotive",
  },
  { href: "/products?category=books", slug: "books", label: "Books" },
] as const;

export const FOOTER_LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { href: "/products?collection=flash-deals", label: "Flash Deals" },
      { href: "/products", label: "All Products" },
      { href: "/categories", label: "Categories" },
      { href: "/stores", label: "Stores" },
      { href: "/products?collection=new-arrivals", label: "New Arrivals" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "My Account" },
      { href: "/orders", label: "Order History" },
      { href: "/wishlist", label: "Wishlist" },
      {
        href: "/products?collection=recently-viewed",
        label: "Recently Viewed",
      },
    ],
  },
  {
    title: "Vendors",
    links: [
      { href: "/sell", label: "Sell on NexCart" },
      { href: "/sell/guide", label: "Seller Guide" },
      { href: "/sell/fees", label: "Fees & Payouts" },
      { href: "/sell/success", label: "Success Stories" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/track-order", label: "Track Order" },
      { href: "/returns", label: "Returns & Refunds" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
] as const;
