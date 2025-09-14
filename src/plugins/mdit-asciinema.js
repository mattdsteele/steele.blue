import crypto from 'node:crypto';
/**
 * @type {import('markdown-it').PluginSimple}
 */
export const asciinema = (md) => {
  /**
   * Parsing rule for asciinema markup.
   *
   * @type {import('markdown-it/lib/parser_block.mjs').RuleBlock}
   * @private
   */
  const asciinemaRule = (state, startLine, endLine, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Get current string to consider (just current line)
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const currentLine = state.src.substring(pos, max);
    if (!currentLine.startsWith('[asciinema ')) {
      return false;
    }

    const el = /^\[asciinema (.*)\]$/gi.exec(currentLine);
    const src = el[1];
    // Increment parser
    state.line = startLine + 1;
    const token = state.push('asciinema', 'asciinema', 0);
    token.block = true;
    const fileLoc = src.replace('/static', '');
    const hash = crypto.createHash('md5');
    hash.update(fileLoc);
    token.asciinema = { src: fileLoc, hash: hash.digest('hex').substring(0,6) };

    return true;
  };
  md.block.ruler.before('paragraph', 'asciinema', asciinemaRule);
  md.renderer.rules.asciinema = (tokens, index) => {
    const token = tokens[index];
    const { src, hash } = token.asciinema;
/*
*/
    return `
<div id="asc-player-${hash}"></div>
<script webc:keep defer>
const el = document.querySelector('#asc-player-${hash}');
AsciinemaPlayer.create('${src}', el, {});
</script>
`;
  };
};
