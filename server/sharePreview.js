// Link previews for shared character pages.
//
// Discord, Slack, Facebook and friends don't run JavaScript, so without this
// every shared character link previews as the generic SchreckNet shell. For a
// page load of /vampire/5e/:id, /werewolf/5e/:id or /hunter/5e/:id we look the
// character up and put its name and a short summary into the <head> of the
// built index.html before sending it. Everything else falls through to the
// normal history fallback + static middleware.
const fs = require("fs");
const path = require("path");
const express = require("express");
const lib = require("./lib");
const Vampires = require("./models/vampires");
const Hunters = require("./models/Hunters");
const Garou = require("./models/werewolf/Garou");

const SITE_URL = "https://www.schrecknet.live";
const DEFAULT_IMAGE = SITE_URL + "/og-default.png";
const INDEX_PATH = path.join(__dirname, "..", "dist", "spa", "index.html");
const BLURB =
  "Built with SchreckNet, a free World of Darkness character creator.";

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );

// JSON columns normally come back parsed, but don't trust it.
const jsonField = (value, key) => {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (err) {
      return null;
    }
  }
  return value && typeof value === "object" ? value[key] || null : null;
};

const clean = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const sentence = (text) => (/[.!?]$/.test(text) ? text : text + ".");

const truncate = (text, max) =>
  text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;

const describe = (summary, concept) => {
  const parts = [];
  if (summary) parts.push(sentence(summary));
  if (concept) parts.push(sentence("Concept: " + truncate(concept, 120)));
  parts.push(BLURB);
  return parts.join(" ");
};

const LINES = {
  vampire: {
    model: Vampires,
    attributes: [
      "charName",
      "clan",
      "generation",
      "predator_type",
      "concept",
      "image_link",
    ],
    build(c) {
      const clan = clean(c.clan);
      const generation = clean(c.generation);
      const predator = clean(c.predator_type);
      const summary = [
        generation ? generation + "-generation" : null,
        clan,
        predator,
      ]
        .filter(Boolean)
        .join(" ");
      return {
        tag: clan ? "Clan " + clan : null,
        line: "VtM 5e",
        summary: summary || "Vampire: The Masquerade 5e character",
      };
    },
  },
  werewolf: {
    model: Garou,
    attributes: ["charName", "tribe", "auspice", "concept", "image_link"],
    build(c) {
      const tribe = clean(jsonField(c.tribe, "tribe_name"));
      const auspice = clean(jsonField(c.auspice, "auspice_name"));
      return {
        tag: tribe,
        line: "WtA 5e",
        summary:
          [tribe, auspice].filter(Boolean).join(" ") ||
          "Werewolf: The Apocalypse 5e character",
      };
    },
  },
  hunter: {
    model: Hunters,
    attributes: ["charName", "creed", "drive", "concept", "image_link"],
    build(c) {
      const creed = clean(jsonField(c.creed, "name"));
      const drive = clean(jsonField(c.drive, "name"));
      const summary = [
        creed ? creed + " Hunter" : null,
        drive ? "driven by " + drive : null,
      ]
        .filter(Boolean)
        .join(", ");
      return {
        tag: creed ? creed + " Creed" : null,
        line: "HtR 5e",
        summary: summary || "Hunter: The Reckoning 5e character",
      };
    },
  },
};

// Strip the shell's own title/description/OG/Twitter/canonical tags and put
// ours near the top of <head>. Works on the minified build, quoted or not.
const STRIP = [
  /<title>[\s\S]*?<\/title>/i,
  /<meta\s+(?:name|property)=["']?(?:description|og:[\w:]+|twitter:[\w:]+)["']?[^>]*>/gi,
  /<link\s+rel=["']?canonical["']?[^>]*>/gi,
];

const renderHead = (shell, meta) => {
  // With no description (404) only the title changes; the site-wide
  // preview tags stay.
  let html = shell;
  for (const re of meta.description ? STRIP : STRIP.slice(0, 1)) {
    html = html.replace(re, "");
  }
  const e = escapeHtml;
  const tags = [`<title>${e(meta.title)}</title>`];
  if (meta.description) {
    const isDefaultImage = meta.image === DEFAULT_IMAGE;
    tags.push(
      `<meta name="description" content="${e(meta.description)}">`,
      `<meta property="og:type" content="profile">`,
      `<meta property="og:site_name" content="SchreckNet">`,
      `<meta property="og:title" content="${e(meta.ogTitle)}">`,
      `<meta property="og:description" content="${e(meta.description)}">`,
      `<meta property="og:url" content="${e(meta.url)}">`,
      `<meta property="og:image" content="${e(meta.image)}">`,
      // Our card is 1200x630; a portrait's size is unknown, so keep it small.
      isDefaultImage
        ? `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`
        : "",
      `<meta name="twitter:card" content="${
        isDefaultImage ? "summary_large_image" : "summary"
      }">`,
      `<meta name="twitter:title" content="${e(meta.ogTitle)}">`,
      `<meta name="twitter:description" content="${e(meta.description)}">`,
      `<meta name="twitter:image" content="${e(meta.image)}">`,
      `<link rel="canonical" href="${e(meta.url)}">`
    );
  }
  // Right after <meta charset> (which has to stay in the first 1024 bytes),
  // or at the top of <head> if the shell has none.
  const charset = html.match(/<meta\s+charset=["']?[\w-]+["']?\s*\/?>/i);
  if (charset) {
    return html.replace(charset[0], charset[0] + tags.join(""));
  }
  return html.replace(/<head>/i, "<head>" + tags.join(""));
};

let shellCache = null;
const loadShell = () => {
  if (shellCache === null) {
    try {
      shellCache = fs.readFileSync(INDEX_PATH, "utf8");
    } catch (err) {
      // No build (dev mode): leave it to the normal middleware.
      return null;
    }
  }
  return shellCache;
};

const send = (res, status, html) => {
  res.status(status);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.send(html);
};

const router = express.Router();

// The DB lookup shares the API rate limit; the static shell itself does not.
router.get(
  "/:line(vampire|werewolf|hunter)/5e/:id(\\d+)",
  lib.getLimiter,
  async (req, res, next) => {
    // Same test connect-history-api-fallback uses: only page loads, not XHR.
    const accept = req.headers.accept || "";
    if (accept.indexOf("application/json") === 0) return next();

    const shell = loadShell();
    if (!shell) return next();

    const { model, attributes, build } = LINES[req.params.line];
    let character;
    try {
      character = await model.findByPk(req.params.id, {
        attributes,
        raw: true,
      });
    } catch (err) {
      console.error("Share preview lookup failed:", err.message);
      return next();
    }

    if (!character) {
      return send(
        res,
        404,
        renderHead(shell, { title: "Character not found | SchreckNet" })
      );
    }

    try {
      const name = clean(character.charName) || "Unnamed character";
      const { tag, line, summary } = build(character);
      const url = `${SITE_URL}/${req.params.line}/5e/${req.params.id}`;
      const ogTitle = [name, tag, line].filter(Boolean).join(" · ");
      const html = renderHead(shell, {
        title: ogTitle + " | SchreckNet",
        ogTitle,
        description: describe(summary, clean(character.concept)),
        url,
        image: lib.sanitizeImageLink(character.image_link) || DEFAULT_IMAGE,
      });
      return send(res, 200, html);
    } catch (err) {
      console.error("Share preview render failed:", err.message);
      return next();
    }
  }
);

module.exports = router;
