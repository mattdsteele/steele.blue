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
        speakerdeck(input) {
            return {
                type: 'speakerdeck',
                embed: input.substring(input.indexOf(':') + 1)
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

const makeSpeakerdeckIframe = (id) => {
  const attrs = [
    `src="//speakerdeck.com/player/${id}"`,
    `allowfullscreen`,
    `scrolling="no"`,
    `allow="autoplay; encrypted-media"`,
    `width="600"`,
    `height="400"`
  ]
    return `<iframe ${attrs.join(' ')}></iframe>`;
}
export const videoEmbed = (md) => {
  const originalCodeLine = md.renderer.rules.code_inline;
  const newCodeInline = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const embeddedVideo = getVideoType(token.content);
    if (embeddedVideo) {
        switch (embeddedVideo.type) {
          case 'vimeo':
            return `<lite-vimeo videoid=${embeddedVideo.embed}></lite-vimeo>`;
          case 'youtube':
            return `<lite-youtube videoid=${embeddedVideo.embed}></lite-youtube>`;
            case 'speakerdeck':
            return makeSpeakerdeckIframe(embeddedVideo.embed);
        default:
            // do nothing
        }
    }
    return originalCodeLine(tokens, idx, options, env, self);
  }
  md.renderer.rules.code_inline = newCodeInline;
};
