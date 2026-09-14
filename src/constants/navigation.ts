export const CATEGORY_LINKS = [
  { href: "/categories/electronics", label: "Electronics" },
  { href: "/categories/fashion", label: "Fashion" },
  { href: "/categories/home", label: "Home & Living" },
  { href: "/categories/beauty", label: "Beauty" },
  { href: "/categories/sports", label: "Sports" },
  { href: "/categories/grocery", label: "Grocery" },
  { href: "/categories/automotive", label: "Automotive" },
  { href: "/categories/books", label: "Books" },
] as const;

export const FOOTER_LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { href: "/deals", label: "Flash Deals" },
      { href: "/products", label: "All Products" },
      { href: "/categories", label: "Categories" },
      { href: "/stores", label: "Stores" },
      { href: "/new-arrivals", label: "New Arrivals" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "My Account" },
      { href: "/orders", label: "Order History" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/recently-viewed", label: "Recently Viewed" },
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
