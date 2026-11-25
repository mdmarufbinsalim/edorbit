/** Parts of a Gutenberg Bible page, for the tap-to-explore drawing. Regions are in the drawing's 300 × 400 viewBox. */
export interface PagePart {
  id: string;
  label: string;
  plain: string;
  region: { x: number; y: number; w: number; h: number };
}

export const pageParts: readonly PagePart[] = [
  {
    id: "columns",
    label: "Two columns of 42 lines",
    plain:
      "Each page has two columns of 42 lines, which is why it is called the 42-line Bible. The first pages had 40 lines. Squeezing in more saved paper.",
    region: { x: 156, y: 66, w: 102, h: 288 },
  },
  {
    id: "type",
    label: "Letters that look handwritten",
    plain:
      "The type copies the heavy, upright script of scribes, called textura. Gutenberg cast nearly 300 different pieces of type, including joined letters and shortcuts, so print looked as good as the best handwriting.",
    region: { x: 78, y: 120, w: 64, h: 60 },
  },
  {
    id: "edge",
    label: "A perfectly straight right edge",
    plain:
      "Every line ends at exactly the same place. To make lines fit, Gutenberg used shorter spellings and joined letters, just like scribes did.",
    region: { x: 136, y: 190, w: 14, h: 160 },
  },
  {
    id: "initial",
    label: "The big first letter",
    plain:
      "The press left a gap here. An artist painted the big first letter by hand afterwards, so every copy looks a little different.",
    region: { x: 40, y: 60, w: 38, h: 56 },
  },
  {
    id: "rubric",
    label: "Headings added in red",
    plain:
      "Headings and chapter marks were added by hand, usually in red ink. That job is called rubrication, from the Latin word for red. Here it is shown hatched.",
    region: { x: 156, y: 50, w: 102, h: 14 },
  },
  {
    id: "border",
    label: "Painted vines in the margin",
    plain:
      "Owners paid artists to decorate their copy. The printed words were the same in every copy, but the decoration was not. It was a mix of old and new: printed text, hand-made art.",
    region: { x: 12, y: 40, w: 26, h: 320 },
  },
  {
    id: "no-numbers",
    label: "No page numbers",
    plain:
      "There are no page numbers and no title page. Those came later, as printers worked out what readers found useful.",
    region: { x: 120, y: 360, w: 60, h: 26 },
  },
  {
    id: "material",
    label: "Paper or calfskin",
    plain:
      "About 180 copies were printed, most on paper and some on vellum, a fine calfskin. About 49 survive, in whole or in part.",
    region: { x: 250, y: 12, w: 38, h: 38 },
  },
];
