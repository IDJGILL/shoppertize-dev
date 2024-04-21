import { z } from "zod"

export const VariationAttributeDTO = z.object({
  id: z.string(),
  label: z.string(),
  name: z.string(),
  value: z.string(),
})

export type VariationAttributeDTOType = z.infer<typeof VariationAttributeDTO>

export const ReplaceItemDTO = z.object({
  id: z.string(),
  key: z.string(),
  quantity: z.number(),
  currentBaseAttribute: VariationAttributeDTO,
  selectedAttribute: VariationAttributeDTO,
})

export type ReplaceItemDTOType = z.infer<typeof ReplaceItemDTO>

export const RemoveItemDTO = z.object({
  keys: z.array(z.string()),
  isAll: z.boolean(),
})

export type RemoveItemDTOType = z.infer<typeof RemoveItemDTO>

export const UpdateQuantityDTO = z.object({
  key: z.string(),
  quantity: z.number(),
})

export type UpdateQuantityDTOType = z.infer<typeof UpdateQuantityDTO>

// export const CartItemRecordSchema = z.object({
//   id: z.string(),
//   quantity: z.number(),
//   variants: z.boolean(),
// });

// export type CartItemRecordSchemaType = z.infer<typeof CartItemRecordSchema>;
