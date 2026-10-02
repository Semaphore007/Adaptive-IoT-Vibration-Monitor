export type TokenKind = 'comment' | 'string' | 'keyword' | 'number' | 'fn' | 'preproc' | 'plain'
export interface Token {
  kind: TokenKind
  text: string
}

const KEYWORDS = new Set([
  'void', 'int', 'float', 'double', 'bool', 'char', 'const', 'unsigned', 'long', 'uint8_t', 'uint16_t', 'uint32_t',
  'if', 'else', 'for', 'while', 'return', 'true', 'false', 'struct', 'static', 'auto', 'String',
  'def', 'import', 'from', 'as', 'in', 'and', 'or', 'not', 'None', 'True', 'False', 'class', 'with', 'elif', 'print',
])

const PATTERN = /(\/\/.*|#(?:include|define)\b.*|#\s.*|"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|\b\d+(?:\.\d+)?f?\b|\b[A-Za-z_]\w*(?=\s*\()|\b[A-Za-z_]\w*\b)/g

export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  let last = 0
  for (const match of line.matchAll(PATTERN)) {
    const text = match[0]
    const index = match.index ?? 0
    if (index > last) tokens.push({ kind: 'plain', text: line.slice(last, index) })
    let kind: TokenKind = 'plain'
    if (text.startsWith('//') || /^#\s/.test(text)) kind = 'comment'
    else if (text.startsWith('#include') || text.startsWith('#define')) kind = 'preproc'
    else if (text.startsWith('"') || text.startsWith("'")) kind = 'string'
    else if (/^\d/.test(text)) kind = 'number'
    else if (KEYWORDS.has(text)) kind = 'keyword'
    else if (/^[A-Za-z_]\w*$/.test(text) && line.slice(index + text.length).trimStart().startsWith('(')) kind = 'fn'
    tokens.push({ kind, text })
    last = index + text.length
  }
  if (last < line.length) tokens.push({ kind: 'plain', text: line.slice(last) })
  return tokens
}

export const TOKEN_CLASS: Record<TokenKind, string> = {
  comment: 'text-[var(--code-comment)] italic',
  string: 'text-[var(--code-string)]',
  keyword: 'text-[var(--code-keyword)]',
  number: 'text-[var(--code-number)]',
  fn: 'text-[var(--code-function)]',
  preproc: 'text-[var(--code-preproc)]',
  plain: '',
}
