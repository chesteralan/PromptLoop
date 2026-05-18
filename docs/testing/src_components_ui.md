# UI Components — Testing Rules

All UI components are thin wrappers around `@base-ui/react` primitives with Tailwind styling. Prefer visual/accessibility snapshot tests over logic tests.

## 1. `src/components/ui/avatar.tsx`

- **Test type:** Visual / Accessibility
- **Key scenarios:**
  - Renders Avatar with Root, Image, Fallback, Badge, Group, GroupCount subcomponents
  - `size` prop (`default`|`sm`|`lg`) applies correct sizing classes
  - Fallback renders when image fails to load
  - Group applies negative spacing
- **Mocking requirements:** `@base-ui/react/avatar`
- **Coverage targets:** All size variants; with/without image
- **Suggested test file location:** `src/test/components/ui/avatar.test.tsx`

## 2. `src/components/ui/badge.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders with variant classes: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`
  - Default variant is `default`
  - Uses `class-variance-authority` for variant selection
  - Renders as `span` by default; supports `render` prop for custom element
- **Mocking requirements:** None
- **Coverage targets:** All 6 variants
- **Suggested test file location:** `src/test/components/ui/badge.test.tsx`

## 3. `src/components/ui/button.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders with all variant classes: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`
  - Default variant is `default`
  - Renders with all size classes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`
  - Default size is `default`
  - Supports `forwardRef`
  - Disabled state applies correct classes
- **Mocking requirements:** `@base-ui/react/button`
- **Coverage targets:** All variant × size combinations (6 × 8)
- **Suggested test file location:** `src/test/components/ui/button.test.tsx`

## 4. `src/components/ui/dialog.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders Root, Trigger, Portal, Close, Overlay, Content, Header, Footer, Title, Description
  - Content includes close button by default (`showCloseButton=true`)
  - Content hides close button when `showCloseButton=false`
- **Mocking requirements:** `@base-ui/react/dialog`
- **Coverage targets:** Close button shown/hidden
- **Suggested test file location:** `src/test/components/ui/dialog.test.tsx`

## 5. `src/components/ui/dropdown-menu.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders all subcomponents: Root, Portal, Trigger, Content (with position), Group, Label, Item, CheckboxItem, RadioGroup/RadioItem, Separator, Shortcut, Sub, SubTrigger, SubContent
  - Item `variant='destructive'` applies destructive styling
  - Inset prop adds left padding
- **Mocking requirements:** `@base-ui/react/menu`
- **Coverage targets:** Default vs destructive item variant; inset vs no-inset
- **Suggested test file location:** `src/test/components/ui/dropdown-menu.test.tsx`

## 6. `src/components/ui/input-group.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders InputGroup with addon, button, text, input, textarea subcomponents
  - `align` prop for addon: `inline-start`, `inline-end`, `block-start`, `block-end`
  - Addon click focuses sibling input (unless clicking a button)
  - InputGroupButton accepts size variants: `xs`, `sm`, `icon-xs`, `icon-sm`
  - InputGroupInput/InputGroupTextarea strip outer borders
- **Mocking requirements:** Button, Input, Textarea components
- **Coverage targets:** All 4 align variants; button click vs non-button click inside addon
- **Suggested test file location:** `src/test/components/ui/input-group.test.tsx`

## 7. `src/components/ui/input.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders as `@base-ui/react/input` with styling
  - Supports all native input types via `type` prop
  - Disabled and aria-invalid states apply correct styling
  - Supports `forwardRef`
- **Mocking requirements:** `@base-ui/react/input`
- **Coverage targets:** Normal, disabled, invalid states
- **Suggested test file location:** `src/test/components/ui/input.test.tsx`

## 8. `src/components/ui/label.tsx`

- **Test type:** Visual
- **Key scenarios:**
  - Renders `<label>` element with styling
  - Supports `className` merging
- **Mocking requirements:** None
- **Coverage targets:** N/A (single render path)
- **Suggested test file location:** `src/test/components/ui/label.test.tsx`

## 9. `src/components/ui/progress.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders Root, Track, Indicator, Label, Value
  - `value` prop controls indicator width
  - Indicator width transitions via CSS
- **Mocking requirements:** `@base-ui/react/progress`
- **Coverage targets:** 0% vs 50% vs 100% value
- **Suggested test file location:** `src/test/components/ui/progress.test.tsx`

## 10. `src/components/ui/scroll-area.tsx`

- **Test type:** Visual
- **Key scenarios:**
  - Renders Root, Viewport, ScrollBar (with Thumb), Corner
  - ScrollBar supports `orientation='vertical'` (default) and `'horizontal'`
- **Mocking requirements:** `@base-ui/react/scroll-area`
- **Coverage targets:** Vertical vs horizontal orientation
- **Suggested test file location:** `src/test/components/ui/scroll-area.test.tsx`

## 11. `src/components/ui/select.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders all subcomponents: Root, Group, Value, Trigger (with size), Content (with position), Label, Item, Separator, ScrollUpButton, ScrollDownButton
  - Trigger size: `default` (h-8) and `sm` (h-7)
  - Content supports side/align/sideOffset/alignOffset/alignItemWithTrigger
- **Mocking requirements:** `@base-ui/react/select`
- **Coverage targets:** Default vs sm trigger size; content alignment props
- **Suggested test file location:** `src/test/components/ui/select.test.tsx`

## 12. `src/components/ui/separator.tsx`

- **Test type:** Visual
- **Key scenarios:**
  - Renders horizontal (default) or vertical separator
  - Orientation prop applies correct data attribute and classes
- **Mocking requirements:** `@base-ui/react/separator`
- **Coverage targets:** Horizontal vs vertical
- **Suggested test file location:** `src/test/components/ui/separator.test.tsx`

## 13. `src/components/ui/sheet.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders Root, Trigger, Close, Portal, Overlay, Content (with side), Header, Footer, Title, Description
  - `side` prop: `top`, `right` (default), `bottom`, `left` — each has correct animation classes
  - `showCloseButton=true`: renders close button
  - `showCloseButton=false`: no close button
- **Mocking requirements:** `@base-ui/react/dialog` (reused as SheetPrimitive)
- **Coverage targets:** All 4 side positions; close button shown/hidden
- **Suggested test file location:** `src/test/components/ui/sheet.test.tsx`

## 14. `src/components/ui/skeleton.tsx`

- **Test type:** Visual
- **Key scenarios:**
  - Renders div with pulse animation and rounded-md bg-muted
- **Mocking requirements:** None
- **Coverage targets:** N/A (single render path)
- **Suggested test file location:** `src/test/components/ui/skeleton.test.tsx`

## 15. `src/components/ui/switch.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders Root and Thumb
  - `size='default'` vs `'sm'` applies different dimensions
  - Checked/unchecked states apply different transforms
- **Mocking requirements:** `@base-ui/react/switch`
- **Coverage targets:** Default vs sm size
- **Suggested test file location:** `src/test/components/ui/switch.test.tsx`

## 16. `src/components/ui/table.tsx`

- **Test type:** Visual
- **Key scenarios:**
  - Renders Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption
  - Wraps table in scrollable container
- **Mocking requirements:** None
- **Coverage targets:** N/A (single render path)
- **Suggested test file location:** `src/test/components/ui/table.test.tsx`

## 17. `src/components/ui/tabs.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders Root, List, Trigger, Content
  - `orientation='horizontal'` (default) or `'vertical'`
  - List `variant='default'` (bg-muted) or `'line'` (transparent with indicator)
  - Active/inactive trigger states apply different styling
- **Mocking requirements:** `@base-ui/react/tabs`
- **Coverage targets:** Horizontal vs vertical; default vs line variant
- **Suggested test file location:** `src/test/components/ui/tabs.test.tsx`

## 18. `src/components/ui/textarea.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders native textarea with styling
  - Disabled and aria-invalid states apply correct classes
  - Supports `forwardRef`
- **Mocking requirements:** None
- **Coverage targets:** Normal, disabled, invalid states
- **Suggested test file location:** `src/test/components/ui/textarea.test.tsx`

## 19. `src/components/ui/tooltip.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders Provider, Root, Trigger, Content (with arrow, positioner)
  - Content `side`: `top` (default), `bottom`, `left`, `right`
  - Provider supports custom `delay`
- **Mocking requirements:** `@base-ui/react/tooltip`
- **Coverage targets:** All 4 side positions; custom delay
- **Suggested test file location:** `src/test/components/ui/tooltip.test.tsx`

## 20. `src/components/ui/card.tsx`

- **Test type:** Visual
- **Key scenarios:**
  - Renders Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
  - `size='default'` vs `'sm'` for Card
- **Mocking requirements:** None
- **Coverage targets:** Default vs sm size
- **Suggested test file location:** `src/test/components/ui/card.test.tsx`

## 21. `src/components/ui/command.tsx`

- **Test type:** Visual / Unit
- **Key scenarios:**
  - Renders Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator
  - CommandDialog wraps Dialog with hidden header
  - CommandInput renders SearchIcon addon
  - CommandItem shows CheckIcon on checked state
- **Mocking requirements:** `cmdk`; Dialog, InputGroup components
- **Coverage targets:** CommandDialog with/without showCloseButton; CommandItem checked/unchecked
- **Suggested test file location:** `src/test/components/ui/command.test.tsx`
