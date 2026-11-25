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
| The patch | Cut out of the company's own heat-readiness flyer. Ask for the original artwork. |
| 2027 company, department and association officers | The company's "2027 Fire Officers" announcement |
| Photos (hero, rigs, gallery) | The company's public posts, supplied as image files |
| Engine 52, the water and ice rescue unit, the rescue boat | Seen and lettered in those photos. Years and specifications still needed. |
| Firehouse address and phone | Business directory listing. **Confirm both with the company.** |
| Engine 51 | 1st Responder News, July 27, 2023 |
| Three calls and the news items | WRNJ Radio (June 11, 2026 and Dec. 22, 2025) and a Dec. 2025 report on the Circle Avenue fire |
| How to join | Township "Become a Firefighter" page |
| Lake history entry | White Meadow Lake Property Owners Association history page |

The photo of the firehouse shows older trucks than the ones in service now.

## What is a placeholder

Call totals, the events list, the fund drive, the partner program and its prices, drill and meeting nights, the founding entry in the history and the chief officer's message.

The nine partner businesses are invented. They are the sample sponsors from the Larkin Mills demo, with one renamed (Sawmill Road Lumber). None is a real sponsor of the company.

The gear picture in the Join section is computer-generated, and its caption says so. Its patch, sign and truck read "White Meadow Lake Fire Dept."; the company's own truck is lettered "White Meadow Lake Co. 5", and the patch on it is not the company's real one. Replace the picture with a photo of the company's own gear when there is one.

## Assets to collect

- The patch as original artwork (the one in use is cut from a flyer)
- Photos: the firehouse, Engine 51 and the rest of the fleet, members, a drill, an event
- The full apparatus list
- Drill night and meeting night
- A few lines from the chief
- Founding year and a short history
- The real fund drive, if there is one, and how donations are taken

Everything is set in `data/site.js`. Photo slots work the same way as in the Larkin Mills template.

## The welcome

The first time someone opens the site, the company's patch is on fire. A hose stream comes in from the corner and knocks the fire down, steam comes off the badge, and the welcome message opens. Visitors can aim the hose with the mouse or a finger; left alone it finds the fire by itself in about five seconds. It is drawn by `js/welcome.js` and the "first-visit welcome" block in `css/site.css`.

- The flames are computed in the browser from the outline of whichever badge the site uses, so a new department's patch burns in its own shape. There is no video or picture file to make.
- `welcome` in `data/site.js` holds the title, the text, the three links and the button label. On this concept the popup also carries the "Website concept" note.
- Each visitor sees it once. Change `id` (say from `"launch"` to `"spring-drive"`) to show a new message to everyone again. `on: false` switches it off.
- Add `?welcome` to the address to play it on demand, or use "Play the welcome again" in the footer.
- "Skip the fire", the close button, the Esc key and a click outside all get past it.
- Visitors whose device is set to reduce motion, or who pressed "Pause motion", get the badge and the message with no fire.

## Hosting

`wrangler.toml` serves this folder as a Cloudflare Worker named `white-meadow-lake-fire-concept`, so the address itself says "concept". Every push to `main` publishes to https://white-meadow-lake-fire-concept.kandyanything.workers.dev. `_headers` and `robots.txt` keep search engines out. Pictures are kept by browsers for only five minutes (`_headers`) while they are still being swapped; raise that for a real launch, and give a replaced picture a new file name. Leave the concept labels in place for as long as the link is live.
