export const createElement = ({
  tagName,
  className,
  children,
}: {
  tagName: keyof HTMLElementTagNameMap;
  className: string;
  children?: string | HTMLElement[];
}) => {
  const node = document.createElement(tagName);
  node.classList.add(className);

  if (Array.isArray(children)) {
    node.append(...children);
    return node;
  }

  if (typeof children === "string") {
    node.textContent = children;
    return node;
  }

  return node;
};
