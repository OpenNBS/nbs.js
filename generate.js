const fs = require("fs");
const { highlightElement } = require("speed_highlight_js");
const { JSDOM } = require("jsdom");

// Grab the files
const markdownFile = fs.readFileSync("./readme.md", "utf-8");
const templateFile = fs.readFileSync("./public/template.html", "utf-8");

// Parse the markdown
const markdownIt = require("markdown-it")({
    "html": true,
    "highlight": (code, lang = "plaintext") => {
        return `<pre><code class="shj-lang-${lang} shj-inline block" data-lang="${lang}">${markdownIt.utils.escapeHtml(code)}</code></pre>`;
    }
});
const markdown = markdownIt.render(markdownFile);
const result = templateFile.replace("%markdownFile", markdown);

// Highlight the code blocks
const dom = new JSDOM(result);
const codeBlocks = dom.window.document.getElementsByClassName("block");

async function write() {
    for (const codeBlock of codeBlocks) {
        await highlightElement(codeBlock, codeBlock.dataset.lang, "inline");
    }

    // Write to disk
    fs.writeFileSync("./public/index.html", dom.window.document.documentElement.outerHTML, "utf-8");
}

write();
