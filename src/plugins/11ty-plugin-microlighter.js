import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the on-disk root directory of an installed npm package.
 *
 * We deliberately don't resolve `${pkgName}/package.json` directly:
 * packages whose `exports` map has a wildcard (e.g. `"./*": "./dist/*"`)
 * but no explicit `"./package.json"` entry will have that subpath resolve
 * to a *nonexistent* file without error (`import.meta.resolve` performs
 * URL resolution only — it doesn't check that the target exists).
 * microlighter is exactly such a package. Instead, resolve the package's
 * real entry point and walk up from there to the nearest package.json
 * whose `name` field matches.
 */
function resolvePackageDir(pkgName) {
  const entryUrl = import.meta.resolve(pkgName);
  let dir = path.dirname(fileURLToPath(entryUrl));

  while (true) {
    const pkgJsonPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
        if (pkg.name === pkgName) return dir;
      } catch {
        // Malformed package.json — keep walking up.
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error(`[eleventy-plugin-microlighter] Could not locate the root of "${pkgName}".`);
}

function resolveAutoInitScript(pkgDir) {
  return 'dist/microlighter.min.js';
}

function resolveThemesDir(pkgDir) {
  return path.join(pkgDir, 'dist/themes');
}

export default function microlighterPlugin(eleventyConfig, options = {}) {
  const {
    // Any theme name shipped in microlighter/themes/*.css
    theme = "github",
    // Where the copied microlighter package lands in the output.
    outputDir = "assets/microlighter",
    // Matches markdown-it's default fenced-code output
    // (`<pre><code class="language-*">`) plus plain <pre><code>
    // blocks and manually authored `data-language` attributes.
    codeBlockPattern = /<pre[^>]*>[\s\S]*?<code\b|class=(["'])[^"']*\blanguage-[^"']*\1|data-language=/i,
    // Prepended to the generated asset URLs
    pathPrefix = "/",
  } = options;

  const pkgDir = resolvePackageDir("microlighter");

  const scriptRelative = resolveAutoInitScript(pkgDir);
  const themesDir = resolveThemesDir(pkgDir);
  const themeFileName = `${theme}.css`;
  if (!themesDir || !fs.existsSync(path.join(themesDir, themeFileName))) {
    const available =
      themesDir && fs.existsSync(themesDir)
        ? fs
            .readdirSync(themesDir)
            .filter((f) => f.endsWith(".css"))
            .map((f) => f.replace(/\.css$/, ""))
        : [];
    throw new Error(
      `[eleventy-plugin-microlighter] Theme "${theme}" was not found in ` +
        `microlighter's themes folder. Available themes: ${available.join(", ") || "(none found)"}`
    );
  }
  const themesDirRelative = path.relative(pkgDir, themesDir).split(path.sep).join("/");

  const normalizedOutputDir = outputDir.replace(/^\/+|\/+$/g, "");
  const normalizedPrefix =
    pathPrefix && pathPrefix !== "/" ? `/${pathPrefix.replace(/^\/+|\/+$/g, "")}` : "";

  const scriptUrl = `${normalizedPrefix}/${normalizedOutputDir}/${scriptRelative}`;
  const cssUrl = `${normalizedPrefix}/${normalizedOutputDir}/${themesDirRelative}/${themeFileName}`;

  // ---- 1. Copy the whole microlighter package into the output ---------
  // Grammars load via relative dynamic import() from the script's own
  // location, and the auto-init script itself may sit alongside other
  // files it expects to find — copying the full tree (rather than just
  // the one file) keeps every relative path intact.
  eleventyConfig.addPassthroughCopy({ [pkgDir]: normalizedOutputDir });

  // ---- 2. Only wire up CSS + JS on pages that have a code block --------
  eleventyConfig.addTransform("microlighter", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }
    if (!codeBlockPattern.test(content)) {
      return content;
    }

    let out = content;

    // Set the theme on <body>, without clobbering one set by hand.
    out = out.replace(/<body(\s[^>]*)?>/i, (match, attrs = "") => {
      if (/data-syntax-theme=/.test(attrs)) return match;
      return `<body${attrs} data-syntax-theme="${theme}">`;
    });

    if (out.includes("</head>")) {
      out = out.replace("</head>", `  <link rel="stylesheet" href="${cssUrl}">\n</head>`);
    }

    if (out.includes("</body>")) {
      out = out.replace(
        "</body>",
        `  <script type="module" src="${scriptUrl}"></script>\n</body>`
      );
    }

    return out;
  });
}