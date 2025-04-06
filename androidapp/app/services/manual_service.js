// manual_service.js

export const categories = [
    {
      name: "Textiles",
      keywords: [
        "woven","cloth","fabric","threads","soft","frayed",
        "flexible","garment","stitched","tapestry"
      ],
    },
    {
      name: "Woodwork & Bone",
      keywords: [
        "wood","bone","grain","carved","organic","ivory",
        "figurine","handle","whittle","light"
      ],
    },
    {
      name: "Weapons",
      keywords: [
        "blade","dagger","spear","axe","sword","hammer",
        "rust","weapon","combat","edge"
      ],
    },
    {
      name: "Jewelry",
      keywords: [
        "ring","bracelet","necklace","earring","gem","silver",
        "gold","ornate","beads","wear"
      ],
    },
    {
      name: "Pottery",
      keywords: [
        "clay","ceramic","bowl","jar","vessel","glaze",
        "plate","pot","cup","earthenware"
      ],
    },
    {
      name: "Sculpture",
      keywords: [
        "statue","stone","carve","figure","bust","monument",
        "relief","chiselled","marble","sculpt"
      ],
    },
    {
      name: "Glassware",
      keywords: [
        "glass","transparent","fragile","bottle","flask","vase",
        "bead","translucent","window","cup"
      ],
    },
    {
      name: "Coins",
      keywords: [
        "coin","currency","mint","round","stamp","denomination",
        "numismatic","tarnish","metallic","face"
      ],
    },
    {
      name: "Technology/Devices",
      keywords: [
        "device","mechanical","gear","electronic","dial","circuit",
        "machine","parts","tool","modern"
      ],
    },
    {
      name: "Religious/Spiritual Artifacts",
      keywords: [
        "ritual","deity","icon","temple","prayer","amulet",
        "sacred","altar","symbol","faith"
      ],
    },
  ];
  
  export class ManualArtifactClassifier {
    constructor() {
      this.categories = categories;
    }
  
    classify(userInput) {
      // userInput is something like "black, stone, hard, shiny, sharp"
      // Split by comma, trim, lowercase
      const words = userInput
        .split(",")
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length > 0);
  
      let bestCategory = "Unknown";
      let bestMatchCount = 0;
  
      for (const category of this.categories) {
        let matchCount = 0;
        for (const keyword of category.keywords) {
          if (words.includes(keyword)) {
            matchCount++;
          }
        }
  
        if (matchCount > bestMatchCount) {
          bestMatchCount = matchCount;
          bestCategory = category.name;
        }
      }
  
      return {
        category: bestCategory,
        matches: bestMatchCount,
      };
    }
  }
  