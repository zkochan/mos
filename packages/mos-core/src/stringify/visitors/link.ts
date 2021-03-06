import {SpecificVisitor} from '../visitor'
import {LinkNode} from '../../node'
import encloseURI from './enclose-uri'
import encloseTitle from './enclose-title'

/*
 * Expression for a protocol.
 *
 * @see http://en.wikipedia.org/wiki/URI_scheme#Generic_syntax
 */

const PROTOCOL = /^[a-z][a-z+.-]+:\/?/i
const MAILTO = 'mailto:'

const visitor: SpecificVisitor<LinkNode> = (compiler, node) => {
  let url = compiler.encode(node.url, node)
  compiler.context.inLink = true
  const escapedURL = compiler.encode(compiler.escape(node.url, node))
  let value = compiler.all(node).join('')

  compiler.context.inLink = false

  if (
    node.title === null &&
    PROTOCOL.test(url) &&
    (escapedURL === value || escapedURL === MAILTO + value)
  ) {
    /*
     * '\\' escapes do not work in autolinks,
     * so we do not escape.
     */

    return encloseURI(compiler.encode(node.url), true)
  }

  url = encloseURI(url)

  if (node.title) {
    url += ` ${encloseTitle(compiler.encode(compiler.escape(node.title, node), node))}`
  }

  value = `[${value}]`

  value += `(${url})`

  return value
}

export default visitor
