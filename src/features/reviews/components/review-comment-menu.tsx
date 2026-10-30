"use client";

import { useState } from "react";
import { AlertTriangle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ReviewCommentMenuProps = {
  itemLabel: "review" | "reply";
  onEdit: () => void;
  onDelete: () => void;
  deletePending?: boolean;
};

export function ReviewCommentMenu({
  itemLabel,
  onEdit,
  onDelete,
  deletePending = false,
}: ReviewCommentMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const title =
    itemLabel === "review" ? "Delete this review?" : "Delete this reply?";
  const description =
    itemLabel === "review"
      ? "Your star rating and comment will be removed from this product. Any replies on your review will be deleted as well."
      : "Your reply will be removed from the thread. This cannot be undone.";

  function confirmDelete() {
    onDelete();
    setConfirmOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Comment options"
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent
          className={cn(
            "gap-0 overflow-hidden rounded-2xl bg-popover p-0 shadow-xl ring-foreground/10",
            "data-[size=default]:max-w-[min(100%-2rem,22rem)] data-[size=default]:sm:max-w-md",
          )}
        >
          <div className="relative border-b border-border bg-muted/80 px-5 py-4">
            <AlertDialogClose
              disabled={deletePending}
              className="top-3 right-3 z-10 hover:bg-background/80"
              aria-label="Close dialog"
            />
            <div className="flex items-center gap-3 pr-9">
              <AlertDialogMedia className="size-10 shrink-0 bg-background ring-destructive/20">
                <Trash2 className="size-4 text-destructive" strokeWidth={2} />
              </AlertDialogMedia>
              <AlertDialogTitle className="min-w-0 flex-1 text-left leading-snug">
                {title}
              </AlertDialogTitle>
            </div>
          </div>

          <AlertDialogBody className="space-y-3">
            <AlertDialogDescription className="max-w-none text-left">
              {description}
            </AlertDialogDescription>
            <p className="flex items-start gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5 text-left text-xs leading-5 text-muted-foreground">
              <AlertTriangle
                className="mt-0.5 size-3.5 shrink-0 text-destructive/80"
                aria-hidden
              />
              This action is permanent and cannot be reversed.
            </p>
          </AlertDialogBody>

          <AlertDialogFooter className="mt-0 gap-2 border-t border-border/80 bg-muted/50 px-5 py-4 sm:justify-stretch">
            <AlertDialogCancel disabled={deletePending} className="sm:flex-1">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deletePending}
              className={cn(
                "sm:flex-1",
                "bg-destructive text-[#fff4f2] hover:bg-destructive/90",
                "focus-visible:border-destructive/40 focus-visible:ring-destructive/25",
              )}
              onClick={confirmDelete}
            >
              {deletePending ? "Deleting…" : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
