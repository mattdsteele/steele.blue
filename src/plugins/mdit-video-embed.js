export const getVideoType = (codeBlock) => {
    const mappings = {
        youtube(input) {
            let embed;
            if (input.includes('/embed/')) {
                embed = input.substring(input.lastIndexOf('/') + 1);
            } else {
                embed = input.substring(input.lastIndexOf('=') + 1);
            }
            return {
                type: 'youtube',
                embed
            }
        },
        vimeo(input) {
            return {
                type: 'vimeo',
                embed: input.substring(input.lastIndexOf('/') + 1)
            }
        }
    }
    const colonIdx = codeBlock.indexOf(':');
    if (colonIdx === -1) {
        return null;
    }
    const type = codeBlock.substring(0, colonIdx);
    const url = codeBlock.substring(colonIdx + 1);
    if (!type) {
        return null;
    }
    if (!Object.hasOwn(mappings, type)) {
        return null;
    }
    return mappings[type](url);
}

export const videoEmbed = (md) => {
  console.log(md.renderer.rules.code_inline);
  const originalCodeLine = md.renderer.rules.code_inline;
  const newCodeInline = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const embeddedVideo = getVideoType(token.content);
    if (embeddedVideo) {
        return `${embeddedVideo.type}! ${embeddedVideo.embed}`;
    }
    return originalCodeLine(tokens, idx, options, env, self);
  }
  md.renderer.rules.code_inline = newCodeInline;
};
