import { visit } from "unist-util-visit";
import { toText } from "hast-util-to-text";

/**
 * Plugin to transform `<span class=math-inline>` and `<div class=math-display>`
 * with KaTeX.
 *
 * @type {import('unified').Plugin}
 */
export default function rehypeKatex() {
  return (tree, _file) => {
    visit(tree, "element", (element) => {
      const classes =
        element.properties && Array.isArray(element.properties.className)
          ? element.properties.className
          : [];
      const inline = classes.includes("math-inline");
      const displayMode = classes.includes("math-display");

      if (!inline && !displayMode) {
        return;
      }

      const value = toText(element, { whitespace: "pre" });

      if (inline) {
        element.children = [
          {
            type: "element",
            tagName: "katex",
            properties: {
              mode: "inline",
              content: value,
            },
            children: [],
          },
        ];
      }

      if (displayMode) {
        element.children = [
          {
            type: "element",
            tagName: "katex",
            properties: {
              mode: "display",
              content: value,
            },
            children: [],
          },
        ];
      }
    });
  };
}
