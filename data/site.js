/* ============================================================================
   SITE DATA — White Meadow Lake Fire Company 5 (website concept)

   This is a pitch, not the company's site. Nothing here has been supplied or
   approved by the company yet.

   WHERE EACH FACT CAME FROM
   - Name, parent department, the five companies: Rockaway Township code and
     the township's "Become a Firefighter" page.
   - Officers: the company's own "2027 Fire Officers" announcement.
   - Patch and photos: the company's public posts, supplied as image files.
   - Firehouse address and phone: a business directory listing. CONFIRM both.
   - Engine 51: 1st Responder News, July 2023.
   - The three calls and the two news items: WRNJ Radio and other local news.
   - How to join: the township's "Become a Firefighter" page.

   Everything else is a PLACEHOLDER and is tagged "Sample" on the page (see
   `concept.sample` below): call totals, events, the fund drive, services,
   partner program, drill night, founding history, and all of the newer
   blocks: the feed captions, the year in numbers, the neighbors, the ice
   status and guidance, Santa night, house-number signs, the partner report
   and the figures at the end of the tour.

   The one live thing: weather alerts come straight from the National Weather
   Service's public feed for the point given in `weather`.
   ========================================================================== */
window.SITE = {
  town: "White Meadow Lake",
  state: "NJ",
  station: "5",
  companyTemplate: "{town} Fire Company 5",
  shortTemplate: "{town} Fire Co. 5",
  tagline: "Rockaway Township Fire Department, Company 5",

  /* The company's own patch, cut out of its heat-readiness flyer. Ask the company for the original artwork. */
  emblemImage: "images/brand/patch.png",
  emblemBottom: "Fire Company",
  shieldMark: "WML 5",
  coatLine: "Fire Co. 5",
  coatTown: "White Meadow",
  mapPin: "5",
  /* Labels on the three bays of the drawn firehouse. Only Engine 51 is confirmed. */
  bays: [{ code: "E", label: "5" }, { code: "E", label: "E51" }, { code: "E", label: "5" }],

  /* Rig paint for the drawn artwork, matched by eye to the photo of Engine 51. */
  livery: { body: "#B3191F", upper: "#F5F3EC", stripe: "#1B1D22", letter: "#E3B54A" },
  accent: "#A3161C",

  templateControls: false,
  motion: { density: 1 },

  /* Concept mode: a label that stays on screen, and a "Sample" tag under the heading of every
     section that holds placeholder content. Remove `concept` and `sampleBanner` only when the
     company has bought the site and supplied its own content. */
  concept: {
    badge: "Website concept",
    badgeNote: "Not the official site of White Meadow Lake Fire Company 5.",
    sample: {
      calls: "The totals are placeholder figures. The three calls listed were reported in local news.",
      events: "Placeholder dates, events and sponsors. The news items are real, from local reports.",
      support: "A placeholder fund drive and a sample sign offer. No payment is taken on this page.",
      partners: "A proposed partner program. The businesses are invented and the prices are examples.",
      history: "The company's own history goes here. The founding entry is a placeholder.",
      safety: "General fire safety advice, to be reviewed by the company.",
      feed: "Invented captions on the company's photos. On a live site the company's own posts arrive here by themselves.",
      year: "Placeholder figures.",
      neighbors: "Invented people, to show the idea. The company's own members go here, with their say-so.",
      lake: "General ice-safety guidance and a placeholder status, for the company to review and set. The weather alerts are live.",
      santa: "A demonstration. The route, the stops and the times are invented."
    }
  },
  sampleBanner: "Website concept for {company}. This is not the company's official site, and nothing here takes payments or delivers messages.",

  /* The welcome: the badge burns, a hose stream puts it out, and this message appears.
     It opens on every visit until the visitor ticks "Don't show this again". `once: true` shows it
     a single time instead, `on: false` switches it off, and changing `id` brings it back for
     everyone who ticked the box. Add ?welcome to the address to play it on demand. */
  welcome: {
    on: true, id: "launch",
    title: "Welcome to our new site.",
    text: "Everything about {company} in one place: how to join, the rigs, what's coming up and ways to help.",
    links: [{ label: "Join the company", href: "#join" }, { label: "See the rigs", href: "#apparatus" }, { label: "Support us", href: "#support" }],
    button: "Take a look around"
  },

  contact: {
    address: "1 Pawnee Avenue",
    cityLine: "Rockaway, NJ 07866",
    nonEmergency: "(973) 627-4195",
    email: "",
    drill: "",
    meeting: "",
    extra: [["Fire headquarters (applications)", "973-983-2865"]],
    mapLink: "https://www.google.com/maps/search/?api=1&query=1+Pawnee+Ave%2C+Rockaway%2C+NJ+07866",
    social: [
      { label: "Facebook", url: "https://www.facebook.com/p/White-Meadow-Lake-Fire-Company-5-100057396461612/" },
      { label: "Instagram", url: "https://www.instagram.com/whitemeadowlakefireco5/" }
    ]
  },

  signLines: ["Volunteers needed", "Stop in and ask"],

  /* Live weather alerts for this point, from the National Weather Service's public feed.
     Nothing to maintain: when the Service issues an alert for the township it appears under the
     top strip and in the lake section, and it leaves when the alert ends. Add ?alert to the
     address to see a sample one on a quiet day. */
  weather: { lat: 40.9237, lon: -74.5107, place: "Rockaway Township", demoEvent: "Winter Weather Advisory" },

  /* The guided tour, for showing the site to the company. Start it from the "Website concept"
     badge or by adding ?tour to the address. `at` is the id of the section each step points at.
     SET `offer.price` (your yearly price) and `offer.contact` before you show it. */
  tour: {
    button: "Take the 60-second tour",
    seconds: 7,
    steps: [
      { at: "top", title: "Built for Company 5", text: "Your patch, your rigs, your officers, your photos. Here is what this site would do for the company, in about a minute.", action: "welcome", actionLabel: "Play the welcome" },
      { at: "feed", title: "It updates itself", text: "Keep posting to Facebook and Instagram the way you do now. The posts show up here on their own, so nobody has to learn a website." },
      { at: "year", title: "Your year, added up", text: "Training and volunteer hours turned into a dollar figure for the fund-drive letter and the township budget meeting." },
      { at: "join", title: "It recruits", text: "A visitor types a last name and sees it on the coat. The interest form goes straight to the membership chair's phone.", action: "apply", actionLabel: "Open the form" },
      { at: "neighbors", title: "Faces, not just trucks", text: "People join people. Members shown with their day jobs is the best recruiting page a volunteer company can have." },
      { at: "lake", title: "Made for a lake company", text: "A status sign an officer changes from a phone, and weather alerts that arrive live from the National Weather Service.", alert: true },
      { at: "santa", title: "The night everyone visits", text: "On Santa night the map follows the engine, and the whole neighborhood opens the site to see when to come outside." },
      { at: "support", title: "It raises money", text: "A goal people can watch fill up, monthly giving, a code to print on the mailed letter, and house-number signs ordered online." },
      { at: "partners", title: "And it pays for itself", text: "Local businesses support the company through the site, and each one gets a monthly report showing what it got for the money.", action: "report", actionLabel: "See a sample report" },
      { end: true, title: "What it costs the company" }
    ],
    offer: {
      price: 1800,      /* PLACEHOLDER: your yearly price */
      lines: [
        "{count} local partners at the prices on this page bring in {total} a year.",
        "The site, hosting, updates and support cost {price} a year.",
        "That leaves {left} a year for the company before the first donation."
      ],
      note: "Example figures, to be agreed.",
      qrLabel: "Open it on your own phone",
      qrText: "Point the camera at the code.",
      contact: "",      /* PLACEHOLDER: "Your Name, 973-555-0100, you@example.com" */
      contactBlank: "Your name, phone and email go here."
    }
  },

  alert: { active: false, text: "", link: null },

  hero: {
    /* Three of the company's own photos, cross-fading every `slideSeconds`. `pos` sets which part
       of each photo stays in view when the screen crops it. */
    slideSeconds: 7,
    slides: [
      { src: "images/hero/firehouse.jpg", alt: "The firehouse on Pawnee Avenue with the company's trucks and rescue boat parked in front", pos: "50% 48%" },
      { src: "images/hero/boat-launch-sunset.jpg", alt: "Engine 52 and Engine 51 at the lake's boat launch at sunset, with members at the water's edge", pos: "50% 58%" },
      { src: "images/hero/drill-at-dusk.jpg", alt: "Members gathered around Engine 51 at the boat launch at dusk", pos: "50% 56%" }
    ],
    title: "When the alarm sounds, your neighbors go.",
    text: "{company} is one of the five volunteer companies of the Rockaway Township Fire Department, based on Pawnee Avenue.",
    primary: { label: "Become a volunteer", href: "#join" },
    secondary: { label: "Support the company", href: "#support" }
  },

  tasks: {
    title: "What do you need from us?",
    items: [
      { icon: "door", title: "Join the company", text: "No experience needed to ask. You must be 18 or older.", action: "See how to join", href: "#join" },
      { icon: "alarm", title: "Check your smoke alarms", text: "One on every level and in every bedroom, tested monthly.", action: "Safety basics", href: "#safety" },
      { icon: "burn", title: "Stay safe on the ice", text: "No ice is ever completely safe. Know what to do before you go out.", action: "Ice safety", href: "#lake" },
      { icon: "report", title: "Ask a question", text: "Send a note to the firehouse. For emergencies, call 911.", action: "Contact us", href: "#contact" },
      { icon: "hall", title: "See what's coming up", text: "Drills, open houses and events at the firehouse.", action: "Events", href: "#events" },
      { icon: "hydrant", title: "Support the company", text: "Donations and local partners help pay for training and gear.", action: "Ways to give", href: "#support" }
    ]
  },

  /* What the company posted lately. On a live site these come from the company's Facebook and
     Instagram pages by themselves; here the captions are invented. */
  feed: {
    title: "Latest from the firehouse",
    text: "Whatever the company posts on Facebook or Instagram shows up here on its own.",
    items: [
      { from: "Facebook", when: "2 days ago", photo: "images/hero/drill-at-dusk.jpg", pos: "50% 60%", alt: "Members gathered around Engine 51 at the boat launch at dusk", text: "At the boat launch with Engine 51 until the light ran out." },
      { from: "Instagram", when: "Last week", photo: "images/rigs/rescue-boat.jpg", alt: "Four members in the rescue boat on the lake", text: "Boat crew out on the lake for training." },
      { from: "Facebook", when: "November 14", photo: "images/photos/color-guard.jpg", alt: "Members in dress uniform carry the company flag and the American flag", text: "The color guard, ready to step off." }
    ],
    more: { label: "Follow the company on Facebook", href: "https://www.facebook.com/p/White-Meadow-Lake-Fire-Company-5-100057396461612/" }
  },

  /* The year added up. `worth` multiplies the volunteer hours by a dollar value for an hour of
     volunteer time: use the current published figure. */
  year: {
    title: "What a year of volunteering adds up to",
    text: "Nobody at the Pawnee Avenue firehouse is paid. This is what the township got anyway.",
    stats: [
      { n: 3140, label: "hours of training" },
      { n: 9870, label: "volunteer hours in all" },
      { n: 42, label: "active members" },
      { n: 365, label: "days a year someone is on call" }
    ],
    worth: { hours: 9870, rate: 34, text: "{hours} volunteer hours at {rate} an hour: service the township's taxpayers did not have to pay for." }
  },

  /* Members with their day jobs. Invented here. Use real members only with their say-so; add
     `photo:` to any of them to replace the initials. */
  neighbors: {
    title: "The people on the truck live down the street.",
    text: "They have day jobs, kids and lawns to mow, and a pager on the nightstand.",
    items: [
      { name: "Dana R.", job: "Middle-school science teacher", role: "firefighter", since: 2019 },
      { name: "Marcus T.", job: "Electrician", role: "engine driver", since: 2011 },
      { name: "Priya S.", job: "Hospital nurse", role: "firefighter", since: 2021 },
      { name: "Tom B.", job: "Retired mail carrier", role: "life member", since: 1994 },
      { name: "Jenna K.", job: "College student", role: "probationary member", since: 2026 },
      { name: "Luis M.", job: "Diesel mechanic", role: "ice and water rescue", since: 2015 }
    ],
    cta: { label: "Add your name to the list", href: "#join" }
  },

  calls: {
    year: 2026,
    through: "November",
    total: 386,
    note: "Every one answered by a volunteer.",
    byType: [
      { label: "Fire alarms", n: 118 }, { label: "Vehicle crashes", n: 61 }, { label: "Mutual aid to other companies", n: 57 },
      { label: "Gas and CO", n: 44 }, { label: "Service calls", n: 39 }, { label: "Brush and outdoor", n: 28 },
      { label: "Structure fires", n: 21 }, { label: "Water and ice rescue", n: 18 }
    ],
    recentTitle: "In the news",
    recent: [
      { when: "Jun 10, 2026, 1:20 PM", type: "Second-alarm house fire", where: "White Meadow Road", units: ["E51"] },
      { when: "Dec 22, 2025, 8:30 AM", type: "Ice rescue, dog through the ice", where: "White Meadow Lake Clubhouse", units: ["Co. 5", "Co. 3"] },
      { when: "Dec 14, 2025, 10:22 AM", type: "Two-alarm house fire", where: "Circle Avenue", units: ["Co. 5"] }
    ],
    foot: "These three calls are from local news reports. A live site would list the company's own run log."
  },

  join: {
    title: "There's a coat with your name on it.",
    text: "Rockaway Township's fire companies are all volunteer and always looking for members. Stop by the firehouse and ask what it is all about.",
    coatLabel: "See it. Type your last name:",
    coatDefault: "Your name",
    /* A computer-generated picture, and said to be one on the page. Replace it with a photo of the
       company's own gear. `name` and `zoom` are measured on this picture: see the template README. */
    gear: {
      photo: "images/gear/gear-white-meadow-lake.jpg", width: 1448, height: 1086,
      alt: "Two sets of tan turnout gear on stands in an apparatus bay, one seen from the front and one from the back. The back of the coat has a name panel across the shoulders and a red cross patch lettered White Meadow Lake Fire Dept.",
      caption: "A computer-generated picture, for layout only. A photo of the company's own gear goes here.",
      namedCaption: "{name}, across the shoulders. A computer-generated picture, for layout only.",
      name: { blank: "images/gear/gear-white-meadow-lake-name.png", box: [878, 134, 230, 64], arc: "M880 178.4 Q990 161.4 1100 178.4", size: 30, max: 186, color: "#D8C4B1" },
      zoom: [670, 50, 640, 480]
    },
    cta: { label: "Ask a question first", topic: "I want to volunteer" },
    /* The interest form. The drill-night dates are placeholders. */
    apply: {
      button: "Tell us you're interested",
      title: "Tell us you're interested",
      text: "It takes two minutes. A member calls you back, and you can watch a drill before you decide anything.",
      interests: ["Fighting fires", "Ice and water rescue", "Driving the engines", "Helping behind the scenes"],
      visits: { label: "Want to come to a drill night? (sample dates)", none: "Not yet, call me first", options: ["Monday, December 7, 7 PM", "Monday, December 14, 7 PM", "Monday, December 21, 7 PM"] },
      submit: "Send it",
      done: "Demo only: nothing was sent. On the live site this goes straight to the membership chair's phone and inbox, and you get a text to confirm."
    },
    perks: ["18 or older", "In good physical shape", "Ready to train, drill and answer alarms"],
    steps: [
      { title: "Stop by", text: "Visit the firehouse at 1 Pawnee Avenue and meet the members." },
      { title: "Apply", text: "Call fire headquarters at 973-983-2865 for an application, or download it from the township's website." },
      { title: "Train", text: "Complete the required firefighter training course." },
      { title: "Answer alarms", text: "Come to the scheduled meetings and drills, and respond when a call comes in." }
    ],
    roles: [
      { label: "Engine", color: "#B3191F", title: "Engine company", text: "The crews of Engine 51 and Engine 52: hose lines, water supply and search." },
      { label: "Rescue", color: "#1D4E89", title: "Ice and water rescue", text: "A trained team for the lake, with its own rescue unit and boat." },
      { label: "Assoc.", color: "#E9B949", title: "The association", text: "The president, secretary and treasurer run the company's business side." }
    ],
    faq: [
      { q: "How old do I have to be?", a: "At least 18." },
      { q: "What is expected of a member?", a: "Attend the regularly scheduled meetings and drills, answer alarms, and complete the required firefighter training course." },
      { q: "How do I apply?", a: "Call fire headquarters at 973-983-2865 for an application, download the new membership application from the Rockaway Township website, or stop by the firehouse." },
      { q: "Is this a paid job?", a: "No. Rockaway Township is protected by five volunteer fire companies." }
    ]
  },

  apparatus: {
    title: "The rigs",
    text: "What rolls out of the Pawnee Avenue firehouse, and onto the lake.",
    fleet: "Years and specifications for Engine 52, the rescue unit and the boat will come from the company.",
    rigs: [
      { type: "engine", photo: "images/rigs/engine-51.jpg", code: "E", name: "Engine 51", kind: "2023 Pierce Impel XM pumper", text: "Shown drafting water from White Meadow Lake. Delivered in 2023, with a top-mounted pump panel and a raised-roof cab.", specs: [["Pump", "2,000 gallons a minute"], ["Water on board", "1,000 gallons"], ["Seats", "8 firefighters"], ["In service", "2023"]] },
      { type: "engine", photo: "images/rigs/engine-52.jpg", code: "E", name: "Engine 52", kind: "Seagrave pumper", text: "The company's second engine, here at the boat launch with Engine 51.", specs: [["Make", "Seagrave"], ["Unit", "E-52"]] },
      { type: "rescue", photo: "images/rigs/water-ice-rescue-unit.jpg", plate: "Ice", tab: "Water and ice rescue", code: "R", name: "Water and Ice Rescue Unit", kind: "Rescue truck", text: "The truck that carries the team and its equipment to calls on the water and the ice.", specs: [["Role", "Water and ice rescue"], ["Led by", "Ice/water rescue coordinator"]] },
      { type: "rescue", photo: "images/rigs/rescue-boat.jpg", plate: "Boat", tab: "Rescue boat", code: "M", name: "Rescue boat", kind: "Marked Water 5 Rescue", text: "A crew of four on White Meadow Lake.", specs: [["Role", "Water rescue on the lake"]] }
    ]
  },

  officers: {
    title: "Company officers",
    text: "The 2027 officers, as announced by the company.",
    portraits: "initials",
    chief: {
      rank: "Assistant Fire Chief", name: "Eric Sarrel",
      placeholder: "A short message from the company's chief officer goes here, in his own words."
    },
    line: [
      { rank: "Fire Captain", name: "Scott Lovenberg" },
      { rank: "Fire Lieutenant", name: "Daniel McDonald" },
      { rank: "Fire Lieutenant", name: "Daniel Lovenberg" },
      { rank: "Ice/Water Rescue Coordinator", name: "Jack Albert" }
    ],
    captains: [],
    deptTitle: "Department officers",
    dept: [
      { rank: "Chief of Department", name: "Randy Miller" },
      { rank: "Deputy Fire Chief", name: "Brian McCormack" }
    ],
    adminTitle: "Association officers",
    admin: [
      { rank: "President", name: "Tom Garvey" },
      { rank: "Vice President", name: "Mark Keck" },
      { rank: "Treasurer", name: "Brian McCormack" },
      { rank: "Secretary", name: "Kyle Yelavich" }
    ]
  },

  safety: {
    title: "Most of our calls are preventable.",
    seasonal: { label: "Ice season", text: "No ice is ever completely safe. Keep pets on a leash near the lake. If a person or a pet goes through, call 911 and stay on shore." },
    items: [
      { icon: "alarm", title: "Smoke alarms", text: "One on every level and in every bedroom. Test them monthly. Replace the whole alarm after 10 years." },
      { icon: "co", title: "Carbon monoxide", text: "If the CO alarm sounds, get outside and call 911." },
      { icon: "door", title: "Bedroom doors", text: "Sleep with the door closed. It holds back heat and smoke for the minutes you need." },
      { icon: "burn", title: "Heating", text: "Keep anything that burns three feet from space heaters and wood stoves. Have the chimney cleaned once a year." },
      { icon: "hydrant", title: "Hydrants", text: "After a storm, clear the snow three feet around the hydrant on your block." }
    ],
    cta: { label: "Ask a fire safety question", topic: "Fire safety question" }
  },

  /* Ice and water. `status.level` is "off" (red), "caution" (amber) or "ok" (green). The guide rows
     are [inches for the drawing, label, what it holds, true for the stay-off row]. */
  lake: {
    title: "On the ice, and on the water",
    text: "Company 5 keeps a water and ice rescue team for the lake. Most of its calls start with someone who thought the ice would hold.",
    status: { level: "off", kicker: "Lake ice today", label: "Stay off the ice", text: "The lake is not safe to walk on. Keep dogs on a leash near the shore.", updated: "An officer sets this sign from a phone." },
    guideTitle: "How thick is thick enough?",
    guide: [[3, "Under 4 in", "Stay off", true], [4, "4 in", "On foot, ice fishing"], [6, "5 to 7 in", "Snowmobile or small ATV"], [10, "8 to 12 in", "Car or small pickup"]],
    guideNote: "For new, clear ice only. White or snow-covered ice holds about half as much, and thickness changes from one spot to the next.",
    seeTitle: "If someone goes through",
    see: ["Call 911 and say exactly where they are.", "Stay on shore. A rescuer who walks out becomes the second person in the water.", "Reach or throw: a branch, a rope, a cooler, anything that floats."],
    selfTitle: "If it is you",
    self: ["Keep your winter clothes on. They hold air and help you float.", "Turn back the way you came. That ice held you a moment ago.", "Kick hard, pull yourself flat onto the ice, then roll away from the hole."]
  },

  /* Santa night. On the real night the map follows a phone riding on the engine; here the engine
     runs a made-up loop. Delete `santa` after the holidays and it disappears. */
  santa: {
    title: "Santa is riding the engine.",
    text: "On the night, this map follows the truck, so you know when to bring the kids to the curb.",
    when: "Saturday, December 19, from 5 PM",
    water: "White Meadow Lake",
    loopSeconds: 52,
    stops: [
      { name: "The firehouse, Pawnee Avenue", time: "5:00" },
      { name: "North shore", time: "5:20" },
      { name: "East shore", time: "5:45" },
      { name: "South shore and the beach", time: "6:10" },
      { name: "West shore", time: "6:35" },
      { name: "Back at the firehouse", time: "7:00" }
    ],
    sponsor: "Three Forks Auto Body",
    mapAlt: "A map of the lake with the engine's route around it and five numbered stops",
    note: "Demonstration. The engine on this map is following a made-up loop."
  },

  events: {
    title: "At the firehouse",
    items: [
      /* `date` and `hours` put an "Add to calendar" button on the event. */
      { month: "Dec", day: "7", date: "2026-12-07T19:00", hours: 2, title: "Drill night", meta: "Placeholder. The company's drill schedule goes here." },
      { month: "Dec", day: "19", date: "2026-12-19T17:00", hours: 2, title: "Santa visits the neighborhood", meta: "Placeholder. Follow the engine on the map below.", sponsor: "Three Forks Auto Body" },
      { month: "Jan", day: "9", date: "2027-01-09T11:00", hours: 3, title: "Open house at the firehouse", meta: "Placeholder. Meet the members and see Engine 51 up close." },
      { month: "Feb", day: "6", date: "2027-02-06T10:00", hours: 2, title: "Ice rescue drill on the lake", meta: "Placeholder. Spectators welcome from the shore.", sponsor: "Kettle & Crumb Bakery" }
    ],
    news: [
      { date: "June 10, 2026", title: "Second-alarm fire on White Meadow Road", text: "Engine 51's crew attacked heavy fire at the rear of a home. No injuries were reported." },
      { date: "December 22, 2025", title: "Dog rescued from the ice", text: "Company 5 members suited up and brought back a dog that had gone through the ice about 100 yards from shore." },
      { date: "July 2023", title: "Engine 51 goes in service", text: "A 2023 Pierce pumper with a 2,000 gallon-a-minute pump and a 1,000 gallon tank." }
    ]
  },

  support: {
    title: "Volunteers give the time. Neighbors help with the rest.",
    text: "Donations to {company} help pay for training, gear and the firehouse.",
    fund: { name: "2027 fund drive: a thermal camera for each engine", raised: 18400, goal: 30000, note: "212 households so far. A thermal camera lets a crew see through smoke to find a person, or a fire hidden in a wall." },
    amounts: [25, 50, 100, 250],
    monthly: true,
    /* A code that opens this section on a phone. It is made in the browser, so it always points at
       wherever the site is hosted. */
    qr: { label: "Scan to give", text: "Print this code on the fund-drive letter. It opens this page on any phone." },
    signs: {
      title: "Help us find your house in the dark",
      text: "A reflective green number sign for the end of the driveway, readable from both directions at night.",
      label: "Your house number", sample: "27",
      cta: "Order a sign for $20",
      done: "Demo only. On a live site this takes the order and payment, and the company gets a list of signs to make."
    },
    other: ["Mail a check to the firehouse at 1 Pawnee Avenue", "Ask your employer to match your gift", "Give in memory of a member"]
  },

  partners: {
    title: "Local businesses keep the bays open.",
    text: "Community partners fund training and equipment all year.",
    disclosure: "Partners are paid sponsors. A listing here is not an endorsement by {company}.",
    rotateSeconds: 7,
    utm: { source: "wmlfire5", medium: "partner" },
    tiers: [
      { name: "Engine partner", price: "$2,500 a year", items: ["Banner on the home page, shared among three partners", "Logo on the partner wall", "Sign at company events", "A thank-you post every quarter"] },
      { name: "Truck partner", price: "$1,000 a year", items: ["Logo on the partner wall", "Sign at two company events", "One thank-you post"] },
      { name: "Hose partner", price: "$350 a year", items: ["Name on the partner wall", "A thank-you in the annual mailer"] }
    ],
    cta: { label: "Ask about partnering", topic: "Community partnership" },
    /* The monthly report each partner would get. The numbers are generated for show: `views` is
       roughly how often each level is seen in a month. */
    report: {
      button: "See a sample partner report", kicker: "Partner report", month: "October 2026",
      note: "Invented figures for an invented business.",
      views: { Engine: 4000, Truck: 1700, Hose: 900 }, events: "2",
      allTitle: "Every partner this month",
      foot: "Each partner gets its own report by email on the first of the month."
    },
    top: [
      { id: "foundry-road-hardware", active: true, name: "Foundry Road Hardware", logo: "images/partners/foundry-road-hardware.svg", mark: ["Foundry Road", "Hardware"], headline: "Everything for the house since 1961", sub: "Paint, plumbing, keys cut while you wait.", cta: "Visit the store", url: "#partners", theme: { from: "#12372A", to: "#1F6B4C", accent: "#F2C14E" } },
      { id: "three-forks-auto-body", active: true, name: "Three Forks Auto Body", logo: "images/partners/three-forks-auto-body.svg", mark: ["Three Forks", "Auto Body"], headline: "Collision repair, done right the first time", sub: "Free estimates. We work with every insurer.", cta: "Get an estimate", url: "#partners", theme: { from: "#10233F", to: "#1F4E8C", accent: "#FF8A3D" } },
      { id: "kettle-and-crumb", active: true, name: "Kettle & Crumb Bakery", logo: "images/partners/kettle-and-crumb.svg", mark: ["Kettle & Crumb", "Bakery"], headline: "The coffee is on at 5:30", sub: "First responders drink free, every day.", cta: "See the menu", url: "#partners", theme: { from: "#3B2314", to: "#8A4B22", accent: "#FFE1A8" } }
    ],
    wall: [
      { name: "Foundry Road Hardware", logo: "images/partners/foundry-road-hardware.svg", tier: "Engine" }, { name: "Three Forks Auto Body", logo: "images/partners/three-forks-auto-body.svg", tier: "Engine" }, { name: "Kettle & Crumb Bakery", logo: "images/partners/kettle-and-crumb.svg", tier: "Engine" },
      { name: "Birchline Insurance Agency", logo: "images/partners/birchline-insurance.svg", tier: "Truck" }, { name: "Quarry Street Pizza", logo: "images/partners/quarry-street-pizza.svg", tier: "Truck" }, { name: "Mill Race Veterinary", logo: "images/partners/mill-race-veterinary.svg", tier: "Truck" },
      { name: "North Fork Heating & Air", logo: "images/partners/north-fork-heating-air.svg", tier: "Hose" }, { name: "Sawmill Road Lumber", logo: "images/partners/sawmill-road-lumber.svg", tier: "Hose" }, { name: "Hadley Family Dental", logo: "images/partners/hadley-family-dental.svg", tier: "Hose" }
    ]
  },

  /* The company's own photos. The first one is shown large. */
  gallery: {
    title: "On the job and off",
    items: [
      { src: "images/photos/house-fire-rear.jpg", alt: "A firefighter directs a hose stream onto a burning house from the back yard", caption: "Working a house fire from the rear" },
      { src: "images/photos/house-fire-aerial.jpg", alt: "Smoke rising from a house fire, seen from above, with an engine in the street", caption: "A working fire from the air" },
      { src: "images/photos/color-guard.jpg", alt: "Members in dress uniform carry the company flag and the American flag", caption: "The color guard" },
      { src: "images/photos/hose-line.jpg", alt: "A firefighter aims a hose stream into heavy smoke", caption: "On the hose line" },
      { src: "images/photos/company-dinner.jpg", alt: "About twenty members in dress uniform gathered on a staircase", caption: "The company, dressed for dinner" }
    ]
  },

  history: {
    title: "The lake, and the company that protects it",
    items: [
      { year: "c. 1900", title: "A dam makes the lake", text: "The White Meadow Fish and Game Club dams the brook, and the name White Meadow Lake comes into use." },
      { year: "Est.", title: "The company is founded", text: "Placeholder. The company's founding story goes here." },
      { year: "2023", title: "Engine 51 arrives", text: "A new Pierce pumper goes in service at the Pawnee Avenue firehouse." },
      { year: "2025", title: "A rescue on the ice", text: "Members bring a dog back to shore after it falls through the ice near the clubhouse." }
    ]
  },

  contactForm: {
    title: "Stop by, or send a note.",
    stationLabel: "The firehouse",
    topics: ["General question", "I want to volunteer", "Fire safety question", "Firehouse visit", "Community partnership"]
  },

  footer: {
    builtBy: "",
    status: "",
    sample: "Website concept prepared for White Meadow Lake Fire Company 5. This is not the company's official website. The patch, the photos and the officer names come from the company's public posts; the address and news items from other public sources. The partner businesses are invented, and the gear picture in the Join section is computer-generated. Items tagged Sample are placeholders."
  }
};
