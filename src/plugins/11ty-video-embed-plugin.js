import { videoEmbed } from './mdit-video-embed.js';

export default async function (eleventyConfig) {
  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(videoEmbed);
  });

  const liteVimeoTest=/<lite-vimeo/;
  const liteYtTest=/<lite-youtube/;
  eleventyConfig.addTransform("video-embed", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }

    let out = content;
    if (liteVimeoTest.test(content)) {
      out = out.replace('</head>', `
        <script type="module" src="/assets/lite-vimeo-embed.js" defer></script>
        </head>
      `);
    }
    if (liteYtTest.test(content)) {
      out = out.replace('</head>', `
        <script type="module" src="/assets/lite-youtube.js" defer></script>
        </head>
      `);
    }

    return out;
  });
}
