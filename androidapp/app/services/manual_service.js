export const categories = [
    {
      name: "Textile/Cloth Artifact",
      keywords: [
        "soft", "woven", "fabric", "threads", "thin", "light",
        "draped", "smooth", "rough", "colorful", "faded", "patterned",
        "delicate", "frayed", "crinkled", "wrinkled", "airy", "printed",
        "cotton", "woolly", "silken", "textured", "loose", "vibrant",
        "dyed", "casual", "elegant", "shirt", "scarf", "rug"
      ],
    },
    {
      name: "Wood/Bone Artifact",
      keywords: [
        "wooden", "bone", "carved", "aged", "rough", "smooth",
        "grainy", "rustic", "natural", "sturdy", "weathered", "chipped",
        "worn", "polished", "refined", "organic", "solid", "hard",
        "coarse", "split", "burnt", "layered", "fibrous", "raw",
        "earthy", "firm", "vintage", "table", "chair", "spoon"
      ],
    },
    {
      name: "Metal/Weapon Artifact",
      keywords: [
        "sharp", "pointed", "jagged", "heavy", "metallic", "edged",
        "honed", "dangerous", "robust", "rugged", "durable", "precise",
        "cutting", "efficient", "striking", "balanced", "lethal", "functional",
        "utilitarian", "sleek", "compact", "cold", "forceful", "refined",
        "engineered", "sword", "dagger", "spear", "axe", "hammer"
      ],
    },
    {
      name: "Adornment/Jewelry Artifact",
      keywords: [
        "small", "shiny", "delicate", "ornate", "polished", "sparkling",
        "refined", "elegant", "bright", "lustrous", "dainty", "compact",
        "chic", "exquisite", "glimmering", "graceful", "intricate", "timeless",
        "fine", "decorative", "radiant", "brilliant", "subtle", "classy",
        "sophisticated", "ring", "necklace", "bracelet", "earring", "gem"
      ],
    },
    {
      name: "Ceramic/Pottery Artifact",
      keywords: [
        "clay", "ceramic", "round", "curved", "flat", "glazed",
        "rough", "textured", "brittle", "earthy", "handmade", "fired",
        "vintage", "rustic", "porous", "smooth", "uneven", "matte",
        "functional", "simple", "traditional", "weathered", "fragile", "durable",
        "authentic", "artisanal", "aged", "pot", "jar", "bowl"
      ],
    },
    {
      name: "Carved/Statue Artifact",
      keywords: [
        "carved", "heavy", "solid", "detailed", "angular", "geometric",
        "smooth", "rough", "monumental", "expressive", "abstract", "refined",
        "robust", "sturdy", "crafted", "artistic", "lifelike", "sculpted",
        "dynamic", "balanced", "timeless", "imposing", "statuesque", "elegant",
        "complex", "powerful", "intricate", "textured", "bold", "bust"
      ],
    },
    {
      name: "Glass/Crystal Artifact",
      keywords: [
        "glass", "transparent", "fragile", "shiny", "smooth", "glossy",
        "clear", "delicate", "reflective", "curved", "crisp", "luminous",
        "pristine", "modern", "elegant", "cool", "refined", "vibrant",
        "sparkling", "light", "pure", "ethereal", "sleek", "radiant",
        "polished", "subtle", "airy", "bright", "vivid", "flawless"
      ],
    },
    {
      name: "Coin/Currency Artifact",
      keywords: [
        "coin", "currency", "minted", "round", "flat", "small",
        "metallic", "worn", "polished", "aged", "engraved", "uniform",
        "collectible", "historic", "sturdy", "shiny", "copper", "silver",
        "bronze", "relic", "tiny", "embossed", "classic", "circular",
        "weathered", "refined", "durable", "economic", "standard", "balanced"
      ],
    },
    {
      name: "Technology/Device Artifact",
      keywords: [
        "device", "mechanical", "electronic", "compact", "modern", "functional",
        "sleek", "innovative", "digital", "precise", "robust", "complex",
        "smart", "efficient", "advanced", "engineered", "technical", "modular",
        "portable", "futuristic", "agile", "streamlined", "automated", "versatile",
        "reliable", "durable", "intuitive", "sophisticated", "integrated", "ergonomic"
      ],
    },
    {
      name: "Religious/Spiritual Artifact",
      keywords: [
        "ritual", "sacred", "icon", "holy", "revered", "symbolic",
        "spiritual", "ceremonial", "engraved", "simple", "ornate", "timeless",
        "blessed", "meditative", "profound", "divine", "mystical", "ancient",
        "modest", "radiant", "austere", "hallowed", "inspirational", "pure",
        "contemplative", "venerable", "emblematic", "transcendent", "serene", "devotional"
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
  
      // Determine confidence level based on bestMatchCount:
      // 1 - very low, 2 - low, 3 - medium, 4 - high, 5+ - very high
      let confidence;
      if (bestMatchCount >= 5) {
        confidence = "very high";
      } else if (bestMatchCount === 4) {
        confidence = "high";
      } else if (bestMatchCount === 3) {
        confidence = "medium";
      } else if (bestMatchCount === 2) {
        confidence = "low";
      } else if (bestMatchCount === 1) {
        confidence = "very low";
      } else {
        confidence = "none";
      }
  
      return {
        category: bestCategory,
        matches: bestMatchCount,
        confidence: confidence,
      };
    }
  }
  