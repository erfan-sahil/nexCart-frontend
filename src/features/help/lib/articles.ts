export const HELP_TOPICS = [
  { id: "orders", label: "Orders" },
  { id: "returns", label: "Returns" },
  { id: "account", label: "Account" },
  { id: "selling", label: "Selling" },
] as const;

export type HelpTopicId = (typeof HELP_TOPICS)[number]["id"];

export type HelpArticle = {
  id: string;
  topic: HelpTopicId;
  question: string;
  answer: string;
  href?: string;
  hrefLabel?: string;
};

export const helpArticles: HelpArticle[] = [
  {
    id: "track",
    topic: "orders",
    question: "How do I track an order?",
    answer:
      "Open Track order and enter the order number from your receipt plus the email used at checkout. The route updates as the parcel moves.",
    href: "/track-order",
    hrefLabel: "Track an order",
  },
  {
    id: "history",
    topic: "orders",
    question: "Where can I see past orders?",
    answer:
      "Order history lists every purchase on the signed-in account, with status, date, and total. Open an order there when you need the number for tracking or a return.",
    href: "/orders",
    hrefLabel: "View order history",
  },
  {
    id: "shipping",
    topic: "orders",
    question: "When is shipping free?",
    answer:
      "Shipping is free once the cart reaches $75. Below that, a shipping fee is added at checkout along with estimated tax.",
    href: "/cart",
    hrefLabel: "Review your cart",
  },
  {
    id: "change-order",
    topic: "orders",
    question: "Can I change an order after checkout?",
    answer:
      "Placed orders cannot be edited from the cart. Contact support with the order number if you need to change the address or cancel before it ships.",
    href: "/contact",
    hrefLabel: "Contact support",
  },
  {
    id: "start-return",
    topic: "returns",
    question: "How do I start a return?",
    answer:
      "Most items can be returned within 30 days of delivery if they are unused and in their original packaging. Send a message, choose A return, and include the order number.",
    href: "/contact",
    hrefLabel: "Request a return",
  },
  {
    id: "refund",
    topic: "returns",
    question: "When is a refund issued?",
    answer:
      "After the return is accepted, the refund goes back to the original payment method. You will get an email when that happens.",
  },
  {
    id: "not-returnable",
    topic: "returns",
    question: "What cannot be returned?",
    answer:
      "Perishable groceries, opened beauty products, and items marked final sale are not returnable. If something arrived damaged, contact support with the order number anyway.",
    href: "/contact",
    hrefLabel: "Report a problem",
  },
  {
    id: "edit-profile",
    topic: "account",
    question: "How do I update my name or phone?",
    answer:
      "Open Account and choose Edit profile. You can change your first name, last name, and phone number. Email stays linked to sign-in and cannot be edited there.",
    href: "/account",
    hrefLabel: "Go to account",
  },
  {
    id: "wishlist",
    topic: "account",
    question: "Where do saved products go?",
    answer:
      "The heart on a product saves it to your wishlist. From there you can add one item to the cart, add everything, or remove it.",
    href: "/wishlist",
    hrefLabel: "Open wishlist",
  },
  {
    id: "sign-in",
    topic: "account",
    question: "I cannot sign in",
    answer:
      "Use the email and password from registration. If the account email is out of reach, contact support and include the address you signed up with.",
    href: "/login",
    hrefLabel: "Sign in",
  },
  {
    id: "apply",
    topic: "selling",
    question: "How do I open a store?",
    answer:
      "Read the seller guide, then sign in with a customer account and complete the application. Admin accounts cannot apply, and an account that is already a vendor does not need a second application.",
    href: "/sell/guide",
    hrefLabel: "Read the seller guide",
  },
  {
    id: "application-status",
    topic: "selling",
    question: "How do I check my application?",
    answer:
      "Return to Sell on NexCart while signed in. If you already submitted an application, the page shows its status instead of a blank form.",
    href: "/sell",
    hrefLabel: "Check application",
  },
];

export function topicLabel(id: HelpTopicId) {
  return HELP_TOPICS.find((topic) => topic.id === id)?.label ?? id;
}
