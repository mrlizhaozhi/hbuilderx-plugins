/// <reference path="../node_modules/@dcloudio/types/lib/HBuilderX.d.ts" />

interface NamedNodeMap {
  readonly length: number;
  getNamedItem(qualifiedName: string | HBuilderX.AttrString): Attr | null;
}

interface Document {
  createAttribute(localName: string | HBuilderX.AttrString): Attr;
  /**
   * Returns a reference to the first object with the specified value of the ID attribute.
   * @param elementId String that specifies the ID value.
   */
  getElementById(elementId: string | HBuilderX.IDString):HTMLElement | null;
  /** Returns a HTMLCollection of the elements in the object on which the method was invoked (a document or an element) that have all the classes given by classNames. The classNames argument is interpreted as a space-separated list of classes. */
  getElementsByClassName(classNames: string | HBuilderX.ClassString): HTMLCollectionOf<Element>;
}

interface Element {
  hasAttribute(qualifiedName: string | HBuilderX.AttrString): boolean;
  removeAttribute(qualifiedName: string | HBuilderX.AttrString): void;
  setAttribute(qualifiedName: string | HBuilderX.AttrString, value: string | HBuilderX.AttrValueString): void;
  getAttribute(qualifiedName: string | HBuilderX.AttrString): string | HBuilderX.AttrValueString | null;
  getAttributeNode(qualifiedName: string | HBuilderX.AttrString): Attr | null;
  getAttributeNodeNS(namespace: string | null, localName: string | HBuilderX.AttrString): Attr | null;
  getAttributeNS(namespace: string | null, localName: string | HBuilderX.AttrString): string | null;
}

interface HTMLScriptElement {
	/** Retrieves the URL to an external file that contains the source code or data. */
	//@ts-ignore
	src: string | HBuilderX.JSURIString;
}

interface HTMLLinkElement {
	/** Sets or retrieves a destination URL or an anchor point. */
	//@ts-ignore
	href:string | HBuilderX.CSSURIString;
}

interface StyleSheet{
	//@ts-ignore
	readonly href: string | HBuilderX.CSSURIString | null;
}
interface CSSImportRule{
	//@ts-ignore
    readonly href: string | HBuilderX.CSSURIString;
}
interface HTMLImageElement {
	/** The address or URL of the a media resource that is to be considered. */
	//@ts-ignore
	src: string | HBuilderX.ImageURIString;
}

interface HTMLHyperlinkElementUtils {
	/**
	 * Returns the hyperlink's URL.
	 *
	 * Can be set, to change the URL.
	 */
	//@ts-ignore
	href: string | HBuilderX.URIString;
}

interface InnerHTML {
	//@ts-ignore
    innerHTML: string | HBuilderX.HTMLString;
}