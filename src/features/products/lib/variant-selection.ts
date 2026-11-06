import type { SellableVariant, VariantAxis } from "../types/variant";

export function variantAxes(variants: SellableVariant[]): VariantAxis[] {
  const map = new Map<string, VariantAxis>();

  for (const variant of variants) {
    for (const attribute of variant.attributes) {
      const axis =
        map.get(attribute.attributeId) ??
        ({
          attributeId: attribute.attributeId,
          name: attribute.name,
          slug: attribute.slug,
          options: [],
        } satisfies VariantAxis);

      for (const option of attribute.options) {
        if (!axis.options.some((entry) => entry.id === option.id)) {
          axis.options.push(option);
        }
      }

      map.set(attribute.attributeId, axis);
    }
  }

  return [...map.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

export function selectionFromVariant(variant: SellableVariant) {
  const selection: Record<string, string> = {};

  for (const attribute of variant.attributes) {
    const option = attribute.options[0];

    if (option) {
      selection[attribute.attributeId] = option.id;
    }
  }

  return selection;
}

export function defaultVariant(variants: SellableVariant[]) {
  return (
    variants.find((variant) => variant.isDefault && variant.stock > 0) ??
    variants.find((variant) => variant.isDefault) ??
    variants.find((variant) => variant.stock > 0) ??
    variants[0] ??
    null
  );
}

export function findVariant(
  variants: SellableVariant[],
  selection: Record<string, string>,
) {
  const entries = Object.entries(selection).filter(([, optionId]) => optionId);

  if (entries.length === 0) {
    return null;
  }

  return (
    variants.find((variant) =>
      entries.every(([attributeId, optionId]) =>
        variant.attributes.some(
          (attribute) =>
            attribute.attributeId === attributeId &&
            attribute.options.some((option) => option.id === optionId),
        ),
      ),
    ) ?? null
  );
}

export function optionAvailable(
  variants: SellableVariant[],
  selection: Record<string, string>,
  attributeId: string,
  optionId: string,
) {
  const next = { ...selection, [attributeId]: optionId };

  return variants.some(
    (variant) =>
      variant.stock > 0 &&
      Object.entries(next).every(([id, value]) =>
        variant.attributes.some(
          (attribute) =>
            attribute.attributeId === id &&
            attribute.options.some((option) => option.id === value),
        ),
      ),
  );
}
