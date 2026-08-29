import { asciinema } from './mdit-asciinema.js';

export default async function (eleventyConfig) {
  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(asciinema);
  });

  const ascPattern = /"asc-player/;
  const asciinemaScript = `<script src="https://unpkg.com/asciinema-player@3.10.0/dist/bundle/asciinema-player.min.js"></script>`;
  const asciinemaStyles = `<link rel="stylesheet" href="https://unpkg.com/asciinema-player@3.10.0/dist/bundle/asciinema-player.css" />`;
  eleventyConfig.addTransform('asciinema', function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }

    if (!ascPattern.test(content)) {
      return content;
    }

    let out = content;

    if (out.includes("</head>")) {
      out = out.replace("</head>", `
        ${asciinemaStyles}
        ${asciinemaScript}
      </head>`);
    }
    return out;

  });
}
