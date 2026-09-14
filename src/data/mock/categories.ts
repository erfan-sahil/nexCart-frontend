import type { Category, PopularAisle, Subcategory } from "@/types";

function aisle(
  id: string,
  name: string,
  slug: string,
  image: string,
  productCount: number,
  popular = false,
): Subcategory {
  return {
    id,
    name,
    slug,
    image,
    productCount,
    ...(popular ? { popular } : {}),
  };
}

export const categories: Category[] = [
  {
    id: "c1",
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
    productCount: 12840,
    description:
      "Phones, laptops, audio, and smart home gear from verified tech stores.",
    subcategories: [
      aisle(
        "c1-1",
        "Smartphones",
        "smartphones",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
        3240,
        true,
      ),
      aisle(
        "c1-2",
        "Laptops",
        "laptops",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        1860,
        true,
      ),
      aisle(
        "c1-3",
        "Headphones",
        "headphones",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        1540,
      ),
      aisle(
        "c1-4",
        "Cameras",
        "cameras",
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
        890,
      ),
      aisle(
        "c1-5",
        "Gaming",
        "gaming",
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=600&q=80",
        2120,
        true,
      ),
      aisle(
        "c1-6",
        "Smart home",
        "smart-home",
        "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
        980,
      ),
      aisle(
        "c1-7",
        "Wearables",
        "wearables",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        1120,
      ),
      aisle(
        "c1-8",
        "Tablets",
        "tablets",
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
        1090,
      ),
    ],
  },
  {
    id: "c2",
    name: "Fashion",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    productCount: 22110,
    description:
      "Apparel, shoes, and accessories from independent labels and everyday brands.",
    subcategories: [
      aisle(
        "c2-1",
        "Women",
        "women",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
        6420,
        true,
      ),
      aisle(
        "c2-2",
        "Men",
        "men",
        "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
        5180,
      ),
      aisle(
        "c2-3",
        "Shoes",
        "shoes",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        3890,
        true,
      ),
      aisle(
        "c2-4",
        "Bags",
        "bags",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
        1640,
      ),
      aisle(
        "c2-5",
        "Jewelry",
        "jewelry",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
        1210,
      ),
      aisle(
        "c2-6",
        "Watches",
        "watches",
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
        980,
      ),
      aisle(
        "c2-7",
        "Kids",
        "kids",
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80",
        1720,
      ),
      aisle(
        "c2-8",
        "Accessories",
        "accessories",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
        1070,
      ),
    ],
  },
  {
    id: "c3",
    name: "Home & Living",
    slug: "home",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80",
    productCount: 9640,
    description:
      "Furniture, kitchen, and decor for rooms that actually get used.",
    subcategories: [
      aisle(
        "c3-1",
        "Furniture",
        "furniture",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
        2140,
        true,
      ),
      aisle(
        "c3-2",
        "Bedding",
        "bedding",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
        1320,
      ),
      aisle(
        "c3-3",
        "Kitchen",
        "kitchen",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
        1680,
      ),
      aisle(
        "c3-4",
        "Decor",
        "decor",
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
        1210,
      ),
      aisle(
        "c3-5",
        "Lighting",
        "lighting",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
        760,
      ),
      aisle(
        "c3-6",
        "Storage",
        "storage",
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
        890,
      ),
      aisle(
        "c3-7",
        "Bath",
        "bath",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
        640,
      ),
      aisle(
        "c3-8",
        "Outdoor",
        "outdoor",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        1000,
      ),
    ],
  },
  {
    id: "c4",
    name: "Beauty",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    productCount: 7320,
    description:
      "Skincare, makeup, and grooming from independent beauty houses.",
    subcategories: [
      aisle(
        "c4-1",
        "Skincare",
        "skincare",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
        1860,
        true,
      ),
      aisle(
        "c4-2",
        "Makeup",
        "makeup",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
        1540,
      ),
      aisle(
        "c4-3",
        "Haircare",
        "haircare",
        "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=600&q=80",
        1120,
      ),
      aisle(
        "c4-4",
        "Fragrance",
        "fragrance",
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
        780,
      ),
      aisle(
        "c4-5",
        "Tools",
        "tools",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
        540,
      ),
      aisle(
        "c4-6",
        "Men's grooming",
        "mens-grooming",
        "https://images.unsplash.com/photo-1621605815971-fbc54cdfb540?auto=format&fit=crop&w=600&q=80",
        610,
      ),
      aisle(
        "c4-7",
        "Bath & body",
        "bath-body",
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=600&q=80",
        490,
      ),
      aisle(
        "c4-8",
        "Wellness",
        "wellness",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        380,
      ),
    ],
  },
  {
    id: "c5",
    name: "Sports",
    slug: "sports",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    productCount: 5180,
    description:
      "Training, outdoor, and team gear for the next session — not the next season.",
    subcategories: [
      aisle(
        "c5-1",
        "Fitness",
        "fitness",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
        1240,
        true,
      ),
      aisle(
        "c5-2",
        "Outdoor",
        "outdoor",
        "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
        890,
      ),
      aisle(
        "c5-3",
        "Cycling",
        "cycling",
        "https://images.unsplash.com/photo-1485965120184-e07f156b9b8c?auto=format&fit=crop&w=600&q=80",
        640,
      ),
      aisle(
        "c5-4",
        "Team sports",
        "team-sports",
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80",
        720,
      ),
      aisle(
        "c5-5",
        "Running",
        "running",
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
        580,
      ),
      aisle(
        "c5-6",
        "Yoga",
        "yoga",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        410,
      ),
      aisle(
        "c5-7",
        "Swim",
        "swim",
        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=600&q=80",
        320,
      ),
      aisle(
        "c5-8",
        "Fan gear",
        "fan-gear",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80",
        380,
      ),
    ],
  },
  {
    id: "c6",
    name: "Grocery",
    slug: "grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    productCount: 4102,
    description:
      "Pantry staples, snacks, and household essentials with same-week restocks.",
    subcategories: [
      aisle(
        "c6-1",
        "Fresh produce",
        "fresh-produce",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
        640,
      ),
      aisle(
        "c6-2",
        "Pantry",
        "pantry",
        "https://images.unsplash.com/photo-1583258292688-d7628e00f1ba?auto=format&fit=crop&w=600&q=80",
        890,
      ),
      aisle(
        "c6-3",
        "Snacks",
        "snacks",
        "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80",
        720,
        true,
      ),
      aisle(
        "c6-4",
        "Beverages",
        "beverages",
        "https://images.unsplash.com/photo-1544145945-f904853834e8?auto=format&fit=crop&w=600&q=80",
        510,
      ),
      aisle(
        "c6-5",
        "Frozen",
        "frozen",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80",
        380,
      ),
      aisle(
        "c6-6",
        "Household",
        "household",
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80",
        460,
      ),
      aisle(
        "c6-7",
        "Baby",
        "baby",
        "https://images.unsplash.com/photo-1515488044360-fbba185ba609?auto=format&fit=crop&w=600&q=80",
        290,
      ),
      aisle(
        "c6-8",
        "Pet",
        "pet",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
        212,
      ),
    ],
  },
  {
    id: "c7",
    name: "Automotive",
    slug: "automotive",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    productCount: 2890,
    description:
      "Parts, tools, and cabin upgrades for cars, bikes, and weekend projects.",
    subcategories: [
      aisle(
        "c7-1",
        "Car electronics",
        "car-electronics",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80",
        540,
      ),
      aisle(
        "c7-2",
        "Replacement parts",
        "parts",
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80",
        680,
      ),
      aisle(
        "c7-3",
        "Tires & wheels",
        "tires",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
        320,
      ),
      aisle(
        "c7-4",
        "Tools",
        "tools",
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
        410,
      ),
      aisle(
        "c7-5",
        "Exterior",
        "exterior",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
        280,
      ),
      aisle(
        "c7-6",
        "Interior",
        "interior",
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80",
        260,
      ),
      aisle(
        "c7-7",
        "Motorcycle",
        "motorcycle",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
        240,
      ),
      aisle(
        "c7-8",
        "Fluids & care",
        "fluids",
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80",
        160,
      ),
    ],
  },
  {
    id: "c8",
    name: "Books",
    slug: "books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    productCount: 6540,
    description:
      "Fiction, study, and stationery from independent bookstores and publishers.",
    subcategories: [
      aisle(
        "c8-1",
        "Fiction",
        "fiction",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        1860,
        true,
      ),
      aisle(
        "c8-2",
        "Non-fiction",
        "non-fiction",
        "https://images.unsplash.com/photo-14565130808-af7ada5581f6?auto=format&fit=crop&w=600&q=80",
        1420,
      ),
      aisle(
        "c8-3",
        "Comics",
        "comics",
        "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=600&q=80",
        780,
      ),
      aisle(
        "c8-4",
        "Children",
        "children",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
        960,
      ),
      aisle(
        "c8-5",
        "Education",
        "education",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
        640,
      ),
      aisle(
        "c8-6",
        "Magazines",
        "magazines",
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80",
        310,
      ),
      aisle(
        "c8-7",
        "Audiobooks",
        "audiobooks",
        "https://images.unsplash.com/photo-1590602846989-e99596d2a6ee?auto=format&fit=crop&w=600&q=80",
        280,
      ),
      aisle(
        "c8-8",
        "Stationery",
        "stationery",
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
        290,
      ),
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getPopularAisles(): PopularAisle[] {
  return categories.flatMap((category) =>
    category.subcategories
      .filter((subcategory) => subcategory.popular)
      .map((subcategory) => ({
        ...subcategory,
        categorySlug: category.slug,
        categoryName: category.name,
      })),
  );
}

export function getCatalogStats() {
  return {
    departmentCount: categories.length,
    aisleCount: categories.reduce(
      (total, category) => total + category.subcategories.length,
      0,
    ),
    productCount: categories.reduce(
      (total, category) => total + category.productCount,
      0,
    ),
  };
}
