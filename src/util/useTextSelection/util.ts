import DOMIterator from "../../mark.js/domiterator";
import Mark from "../../mark.js/mark";

type TextNodeType = ChildNode & {
  text: Text;
  ignore: boolean;
  offset: number;
}


/**
 * @intro 设置虚拟文本节点
 * @param textNodes
 */
export function initVTextNodes(textNodes: Node[]) {
  let offset = 0;
  let vTextNodes = [];
  for (let i = 0; i < textNodes.length; i++) {
    const text = textNodes[i];

    // @ts-ignore
    let ignore = text?.ignore;
    vTextNodes.push({
      text,
      ignore: ignore || false,
      offset: ignore ? -1 : offset,
    })
    if (!ignore) {
      offset += text.textContent ? text.textContent.length : 0; //跳过忽略节点
    }
  }
  return vTextNodes;
}


/**
 * 切割文本字符串
 * @param vTextNodes
 * @param text
 * @param offset
 * @param tips
 */
export function splitVTextNode(vTextNodes: vText[], text: Text, offset: number, tips: string): vText | void {

  // debugger
  let i = vTextNodes.findIndex(item => item.text === text)
  if (i !== -1) {
    // 选中文字起点元素
    let vTextNode = vTextNodes[i];
    const newText = vTextNode.text.splitText(offset);
    let textContent = vTextNode.text.textContent;
    const newVText = {
      text: newText,
      ignore: vTextNode.ignore,
      offset: vTextNode.offset + (textContent?.length || 0)
    }
    console.log(`${tips}====> vTextNodes`, {vTextNodes, vTextNode, text, offset, newText, newVText, textContent});
    vTextNodes.splice(i + 1, 0, newVText)
    return newVText;
  } else {
    console.log(`${tips}/vTextNodes`, {vTextNodes}, text, i);
    console.error("bug，找不到可以splitVTextNode的节点，请联系开发人员")
  }
}

interface vText {
  text: Text, //文本节点
  ignore: boolean,//是否是忽略节点
  offset: number, //相对起始节点的偏移量
}

/**
 * @intro 获取节点下所有的文本节点
 * @param node 节点
 * @param ignoreClass 忽略class下的文本节点
 * @returns 所有文本节点
 */
export function getTextNodes(node: Node, ignoreClass: string[] = [], ignore = false): any[] {
  let textNodes = [];
  let e = node.childNodes;

  for (let i = 0; i < e.length; i++) {
    let element = e[i] as any;
    element.ignore = ignore;
    const classNames = getClassNames(element)
    if (ignoreClass.length > 0 && classNames.length > 0) {
      if (ignoreClass.some(item => classNames.includes(item))) {
        element.ignore = true;
      }
    }


    if (element.nodeType === NodeTypes.TEXT_NODE && element.parentElement?.nodeName !== "SCRIPT" && element.textContent?.trim() !== "") {
      // console.log("element",element.nodeType,element.nodeName)

      // console.dir(element)
      // console.dir(element.textContent)
      if (element.textContent && element.textContent !== '\n') {
        textNodes.push(element);
      }

    } else if (element.nodeType === NodeTypes.ELEMENT_NODE) {
      textNodes.push(...getTextNodes(element, ignoreClass, element.ignore));
    }
  }
  return textNodes;
}

/**
 * 获取节点的class
 * @param node 节点
 * @returns
 */
function getClassNames(node: Node) {
  let classNames: string[] = []
  if (node.nodeType === NodeTypes.ELEMENT_NODE) {
    const ele = (node as Element);
    if (ele?.className?.split) {
      classNames = ele.className.split(" ");
    }
  }
  return classNames

}

export enum NodeTypes {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3
}

export function getTextNode(el: Element | any) {
  return new Promise((resolve, reject) => {
    let nodes: HTMLElement[] = [];
    new DOMIterator(el).forEachNode(NodeFilter.SHOW_TEXT, node => nodes.push(node), () => NodeFilter.FILTER_ACCEPT, () => resolve(nodes));
  });
}


export function getAllTextNode(root: HTMLElement) {
  console.log('root', root);
  let nodes: Node[] = [];
  let iterator = document.createNodeIterator(
    root, // 根节点
    NodeFilter.SHOW_TEXT, // 只包括元素节点
    node => {
      // 是否排除节点
      if (Mark.matchesExclude(node.parentNode)) {
        // 拒绝
        return NodeFilter.FILTER_REJECT;
      } else {
        // 同意
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  let node;
  while ((node = iterator.nextNode()) !== null) {
    nodes.push(node);
  }
  console.log('nodes', {nodes});
  return nodes;
}
