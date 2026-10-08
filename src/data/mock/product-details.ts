import type { ProductSpecification } from "@/types";

export type ProductReviewDraft = {
  author: string;
  rating: number;
  createdAt: string;
  comment: string;
};

export type ProductDetailContent = {
  description: string;
  images: string[];
  specifications: ProductSpecification[];
  reviews: ProductReviewDraft[];
};

function photo(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;
}

function specs(pairs: [string, string][]): ProductSpecification[] {
  return pairs.map(([label, value]) => ({ label, value }));
}

export const productDetails: Record<string, ProductDetailContent> = {
  "pulse-anc-headphones": {
    description:
      "Over-ear wireless headphones with adaptive noise cancelling, a 40-hour battery, and plush ear cushions for long listening sessions.",
    images: [
      photo("photo-1484704849700-f032a568e944"),
      photo("photo-1546435770-a3e426bf472b"),
      photo("photo-1583394838336-acd977736f90"),
    ],
    specifications: specs([
      ["Driver", "40 mm dynamic"],
      ["Noise control", "Adaptive ANC"],
      ["Battery", "40 hours"],
      ["Connectivity", "Bluetooth 5.3"],
      ["Weight", "248 g"],
    ]),
    reviews: [
      {
        author: "Maya Chen",
        rating: 5,
        createdAt: "2026-08-14",
        comment:
          "The noise cancelling actually cuts the train rumble. Battery lasted a full work week of commutes.",
      },
      {
        author: "Jonah Hale",
        rating: 4,
        createdAt: "2026-07-02",
        comment:
          "Comfortable for a few hours. The case is a little bulky, but the sound is clean.",
      },
      {
        author: "Priya Nair",
        rating: 5,
        createdAt: "2026-06-21",
        comment:
          "Calls stay clear even on a busy street. I use them every day at my desk.",
      },
    ],
  },
  "nova-smartwatch": {
    description:
      "A sport smartwatch with GPS, heart-rate tracking, and a bright always-on display that lasts through a weekend of workouts.",
    images: [
      photo("photo-1434493789847-2f02dc6ca35d"),
      photo("photo-1524805444758-089113d48a6d"),
    ],
    specifications: specs([
      ["Display", "1.4 in AMOLED"],
      ["GPS", "Built-in dual band"],
      ["Water resistance", "5 ATM"],
      ["Battery", "Up to 7 days"],
      ["Strap", "Silicone, interchangeable"],
    ]),
    reviews: [
      {
        author: "Elena Voss",
        rating: 5,
        createdAt: "2026-09-01",
        comment:
          "GPS tracks my runs without my phone. The screen is easy to read in sunlight.",
      },
      {
        author: "Chris Okonkwo",
        rating: 4,
        createdAt: "2026-08-11",
        comment:
          "Sleep tracking matches how I actually feel. Charging is quick, about an hour.",
      },
    ],
  },
  "aero-run-sneakers": {
    description:
      "Lightweight knit runners with a cushioned midsole and a grippy outsole for daily miles and city walks.",
    images: [
      photo("photo-1460353581641-37baddab0fa2"),
      photo("photo-1595950653106-6c9ebd614d3a"),
      photo("photo-1606107557195-0e29a4b5b4aa"),
    ],
    specifications: specs([
      ["Upper", "Engineered knit"],
      ["Drop", "8 mm"],
      ["Weight", "245 g per shoe"],
      ["Outsole", "Rubber grip"],
      ["Fit", "True to size"],
    ]),
    reviews: [
      {
        author: "Sofia Alvarez",
        rating: 5,
        createdAt: "2026-07-28",
        comment:
          "Light on my feet and no break-in period. I wore them for a 10k the week they arrived.",
      },
      {
        author: "Ben Carter",
        rating: 4,
        createdAt: "2026-06-09",
        comment:
          "Great cushion for pavement. The knit breathes well in warm weather.",
      },
    ],
  },
  "linen-throw-set": {
    description:
      "A washed linen throw and matching cushion cover, stone-washed so the fabric feels soft from the first night.",
    images: [
      photo("photo-1616628188859-7a11abb6fcc9"),
      photo("photo-1631049307264-da0ec9d70304"),
    ],
    specifications: specs([
      ["Material", "100% European linen"],
      ["Throw size", "130 × 170 cm"],
      ["Cushion cover", "50 × 50 cm"],
      ["Care", "Machine wash cold"],
      ["Finish", "Stone washed"],
    ]),
    reviews: [
      {
        author: "Hannah Brooks",
        rating: 5,
        createdAt: "2026-09-16",
        comment:
          "The linen is already soft. Color matches the photos and looks calm on a grey sofa.",
      },
      {
        author: "Omar Farouk",
        rating: 5,
        createdAt: "2026-09-04",
        comment:
          "Washes well and does not pill. The set feels heavier than a cheap throw.",
      },
    ],
  },
  "ember-leather-tote": {
    description:
      "A structured leather tote with a zip pocket and a wide shoulder strap, sized for a laptop and a day out.",
    images: [
      photo("photo-1590874103328-eac38a683ce7"),
      photo("photo-1548036328-c9fa89d128fa"),
      photo("photo-1584917865442-de89df76afd3"),
    ],
    specifications: specs([
      ["Material", "Full-grain leather"],
      ["Laptop sleeve", "Up to 14 in"],
      ["Closure", "Magnetic snap"],
      ["Strap drop", "26 cm"],
      ["Lining", "Cotton canvas"],
    ]),
    reviews: [
      {
        author: "Lila Nguyen",
        rating: 5,
        createdAt: "2026-08-19",
        comment:
          "Holds my laptop, notebook, and bottle without sagging. The leather smells clean, not chemical.",
      },
      {
        author: "Grace Patel",
        rating: 4,
        createdAt: "2026-07-30",
        comment:
          "Stiff at first, then it softened after a week. Stitching looks even.",
      },
    ],
  },
  "folio-mirrorless-camera": {
    description:
      "A compact mirrorless body with a fast kit lens, 4K video, and a grip that stays steady for handheld shots.",
    images: [
      photo("photo-1502920917128-1aa500764cbd"),
      photo("photo-1510127034890-ba27508e9f1c"),
      photo("photo-1516035069371-29a1b244cc32"),
    ],
    specifications: specs([
      ["Sensor", "24.2 MP APS-C"],
      ["Video", "4K 30 fps"],
      ["Lens mount", "Kit 16–50 mm"],
      ["Screen", "3 in vari-angle"],
      ["Weight", "403 g body only"],
    ]),
    reviews: [
      {
        author: "Andre Silva",
        rating: 5,
        createdAt: "2026-05-18",
        comment:
          "Autofocus locks onto faces quickly. Files look sharp even cropped for print.",
      },
      {
        author: "Nora Kim",
        rating: 4,
        createdAt: "2026-04-29",
        comment:
          "Small enough for a weekend bag. Battery is fine for a day if I carry a spare.",
      },
    ],
  },
  "arc-desk-lamp": {
    description:
      "A brass-finished arc lamp with a dimmable LED head, made to sit over a desk without taking the whole surface.",
    images: [
      photo("photo-1507473885765-e6ed057f782c"),
      photo("photo-1540932239986-30128078f3c5"),
    ],
    specifications: specs([
      ["Finish", "Brushed brass"],
      ["Light", "Dimmable LED"],
      ["Color temperature", "2700–4000 K"],
      ["Reach", "42 cm"],
      ["Base", "Weighted marble"],
    ]),
    reviews: [
      {
        author: "Theo Martin",
        rating: 4,
        createdAt: "2026-08-02",
        comment:
          "Warm light that does not glare on my monitor. The base is heavy enough to stay put.",
      },
      {
        author: "Aisha Rahman",
        rating: 5,
        createdAt: "2026-07-19",
        comment:
          "Looks more expensive than the price. Dimmer steps are smooth.",
      },
    ],
  },
  "glow-serum-kit": {
    description:
      "A three-step serum set with vitamin C, hyaluronic acid, and a light night oil for dull, dry skin.",
    images: [
      photo("photo-1556228720-195a672e8a03"),
      photo("photo-1571781926291-c477ebfd024b"),
      photo("photo-1612817288484-6f916006741a"),
    ],
    specifications: specs([
      ["Set", "3 serums, 30 ml each"],
      ["Key ingredients", "Vitamin C, HA, niacinamide"],
      ["Skin type", "Normal to dry"],
      ["Fragrance", "Unscented"],
      ["Use", "Morning and night"],
    ]),
    reviews: [
      {
        author: "Camille Dubois",
        rating: 5,
        createdAt: "2026-06-12",
        comment:
          "My skin looks less flat after two weeks. None of the bottles irritated my cheeks.",
      },
      {
        author: "Rita Gomez",
        rating: 4,
        createdAt: "2026-05-03",
        comment:
          "The night oil is rich but not greasy. I wish the droppers were a bit sturdier.",
      },
    ],
  },
  "carbon-keyboard": {
    description:
      "A low-profile mechanical keyboard with quiet switches, a carbon-look top plate, and USB-C charging.",
    images: [
      photo("photo-1587829741301-dc798b83add3"),
      photo("photo-1595225476474-87563907a212"),
      photo("photo-1618384887929-16ec33fab9ef"),
    ],
    specifications: specs([
      ["Layout", "75%"],
      ["Switches", "Low-profile linear"],
      ["Backlight", "White LED"],
      ["Connection", "Bluetooth and USB-C"],
      ["Battery", "Up to 40 hours"],
    ]),
    reviews: [
      {
        author: "Leo Park",
        rating: 5,
        createdAt: "2026-09-08",
        comment:
          "Quiet enough for a shared office. The low profile makes long typing sessions easier.",
      },
      {
        author: "Samira Haddad",
        rating: 4,
        createdAt: "2026-08-26",
        comment:
          "Keys feel consistent. Bluetooth reconnects fast when I switch to my laptop.",
      },
    ],
  },
  "trail-daypack": {
    description:
      "A compact daypack with a padded laptop sleeve, a hydration pocket, and straps that stay put on a hike.",
    images: [
      photo("photo-1622560480605-d83c853bc5c3"),
      photo("photo-1478827536114-da961b7f86d2"),
    ],
    specifications: specs([
      ["Capacity", "18 L"],
      ["Laptop sleeve", "Up to 14 in"],
      ["Fabric", "Recycled nylon"],
      ["Weight", "620 g"],
      ["Pockets", "Front, side, hydration"],
    ]),
    reviews: [
      {
        author: "Marcus Webb",
        rating: 5,
        createdAt: "2026-08-30",
        comment:
          "Carried a camera and a jacket on a day trail without digging into my shoulders.",
      },
      {
        author: "Ines Moreau",
        rating: 4,
        createdAt: "2026-08-07",
        comment:
          "Zippers feel solid. I would like one more small pocket for keys.",
      },
    ],
  },
  "ceramic-pour-set": {
    description:
      "A stoneware dripper, server, and two cups for a slow pour-over, finished in a matte speckled glaze.",
    images: [
      photo("photo-1511920170033-f8396924c348"),
      photo("photo-1509042239860-f550ce710b93"),
    ],
    specifications: specs([
      ["Material", "Stoneware"],
      ["Includes", "Dripper, server, 2 cups"],
      ["Capacity", "500 ml server"],
      ["Finish", "Matte speckled glaze"],
      ["Care", "Dishwasher safe"],
    ]),
    reviews: [
      {
        author: "Daniel Cho",
        rating: 5,
        createdAt: "2026-09-18",
        comment:
          "The dripper sits steady and the glaze is even. Coffee tastes cleaner than my old plastic cone.",
      },
      {
        author: "Freya Lind",
        rating: 5,
        createdAt: "2026-09-09",
        comment:
          "Beautiful on the counter. Cups are a good size for a morning pour.",
      },
    ],
  },
  "studio-monitors": {
    description:
      "A compact powered speaker pair with a balanced sound and a rear bass port for a desk or small room.",
    images: [
      photo("photo-1545454675-3531b543be5d"),
      photo("photo-1608043152269-423dbba4e7e1"),
    ],
    specifications: specs([
      ["Type", "Powered pair"],
      ["Drivers", "4 in woofer, 1 in tweeter"],
      ["Inputs", "RCA and 3.5 mm"],
      ["Power", "40 W total"],
      ["Cabinet", "MDF, rear port"],
    ]),
    reviews: [
      {
        author: "Jules Bernard",
        rating: 5,
        createdAt: "2026-09-02",
        comment:
          "Clear mids for mixing voice notes. They do not boom on a small desk.",
      },
      {
        author: "Amelia Grant",
        rating: 4,
        createdAt: "2026-08-15",
        comment:
          "Easy setup with the included cable. Volume knob is on the back, which is a small annoyance.",
      },
    ],
  },
  "volta-oled-phone": {
    description:
      "A slim OLED phone with a bright 120 Hz display, a long-lasting battery, and a camera that holds up in low light.",
    images: [
      photo("photo-1592899677977-9c10ca588bbd"),
      photo("photo-1510557880182-3d4d3cba35a5"),
    ],
    specifications: specs([
      ["Display", "6.5 in OLED, 120 Hz"],
      ["Storage", "256 GB"],
      ["Camera", "50 MP main"],
      ["Battery", "5000 mAh"],
      ["Charging", "USB-C, 45 W"],
    ]),
    reviews: [
      {
        author: "Kenji Sato",
        rating: 5,
        createdAt: "2026-08-08",
        comment:
          "Screen is sharp and the battery gets me through a full day of maps and photos.",
      },
      {
        author: "Laura Bennett",
        rating: 4,
        createdAt: "2026-07-17",
        comment:
          "Night photos are usable. The phone stays cool even while charging.",
      },
    ],
  },
  "slate-ultrabook": {
    description:
      "A 14-inch ultrabook with a quiet keyboard, all-day battery, and a matte display for writing and light editing.",
    images: [
      photo("photo-1517336714731-489689fd1ca8"),
      photo("photo-1496181133206-80ce9b88a853"),
    ],
    specifications: specs([
      ["Display", "14 in 2.2K matte"],
      ["Memory", "16 GB"],
      ["Storage", "512 GB SSD"],
      ["Battery", "Up to 14 hours"],
      ["Weight", "1.25 kg"],
    ]),
    reviews: [
      {
        author: "Owen Clarke",
        rating: 4,
        createdAt: "2026-07-22",
        comment:
          "Fan stays quiet during writing. The keyboard has a short, even travel.",
      },
      {
        author: "Mei Lin",
        rating: 5,
        createdAt: "2026-06-30",
        comment:
          "Light in a tote and the screen does not wash out near a window.",
      },
    ],
  },
  "silk-wrap-dress": {
    description:
      "A midi wrap dress in a fluid silk blend, with an adjustable tie and a lining so it sits smoothly.",
    images: [
      photo("photo-1496747611176-843222e1e57c"),
      photo("photo-1515372039744-b8f02a3ae446"),
    ],
    specifications: specs([
      ["Fabric", "Silk blend"],
      ["Length", "Midi"],
      ["Closure", "Inner tie and wrap"],
      ["Lining", "Yes"],
      ["Care", "Dry clean"],
    ]),
    reviews: [
      {
        author: "Clara Jensen",
        rating: 5,
        createdAt: "2026-09-14",
        comment:
          "The wrap stays closed when I walk. Fabric has a soft sheen without looking shiny.",
      },
      {
        author: "Nadia El-Sayed",
        rating: 4,
        createdAt: "2026-09-01",
        comment:
          "True to the size chart. I ordered my usual size and the waist hits where it should.",
      },
    ],
  },
  "wool-overshirt": {
    description:
      "A merino overshirt you can wear open or buttoned, warm enough for cool evenings and light enough for travel.",
    images: [
      photo("photo-1594938298603-c8148c4dae35"),
      photo("photo-1521572163474-6864f9cf17ab"),
    ],
    specifications: specs([
      ["Fabric", "Merino wool blend"],
      ["Weight", "280 gsm"],
      ["Fit", "Relaxed"],
      ["Pockets", "Two chest"],
      ["Care", "Cold wash or dry clean"],
    ]),
    reviews: [
      {
        author: "Hugo Meyer",
        rating: 4,
        createdAt: "2026-08-20",
        comment:
          "Warm without feeling thick. The shoulders have room for a sweater underneath.",
      },
      {
        author: "Patrick Doyle",
        rating: 5,
        createdAt: "2026-07-25",
        comment:
          "No itch at the collar. It still looks neat after a day of wear.",
      },
    ],
  },
  "lounge-accent-chair": {
    description:
      "A boucle lounge chair with a solid wood frame and a deep seat, built for a reading corner.",
    images: [
      photo("photo-1567538096630-e0c55bd6374c"),
      photo("photo-1586023492125-27b2c045efd7"),
    ],
    specifications: specs([
      ["Upholstery", "Boucle"],
      ["Frame", "Solid wood"],
      ["Seat height", "42 cm"],
      ["Width", "78 cm"],
      ["Assembly", "Legs attach with bolts"],
    ]),
    reviews: [
      {
        author: "Isabel Costa",
        rating: 5,
        createdAt: "2026-08-12",
        comment:
          "Firm enough to sit up and read. The boucle has not flattened after a month.",
      },
      {
        author: "Tom Reid",
        rating: 4,
        createdAt: "2026-07-08",
        comment:
          "Arrived in two boxes and went together in twenty minutes. Color matches the photo.",
      },
    ],
  },
  "dusk-palette": {
    description:
      "A mineral makeup palette with twelve buildable shades, from soft day neutrals to a deeper evening set.",
    images: [
      photo("photo-1522335789203-aabd1fc54bc9"),
      photo("photo-1512496015851-a90fb38ba796"),
    ],
    specifications: specs([
      ["Shades", "12 pans"],
      ["Finish", "Matte and satin"],
      ["Formula", "Mineral pigments"],
      ["Mirror", "Lid mirror"],
      ["Net weight", "18 g"],
    ]),
    reviews: [
      {
        author: "Yara Hassan",
        rating: 5,
        createdAt: "2026-06-28",
        comment:
          "Pigment is even and blends without patches. The smaller pans last longer than I expected.",
      },
      {
        author: "Emily Frost",
        rating: 5,
        createdAt: "2026-05-19",
        comment:
          "Day shades are wearable for work. Nothing in the palette looks chalky.",
      },
    ],
  },
  "studio-yoga-mat": {
    description:
      "A thick grip mat that stays put on wood floors, with alignment marks and a strap for carrying.",
    images: [photo("photo-1601925260368-ae2f83cf8b7f")],
    specifications: specs([
      ["Thickness", "6 mm"],
      ["Length", "183 cm"],
      ["Surface", "Natural rubber grip"],
      ["Alignment", "Printed guides"],
      ["Includes", "Carry strap"],
    ]),
    reviews: [
      {
        author: "Nina Petrov",
        rating: 5,
        createdAt: "2026-07-11",
        comment:
          "Does not slide during downward dog. Cushion is enough for my knees on a hard floor.",
      },
      {
        author: "Gabe Ortiz",
        rating: 4,
        createdAt: "2026-06-16",
        comment:
          "Heavier than a travel mat, which is what I wanted for home practice.",
      },
    ],
  },
  "single-origin-beans": {
    description:
      "Whole coffee beans from a single farm lot, roasted for filter brewing with a cocoa and citrus finish.",
    images: [photo("photo-1559056199-641a0ac8b55e")],
    specifications: specs([
      ["Origin", "Single farm lot"],
      ["Process", "Washed"],
      ["Roast", "Medium"],
      ["Bag", "340 g, whole bean"],
      ["Best for", "Pour-over and drip"],
    ]),
    reviews: [
      {
        author: "Helen Park",
        rating: 5,
        createdAt: "2026-08-21",
        comment:
          "Bright without being sour. I have reordered twice for weekend pour-overs.",
      },
      {
        author: "Victor Lang",
        rating: 5,
        createdAt: "2026-08-04",
        comment:
          "Roast date was recent when it arrived. The bag valve keeps it fresh.",
      },
    ],
  },
  "magnetic-phone-mount": {
    description:
      "A vent-and-dash magnetic mount with a slim metal plate that holds a phone steady on rough roads.",
    images: [photo("photo-1449965408869-eaa3f722e40d")],
    specifications: specs([
      ["Mount", "Vent clip and dash pad"],
      ["Hold", "Magnetic"],
      ["Rotation", "360°"],
      ["Plate", "Adhesive, included"],
      ["Phones", "Up to 6.8 in"],
    ]),
    reviews: [
      {
        author: "Diego Morales",
        rating: 4,
        createdAt: "2026-07-29",
        comment:
          "Stayed on the vent through a highway drive. The plate is thin enough under a case.",
      },
      {
        author: "Ruth Keller",
        rating: 4,
        createdAt: "2026-06-22",
        comment:
          "Easy one-hand grab. The dash pad holds if you clean the surface first.",
      },
    ],
  },
  "night-market-novel": {
    description:
      "A hardcover novel set over one night in a city market, printed on cream paper with a sewn binding.",
    images: [
      photo("photo-1544947950-fa07a98d237f"),
      photo("photo-1495446815901-a7297e633e8d"),
    ],
    specifications: specs([
      ["Format", "Hardcover"],
      ["Pages", "352"],
      ["Language", "English"],
      ["Binding", "Sewn"],
      ["Size", "6 × 9 in"],
    ]),
    reviews: [
      {
        author: "June Adler",
        rating: 5,
        createdAt: "2026-09-07",
        comment:
          "The binding lies open without cracking. I finished it in three evenings.",
      },
      {
        author: "Pauline Roux",
        rating: 5,
        createdAt: "2026-08-28",
        comment:
          "Print is comfortable to read. The cover art looks better in person.",
      },
    ],
  },
  "cedar-fragrance": {
    description:
      "An eau de parfum built around cedar, smoke, and a soft amber base that lasts through the evening.",
    images: [
      photo("photo-1594035910387-fea47794261f"),
      photo("photo-1592945403244-b3fbafd7f539"),
    ],
    specifications: specs([
      ["Concentration", "Eau de parfum"],
      ["Size", "50 ml"],
      ["Notes", "Cedar, smoke, amber"],
      ["Style", "Woody"],
      ["Cap", "Magnetic"],
    ]),
    reviews: [
      {
        author: "Anton Weber",
        rating: 4,
        createdAt: "2026-08-18",
        comment:
          "Smoky at first, then it settles into cedar. I still smell it at the end of the day.",
      },
      {
        author: "Leah Cohen",
        rating: 5,
        createdAt: "2026-07-27",
        comment:
          "Not sweet. Two sprays are enough and it does not overwhelm a small room.",
      },
    ],
  },
  "city-commute-helmet": {
    description:
      "A low-profile bike helmet with large vents and a dial fit, made for daily city rides.",
    images: [
      photo("photo-1485965120184-e220f721d03e"),
      photo("photo-1571068316344-75bc76f77890"),
    ],
    specifications: specs([
      ["Certification", "CPSC"],
      ["Fit", "Dial adjustment"],
      ["Vents", "14"],
      ["Weight", "290 g"],
      ["Sizes", "S–L"],
    ]),
    reviews: [
      {
        author: "Felix Berg",
        rating: 4,
        createdAt: "2026-09-10",
        comment:
          "Sits low and does not bounce. Vents keep my head cooler than my old helmet.",
      },
      {
        author: "Ava Singh",
        rating: 4,
        createdAt: "2026-08-31",
        comment:
          "Dial is easy to adjust with gloves on. The strap padding is soft.",
      },
    ],
  },
  "linen-desk-set": {
    description:
      "A linen-covered notebook, pen, and card set for a tidy desk, with lay-flat pages and a ribbon marker.",
    images: [
      photo("photo-1513542789411-b6a5d4f31634"),
      photo("photo-1456735190827-d1262f71b8a3"),
    ],
    specifications: specs([
      ["Notebook", "A5, 192 pages"],
      ["Paper", "90 gsm, lay-flat"],
      ["Cover", "Linen"],
      ["Includes", "Pen and card set"],
      ["Marker", "Ribbon"],
    ]),
    reviews: [
      {
        author: "Soren Dahl",
        rating: 5,
        createdAt: "2026-08-27",
        comment:
          "Pages do not bleed with my fountain pen. The cover feels sturdy.",
      },
      {
        author: "Molly Harris",
        rating: 4,
        createdAt: "2026-08-13",
        comment:
          "Nice gift set. The notebook lies flat, which is what I wanted.",
      },
    ],
  },
  "trail-mix-tin": {
    description:
      "A resealable tin of roasted nuts, seeds, and dried fruit, lightly salted and packed for snacking.",
    images: [photo("photo-1599599810694-b5b37304c041")],
    specifications: specs([
      ["Net weight", "400 g"],
      ["Ingredients", "Nuts, seeds, dried fruit"],
      ["Salt", "Lightly salted"],
      ["Pack", "Resealable tin"],
      ["Storage", "Cool, dry place"],
    ]),
    reviews: [
      {
        author: "Carla Mendes",
        rating: 5,
        createdAt: "2026-08-05",
        comment:
          "Nuts taste freshly roasted, not stale. The tin keeps the mix crisp.",
      },
      {
        author: "Ian Walsh",
        rating: 4,
        createdAt: "2026-07-14",
        comment:
          "Good balance of sweet fruit and salt. I portion it for the week.",
      },
    ],
  },
  "socket-ratchet-kit": {
    description:
      "A compact socket and ratchet set in a molded case, covering the sizes you need for home and car jobs.",
    images: [photo("photo-1504148455328-c376907d081c")],
    specifications: specs([
      ["Pieces", "42"],
      ["Drive", "1/4 and 3/8 in"],
      ["Finish", "Chrome vanadium"],
      ["Case", "Molded carry case"],
      ["Warranty", "Limited lifetime"],
    ]),
    reviews: [
      {
        author: "Robert Klein",
        rating: 5,
        createdAt: "2026-06-24",
        comment:
          "The ratchet has a short throw, which helps in tight spots under the dash.",
      },
      {
        author: "Gina Rossi",
        rating: 4,
        createdAt: "2026-05-30",
        comment: "Case keeps every socket in place. Sizes are marked clearly.",
      },
    ],
  },
  "ceramic-planter-duo": {
    description:
      "Two speckled ceramic planters with drainage holes and matching saucers for a windowsill or shelf.",
    images: [
      photo("photo-1459411552884-841db9b3cc2a"),
      photo("photo-1416879595882-3373a0480b5b"),
    ],
    specifications: specs([
      ["Set", "2 planters"],
      ["Material", "Speckled ceramic"],
      ["Drainage", "Hole and saucer"],
      ["Sizes", "12 cm and 16 cm"],
      ["Use", "Indoor"],
    ]),
    reviews: [
      {
        author: "Esther Blum",
        rating: 5,
        createdAt: "2026-09-13",
        comment:
          "Glaze is even and the saucers actually catch water. They look good with small herbs.",
      },
      {
        author: "Noah Ibrahim",
        rating: 5,
        createdAt: "2026-09-05",
        comment:
          "Packed well, no chips. The smaller pot is a perfect desk size.",
      },
    ],
  },
  "kids-canvas-trainers": {
    description:
      "Canvas trainers for kids with a cushioned insole, a rubber toe cap, and a hook-and-loop strap.",
    images: [
      photo("photo-1514989940723-e8e51635b782"),
      photo("photo-1560769629-975ec94e6a86"),
    ],
    specifications: specs([
      ["Upper", "Canvas"],
      ["Closure", "Hook and loop"],
      ["Insole", "Cushioned, removable"],
      ["Toe", "Rubber cap"],
      ["Sizes", "Kids 10–3"],
    ]),
    reviews: [
      {
        author: "Kelly Brooks",
        rating: 4,
        createdAt: "2026-08-16",
        comment:
          "My kid can fasten them alone. They still look decent after playground dirt.",
      },
      {
        author: "Mateo Ruiz",
        rating: 4,
        createdAt: "2026-07-21",
        comment:
          "True to the size chart. The sole has enough grip for the school yard.",
      },
    ],
  },
  "field-notes-history": {
    description:
      "A non-fiction hardcover about how a city was built, with maps, notes, and a bibliography in the back.",
    images: [
      photo("photo-1524995997946-a1c2e315a42f"),
      photo("photo-1481627834876-b7833e8f5570"),
    ],
    specifications: specs([
      ["Format", "Hardcover"],
      ["Pages", "416"],
      ["Language", "English"],
      ["Extras", "Maps and notes"],
      ["Size", "6 × 9 in"],
    ]),
    reviews: [
      {
        author: "Harriet Cole",
        rating: 5,
        createdAt: "2026-07-19",
        comment:
          "The maps are printed clearly enough to follow while you read. Chapters are a good length.",
      },
      {
        author: "Simon Adeyemi",
        rating: 4,
        createdAt: "2026-06-27",
        comment:
          "Well sourced and readable. I have been using the notes section as a reference.",
      },
    ],
  },
};
