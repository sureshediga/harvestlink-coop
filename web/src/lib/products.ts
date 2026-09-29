export interface Product {
  id: string;
  name: string;
  category: string;
  netWeight: string;
  unit: string;
  orderQuantity?: number;
  description?: string;
  region?: string;
  priceRange?: string;
}

export const PRODUCT_CATEGORIES = [
  "All Products",
  "Millet Products",
  "Dals & Pulses",
  "Flours",
  "Rice Varieties",
  "Spices & Seasonings",
  "Oils",
  "Specialty Items",
] as const;

export const PRODUCTS: Product[] = [
  // Millet Drink Mix
  { id: "p001", name: "Chocolatte", category: "Millet Products", netWeight: "100", unit: "gms", description: "Millet-based chocolate drink mix" },
  { id: "p002", name: "Turmilatte", category: "Millet Products", netWeight: "100", unit: "gms", description: "Turmeric-infused millet drink mix" },
  { id: "p003", name: "Sattu Twist", category: "Millet Products", netWeight: "100", unit: "gms", description: "Traditional sattu with a twist" },
  
  // Millet Instant Mix
  { id: "p004", name: "Pepper Pongal", category: "Millet Products", netWeight: "100", unit: "gms", description: "Instant millet-based pepper pongal" },
  { id: "p005", name: "Classic Upma", category: "Millet Products", netWeight: "100", unit: "gms", description: "Instant millet upma mix" },
  
  // Millet Premix
  { id: "p006", name: "Little Millet Classic", category: "Millet Products", netWeight: "200", unit: "gms", description: "Premium little millet premix" },
  { id: "p007", name: "Little Millet Masala", category: "Millet Products", netWeight: "200", unit: "gms", description: "Spiced little millet premix" },
  
  // Millet Snacks & Poha
  { id: "p008", name: "Desi Brunch", category: "Millet Products", netWeight: "100", unit: "gms", description: "Traditional millet snack mix" },
  { id: "p009", name: "Golden Crunch", category: "Millet Products", netWeight: "100", unit: "gms", description: "Crispy millet snack" },
  
  // Millet Snacks
  { id: "p010", name: "Classic Masala", category: "Millet Products", netWeight: "50", unit: "gms", description: "Classic masala millet snack" },
  { id: "p011", name: "Periperi Masala", category: "Millet Products", netWeight: "50", unit: "gms", description: "Spicy periperi millet snack" },
  { id: "p012", name: "Nutty Masala", category: "Millet Products", netWeight: "50", unit: "gms", description: "Nutty flavored millet snack" },
  
  // Protein Millet Bites
  { id: "p013", name: "Pro Dark Chocolate Orange", category: "Millet Products", netWeight: "30", unit: "gms", description: "Protein-rich dark chocolate orange bite" },
  { id: "p014", name: "Pro Nut & Berry", category: "Millet Products", netWeight: "30", unit: "gms", description: "Protein bite with nuts and berries" },
  { id: "p015", name: "Pro Peanut Butter Chocolate", category: "Millet Products", netWeight: "30", unit: "gms", description: "Peanut butter chocolate protein bite" },
  { id: "p016", name: "Pro Coffee Salted Caramel", category: "Millet Products", netWeight: "30", unit: "gms", description: "Coffee and salted caramel protein bite" },
  
  // Instant Protein Meals
  { id: "p017", name: "Protein Dum Biryani", category: "Millet Products", netWeight: "100", unit: "gms", description: "High-protein instant biryani" },
  { id: "p018", name: "Protein Tomato Dal Khichdi", category: "Millet Products", netWeight: "100", unit: "gms", description: "Protein-rich tomato dal khichdi" },
  { id: "p019", name: "Protein Veg Khichdi", category: "Millet Products", netWeight: "100", unit: "gms", description: "Protein-packed vegetable khichdi" },
  
  // Protein Millet Drink Mix
  { id: "p020", name: "Choco Banana", category: "Millet Products", netWeight: "100", unit: "gms", description: "Chocolate banana protein drink" },
  { id: "p021", name: "Mango Kesar", category: "Millet Products", netWeight: "100", unit: "gms", description: "Mango saffron protein drink" },
  { id: "p022", name: "Cappucino Brew", category: "Millet Products", netWeight: "100", unit: "gms", description: "Coffee-flavored protein drink" },
  { id: "p023", name: "Pro Chocolatte", category: "Millet Products", netWeight: "100", unit: "gms", description: "Protein chocolate latte" },
  
  // Dals & Pulses
  { id: "p024", name: "Toor Dal", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 60, description: "Premium quality toor dal" },
  { id: "p025", name: "Moong Dal", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Split yellow moong dal" },
  { id: "p026", name: "Chana Dal", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Split chickpea dal" },
  { id: "p027", name: "Masoor Dal", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Red lentils" },
  { id: "p028", name: "Green Moong Split Dal", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 20, description: "Split green moong dal" },
  { id: "p029", name: "Urad Dal", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Black gram dal" },
  { id: "p030", name: "Urad Black Split Dal", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 20, description: "Split black urad dal" },
  { id: "p031", name: "Panchratan Dal", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 25, description: "Five lentil mix" },
  { id: "p032", name: "Black Eye Beans", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 20, description: "Black-eyed peas" },
  { id: "p033", name: "Chitkabara Rajma", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 25, description: "Speckled kidney beans" },
  { id: "p034", name: "Green Moong Whole", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Whole green moong beans" },
  { id: "p035", name: "Kabuli Chana", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Chickpeas" },
  { id: "p036", name: "Kala Chana", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Black chickpeas" },
  { id: "p037", name: "Masoor Matka", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 25, description: "Whole red lentils" },
  { id: "p038", name: "Moth Beans", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 20, description: "Matki beans" },
  { id: "p039", name: "Urad Whole Skinless", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 35, description: "Skinless whole urad" },
  { id: "p040", name: "Urad Black Whole", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 20, description: "Whole black urad with skin" },
  { id: "p041", name: "Green Peas", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 20, description: "Dried green peas" },
  { id: "p042", name: "Yellow Peas", category: "Dals & Pulses", netWeight: "4", unit: "LB", orderQuantity: 20, description: "Dried yellow peas" },
  { id: "p043", name: "Roasted Dalia Split", category: "Dals & Pulses", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Roasted split wheat" },
  { id: "p044", name: "Roasted Chana", category: "Dals & Pulses", netWeight: "2", unit: "LB", orderQuantity: 20, description: "Roasted chickpeas" },
  { id: "p045", name: "Poha Thick", category: "Specialty Items", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Thick flattened rice" },
  { id: "p046", name: "Poha Thin", category: "Specialty Items", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Thin flattened rice" },
  
  // Flours
  { id: "p047", name: "Rice Flour", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 25, description: "Fine rice flour" },
  { id: "p048", name: "Rice Flour", category: "Flours", netWeight: "4", unit: "LB", orderQuantity: 25, description: "Fine rice flour (large pack)" },
  { id: "p049", name: "Ragi Flour", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Finger millet flour" },
  { id: "p050", name: "Ragi Flour", category: "Flours", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Finger millet flour (large pack)" },
  { id: "p051", name: "Roasted Ragi Flour", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 25, description: "Roasted finger millet flour" },
  { id: "p052", name: "Ragi Whole", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 20, description: "Whole finger millet grains" },
  { id: "p053", name: "Sattu Atta", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Roasted gram flour" },
  { id: "p054", name: "Besan", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Chickpea flour" },
  { id: "p055", name: "Besan", category: "Flours", netWeight: "4", unit: "LB", orderQuantity: 25, description: "Chickpea flour (large pack)" },
  { id: "p056", name: "Idly Rava", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Idli rava semolina" },
  { id: "p057", name: "Idly Rava", category: "Flours", netWeight: "4", unit: "LB", orderQuantity: 35, description: "Idli rava semolina (large pack)" },
  { id: "p058", name: "Rice Rava", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 25, description: "Rice semolina" },
  { id: "p059", name: "Bajra Flour", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 25, description: "Pearl millet flour" },
  { id: "p060", name: "Bajra Flour", category: "Flours", netWeight: "4", unit: "LB", orderQuantity: 20, description: "Pearl millet flour (large pack)" },
  { id: "p061", name: "Jowar Flour", category: "Flours", netWeight: "4", unit: "LB", orderQuantity: 25, description: "Sorghum flour" },
  { id: "p062", name: "Jowar Flour", category: "Flours", netWeight: "10", unit: "LB", orderQuantity: 30, description: "Sorghum flour (bulk pack)" },
  { id: "p063", name: "Moong Flour", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 25, description: "Moong dal flour" },
  { id: "p064", name: "Urad Flour", category: "Flours", netWeight: "2", unit: "LB", orderQuantity: 25, description: "Urad dal flour" },
  
  // Specialty Items
  { id: "p065", name: "Jaggery Kolhapuri", category: "Specialty Items", netWeight: "4", unit: "LB", orderQuantity: 30, description: "Traditional Kolhapuri jaggery" },
  { id: "p066", name: "Basmati Mammra", category: "Specialty Items", netWeight: "400", unit: "GM", orderQuantity: 30, description: "Puffed basmati rice" },
  { id: "p067", name: "Muesli", category: "Specialty Items", netWeight: "200", unit: "GM", orderQuantity: 25, description: "Healthy breakfast muesli" },
  { id: "p068", name: "Phool Makhana", category: "Specialty Items", netWeight: "200", unit: "GM", orderQuantity: 25, description: "Fox nuts" },
  { id: "p069", name: "Sabudana", category: "Specialty Items", netWeight: "1", unit: "LB", orderQuantity: 25, description: "Tapioca pearls" },
  { id: "p070", name: "Sabudana", category: "Specialty Items", netWeight: "2", unit: "LB", orderQuantity: 25, description: "Tapioca pearls (large pack)" },
  { id: "p071", name: "Himalayan Salt Powder", category: "Spices & Seasonings", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Fine Himalayan pink salt" },
  { id: "p072", name: "Barnyard Millet", category: "Millet Products", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Whole barnyard millet" },
  { id: "p073", name: "Kodo Millet", category: "Millet Products", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Whole kodo millet" },
  { id: "p074", name: "Foxtail Millet", category: "Millet Products", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Whole foxtail millet" },
  { id: "p075", name: "Little Millet", category: "Millet Products", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Whole little millet" },
  { id: "p076", name: "Mixed Millet", category: "Millet Products", netWeight: "2", unit: "LB", orderQuantity: 30, description: "Five millet mix" },
  
  // Oils
  { id: "p077", name: "Cold Press Sesame Oil", category: "Oils", netWeight: "2", unit: "LIT", orderQuantity: 25, description: "Cold-pressed sesame oil", region: "Traditional method" },
  { id: "p078", name: "Cold Press Sesame Oil", category: "Oils", netWeight: "5", unit: "LIT", orderQuantity: 15, description: "Cold-pressed sesame oil (large)", region: "Traditional method" },
  { id: "p079", name: "Cold Press Groundnut Oil", category: "Oils", netWeight: "2", unit: "LIT", orderQuantity: 20, description: "Cold-pressed groundnut oil", region: "Telangana / Andhra Pradesh" },
  { id: "p080", name: "Cold Press Groundnut Oil", category: "Oils", netWeight: "5", unit: "LIT", orderQuantity: 20, description: "Cold-pressed groundnut oil (large)", region: "Telangana / Andhra Pradesh" },
  { id: "p081", name: "Cold Press Sunflower Oil", category: "Oils", netWeight: "2", unit: "LIT", orderQuantity: 25, description: "Cold-pressed sunflower oil" },
  { id: "p082", name: "Cold Press Sunflower Oil", category: "Oils", netWeight: "5", unit: "LIT", orderQuantity: 15, description: "Cold-pressed sunflower oil (large)" },
  
  // Spices & Seasonings
  { id: "p083", name: "Turmeric Powder", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 30, description: "Pure turmeric powder", region: "Meghalaya / Telangana" },
  { id: "p084", name: "Turmeric Powder", category: "Spices & Seasonings", netWeight: "1", unit: "LB", orderQuantity: 20, description: "Pure turmeric powder (large)", region: "Meghalaya / Telangana" },
  { id: "p085", name: "Chilly Powder", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 30, description: "Red chili powder", region: "AP / Karnataka" },
  { id: "p086", name: "Chilli Powder Extra Hot", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 25, description: "Extra hot chili powder", region: "AP / Karnataka" },
  { id: "p087", name: "Red Chilli Whole", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 25, description: "Whole dried red chilies" },
  { id: "p088", name: "Bayadgi Chilli Powder", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 30, description: "Mild Bayadgi chili powder" },
  { id: "p089", name: "Bayadgi Chilli Whole", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 25, description: "Whole Bayadgi chilies" },
  { id: "p090", name: "Chat Masala", category: "Spices & Seasonings", netWeight: "3.5", unit: "OZ", orderQuantity: 25, description: "Tangy chat masala" },
  { id: "p091", name: "Garam Masala", category: "Spices & Seasonings", netWeight: "3.5", unit: "OZ", orderQuantity: 20, description: "Aromatic garam masala blend" },
  { id: "p092", name: "Sesame Seeds White", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 30, description: "White sesame seeds" },
  { id: "p093", name: "Corriander Powder", category: "Spices & Seasonings", netWeight: "14", unit: "OZ", orderQuantity: 25, description: "Ground coriander" },
  { id: "p094", name: "Cumin Powder", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 25, description: "Ground cumin" },
  { id: "p095", name: "Curry Powder Hot", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 20, description: "Hot curry powder blend" },
  { id: "p096", name: "Garam Masala", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 20, description: "Premium garam masala" },
  { id: "p097", name: "Kashmiri Chilli Powder", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 30, description: "Mild Kashmiri chili powder" },
  { id: "p098", name: "Methi Powder", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 20, description: "Fenugreek powder" },
  { id: "p099", name: "Methi Seeds", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 30, description: "Fenugreek seeds" },
  { id: "p100", name: "Mustard Small", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 25, description: "Small mustard seeds" },
  { id: "p101", name: "Mustard Big", category: "Spices & Seasonings", netWeight: "7", unit: "OZ", orderQuantity: 25, description: "Large mustard seeds" },
  { id: "p102", name: "Rasam Powder", category: "Spices & Seasonings", netWeight: "3.5", unit: "OZ", orderQuantity: 20, description: "Traditional rasam spice mix" },
  { id: "p103", name: "Sambhar Powder", category: "Spices & Seasonings", netWeight: "3.5", unit: "OZ", orderQuantity: 25, description: "Authentic sambhar masala" },
  { id: "p104", name: "Ginger Garlic Paste", category: "Spices & Seasonings", netWeight: "24", unit: "OZ", orderQuantity: 35, description: "Fresh ginger garlic paste" },
  
  // Rice Varieties
  { id: "p105", name: "Sona Masuri White Rice", category: "Rice Varieties", netWeight: "20", unit: "LB", orderQuantity: 500, description: "Premium white Sona Masuri", region: "Tamil Nadu / Telangana" },
  { id: "p106", name: "Sona Masuri White Rice", category: "Rice Varieties", netWeight: "10", unit: "LB", orderQuantity: 300, description: "Premium white Sona Masuri", region: "Tamil Nadu / Telangana" },
  { id: "p107", name: "Sona Masuri Brown Rice", category: "Rice Varieties", netWeight: "10", unit: "LB", orderQuantity: 300, description: "Whole grain brown Sona Masuri", region: "Tamil Nadu / Telangana" },
  { id: "p108", name: "Sona Masuri Handpound Rice", category: "Rice Varieties", netWeight: "10", unit: "lb", orderQuantity: 300, description: "Traditional handpound Sona Masuri", region: "Tamil Nadu / Telangana" },
  { id: "p109", name: "Ponni Rice", category: "Rice Varieties", netWeight: "10", unit: "LB", orderQuantity: 200, description: "Premium Ponni rice", region: "Tamil Nadu" },
  { id: "p110", name: "Ponni Paraboiled Rice", category: "Rice Varieties", netWeight: "5", unit: "LB", orderQuantity: 200, description: "Parboiled Ponni rice", region: "Tamil Nadu" },
  { id: "p111", name: "Idli Rice", category: "Rice Varieties", netWeight: "10", unit: "LB", orderQuantity: 300, description: "Special rice for making idlis", region: "South India" },
  { id: "p112", name: "Sona Masuri Crystal Rice", category: "Rice Varieties", netWeight: "20", unit: "LB", orderQuantity: 400, description: "Crystal clear Sona Masuri rice", region: "Tamil Nadu / Telangana" },
];

export function getCategories(): string[] {
  return Array.from(PRODUCT_CATEGORIES);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All Products") {
    return PRODUCTS;
  }
  return PRODUCTS.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery) ||
      p.description?.toLowerCase().includes(lowercaseQuery) ||
      p.region?.toLowerCase().includes(lowercaseQuery)
  );
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
