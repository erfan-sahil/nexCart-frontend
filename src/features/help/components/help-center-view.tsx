"use client";

import Link from "next/link";
import {
  ChevronDown,
  Mail,
  MapPin,
  Package,
  Search,
  Store,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Container, PageBreadcrumb } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  HELP_TOPICS,
  helpArticles,
  topicLabel,
  type HelpTopicId,
} from "../lib/articles";

const shortcuts = [
  {
    href: "/track-order",
    label: "Track an order",
    hint: "Order number and email",
    icon: MapPin,
  },
  {
    href: "/orders",
    label: "Order history",
    hint: "Past purchases",
    icon: Package,
  },
  {
    href: "/account",
    label: "Your account",
    hint: "Name, phone, sign-in",
    icon: UserRound,
  },
  {
    href: "/sell",
    label: "Sell on NexCart",
    hint: "Open a store",
    icon: Store,
  },
] as const;

export function HelpCenterView() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<HelpTopicId | "all">("all");
  const [openId, setOpenId] = useState<string | null>(
    helpArticles[0]?.id ?? null,
  );

  const articles = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return helpArticles.filter((article) => {
      const inTopic = topic === "all" || article.topic === topic;
      if (!inTopic) return false;
      if (!needle) return true;

      return (
        article.question.toLowerCase().includes(needle) ||
        article.answer.toLowerCase().includes(needle)
      );
    });
  }, [query, topic]);

  return (
    <Container className="py-8 sm:py-10">
      <PageBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Help center" }]}
      />

      <div className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Support
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl">Help center</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Answers for orders, returns, your account, and selling on NexCart.
        </p>
      </div>

      <div className="relative mt-6 max-w-2xl">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          placeholder="Search help"
          aria-label="Search help"
          className="h-12 rounded-2xl border-border bg-card pr-4 pl-10 text-sm"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map(({ href, label, hint, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex h-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-brand-soft"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-xs text-muted-foreground">
                  {hint}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-10">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          <TopicButton
            active={topic === "all"}
            label="All topics"
            count={helpArticles.length}
            onClick={() => setTopic("all")}
          />
          {HELP_TOPICS.map((item) => (
            <TopicButton
              key={item.id}
              active={topic === item.id}
              label={item.label}
              count={
                helpArticles.filter((article) => article.topic === item.id)
                  .length
              }
              onClick={() => setTopic(item.id)}
            />
          ))}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </p>

          {articles.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <h2 className="text-xl">No matching articles</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try another word, or send a message and support will pick it up.
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/contact" />}
                className="auth-orange-button mt-6 px-6"
              >
                Contact us
              </Button>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
              {articles.map((article) => {
                const open = openId === article.id;

                return (
                  <article
                    key={article.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <h2>
                      <button
                        type="button"
                        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
                        aria-expanded={open}
                        onClick={() => setOpenId(open ? null : article.id)}
                      >
                        <span>
                          <span className="block text-xs font-medium tracking-wide text-primary uppercase">
                            {topicLabel(article.topic)}
                          </span>
                          <span className="mt-1 block text-base font-medium">
                            {article.question}
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                            open && "rotate-180",
                          )}
                        />
                      </button>
                    </h2>
                    {open ? (
                      <div className="px-4 pb-5 sm:px-5">
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                          {article.answer}
                        </p>
                        {article.href && article.hrefLabel ? (
                          <Link
                            href={article.href}
                            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                          >
                            {article.hrefLabel}
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <Mail className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-medium">Still need help?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Send a note and support replies by email.
            </p>
          </div>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/contact" />}
          className="h-10 rounded-full px-5 font-semibold"
        >
          Contact us
        </Button>
      </section>
    </Container>
  );
}

function TopicButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-between gap-3 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors lg:w-full lg:rounded-xl",
        active
          ? "border-primary bg-brand-soft text-primary"
          : "border-border bg-card text-foreground hover:bg-muted",
      )}
      aria-pressed={active}
      onClick={onClick}
    >
      <span>{label}</span>
      <span
        className={cn(
          "text-xs",
          active ? "text-primary" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
