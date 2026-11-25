# White Meadow Lake Fire Company 5: website concept

A pitch built from the Larkin Mills fire department template. It is **not** the company's website, and the company has not seen or approved it yet.

Open `index.html` through a local web server, or open the single file in `dist/` by double-clicking it.

## What keeps it from being mistaken for the real thing

- A bar across the top and a badge fixed to the corner of every screen say it is a concept, not the official site.
- Sections with placeholder content carry a "Sample" tag under the heading.
- Donate, the contact form and the members' area do nothing: each shows a "demo only" note.
- Search engines are told to stay out, and the page carries no structured data naming the company.

Keep all of that in place until the company has bought the site and supplied its own content. Then remove `concept` and `sampleBanner` in `data/site.js`.

## What is real, and where it came from

| Content | Source |
|---|---|
| Company name, parent department, the five companies | Rockaway Township code; township "Become a Firefighter" page |
| 2026 line and association officers | Rockaway Township 2026 fire officer roster |
| Firehouse address and phone | Business directory listing. **Confirm both with the company.** |
| Engine 51 | 1st Responder News, July 27, 2023 |
| Three calls and the news items | WRNJ Radio (June 11, 2026 and Dec. 22, 2025) and a Dec. 2025 report on the Circle Avenue fire |
| How to join | Township "Become a Firefighter" page |
| Lake history entry | White Meadow Lake Property Owners Association history page |

The treasurer appears as "Brain McCormack" on the 2026 roster and "Brian McCormack" on the 2025 one. The site uses Brian. Confirm.

## What is a placeholder

Call totals, the events list, the fund drive, the partner program and its prices, drill and meeting nights, the founding entry in the history, the emblem (a generic cross with a 5) and the drawings.

The nine partner businesses are invented. They are the sample sponsors from the Larkin Mills demo, with one renamed (Sawmill Road Lumber). None is a real sponsor of the company.

## Photos

Three photos are in, all supplied from an image search at thumbnail size (about 330 x 220), with their origin unconfirmed: the firehouse, Engine 51 and the lettering on a cab door. They are shown small for that reason. Replace them with the company's own full-size originals.

The gear picture in the Join section is computer-generated, and its caption says so. Its back patch reads "Meadow Lake Fire Dept." (no "White") and its sign and truck say "Fire Department", where the company is "Fire Company 5". Regenerate it, or replace it with a photo of the company's own gear.

Left out on purpose:

- Two truck photos that carry a photographer's copyright notice.
- A logo that reads "Meadow Lake Fire Dept.", which is a different department.
- A group photo, a Santa photo and a house fire photo, until it is confirmed they are this company's.

Nothing was read from the company's Facebook or Instagram: those pages block automated reading.

## Assets to collect

- The company's patch or logo
- Photos: the firehouse, Engine 51 and the rest of the fleet, members, a drill, an event
- The full apparatus list
- Drill night and meeting night
- A few lines from the chief
- Founding year and a short history
- The real fund drive, if there is one, and how donations are taken

Everything is set in `data/site.js`. Photo slots work the same way as in the Larkin Mills template.

## Hosting

`wrangler.toml` serves this folder as a Cloudflare Worker named `wml-fire-co5-concept`, so the address itself says "concept". `_headers` and `robots.txt` keep search engines out. Leave the concept labels in place for as long as the link is live.
