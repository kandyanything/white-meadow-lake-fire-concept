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
   partner program, drill night, founding history.
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
      support: "A placeholder fund drive. No payment is taken on this page.",
      partners: "A proposed partner program. The businesses are invented and the prices are examples.",
      history: "The company's own history goes here. The founding entry is a placeholder.",
      safety: "General fire safety advice, to be reviewed by the company."
    }
  },
  sampleBanner: "Website concept for {company}. This is not the company's official site, and nothing here takes payments or delivers messages.",

  /* The first-visit welcome: the badge burns, a hose stream puts it out, and this message appears.
     Each visitor sees it once. Change `id` to show a new message to everyone again, or set
     `on: false` to switch it off. Add ?welcome to the address to play it on demand. */
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
      { icon: "burn", title: "Stay safe on the ice", text: "No ice is ever completely safe. Know what to do before you go out.", action: "Ice safety", href: "#safety" },
      { icon: "report", title: "Ask a question", text: "Send a note to the firehouse. For emergencies, call 911.", action: "Contact us", href: "#contact" },
      { icon: "hall", title: "See what's coming up", text: "Drills, open houses and events at the firehouse.", action: "Events", href: "#events" },
      { icon: "hydrant", title: "Support the company", text: "Donations and local partners help pay for training and gear.", action: "Ways to give", href: "#support" }
    ]
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
    cta: { label: "Ask about joining", topic: "I want to volunteer" },
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

  events: {
    title: "At the firehouse",
    items: [
      { month: "Dec", day: "7", title: "Drill night", meta: "Placeholder. The company's drill schedule goes here." },
      { month: "Dec", day: "19", title: "Santa visits the neighborhood", meta: "Placeholder. Route and times would be posted here.", sponsor: "Three Forks Auto Body" },
      { month: "Jan", day: "9", title: "Open house at the firehouse", meta: "Placeholder. Meet the members and see Engine 51 up close." },
      { month: "Feb", day: "6", title: "Ice rescue drill on the lake", meta: "Placeholder. Spectators welcome from the shore.", sponsor: "Kettle & Crumb Bakery" }
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
    fund: { name: "Fund drive (placeholder)", raised: 18400, goal: 30000, note: "A real drive would name what the money buys." },
    amounts: [25, 50, 100, 250],
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
