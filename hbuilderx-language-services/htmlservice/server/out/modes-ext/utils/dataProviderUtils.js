"use strict";function normalizeMarkupContent(e){if(e)return"string"==typeof e?{kind:"markdown",value:e}:{kind:"markdown",value:e.value}}function generateDocumentation(e,n={},t){const r={kind:t?"markdown":"plaintext",value:""};if(e.description&&!1!==n.documentation){const n=normalizeMarkupContent(e.description);n&&(r.value+=n.value)}if(e.references&&e.references.length>0&&!1!==n.references&&(r.value.length&&(r.value+="\n\n"),r.value+=t?e.references.map((e=>`[${e.name}](${e.url})`)).join(" | "):e.references.map((e=>`${e.name}: ${e.url}`)).join("\n")),""!==r.value)return r}Object.defineProperty(exports,"__esModule",{value:!0}),exports.generateDocumentation=exports.normalizeMarkupContent=void 0,exports.normalizeMarkupContent=normalizeMarkupContent,exports.generateDocumentation=generateDocumentation;