import iconMap from "../iconMap";
import {
  JSXAttribute,
  JSXSpreadAttribute,
  Transform,
  Literal,
  JSXExpressionContainer,
  JSXElement,
} from "jscodeshift";

export const parser = "jsx";

const isJSXAttribute = (
  elm: JSXAttribute | JSXSpreadAttribute
): elm is JSXAttribute => {
  return elm.type === "JSXAttribute";
};

const isIconNameProp = (
  prop: JSXAttribute | JSXSpreadAttribute
): prop is JSXAttribute =>
  isJSXAttribute(prop) && prop?.name?.name === "name" && !isExpression(prop);

const isIconProp = (
  prop: JSXAttribute | JSXSpreadAttribute
): prop is JSXAttribute =>
  isJSXAttribute(prop) && prop?.name?.name === "icon" && !isExpression(prop);

const isExpression = (prop: unknown): prop is JSXExpressionContainer => {
  return (prop as JSXAttribute)?.value?.type === "JSXExpressionContainer";
};

const transform: Transform = (file, api, _options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const imports = [];
  const FIRST_IMPORT = root.find(j.ImportDeclaration).at(0);

  const renameJSXElement = (
    node: JSXElement,
    prop: JSXAttribute | JSXSpreadAttribute
  ) => {
    if (!node) return;
    if (isExpression(prop) || !isJSXAttribute(prop)) return;

    const value =
      (prop?.value as Literal)?.value ||
      (prop?.value as any)?.expression?.value;

    const iconName = iconMap[value as unknown as keyof typeof iconMap];
    const iconIdentifier = j.jsxIdentifier(iconName);
    imports.push(j.importSpecifier(j.identifier(iconName)));

    node.openingElement.name = iconIdentifier;
    node.closingElement && (node.closingElement.name = iconIdentifier);
  };

  root.findJSXElements("Icon").forEach((path) => {
    const node = path.value;
    const props = node.openingElement.attributes.filter(
      (prop) => !isIconNameProp(prop)
    );
    const nameProps = node.openingElement.attributes.filter((prop) => {
      return isIconNameProp(prop);
    });

    nameProps.forEach((prop) => renameJSXElement(node, prop));

    // remove name="" props
    node.openingElement.attributes = props;
  });

  FIRST_IMPORT.insertAfter(
    j.importDeclaration(
      imports,
      j.stringLiteral("@razorpay/blade-old"),
      "value"
    )
  );

  return root.toSource();
};

export default transform;
