// Vehicle database with estimated wrap square footage
// Based on industry-standard vinyl material usage (60" wide rolls)
// Source: 3M / Avery Dennison / KPMF wrap material guidelines
// These represent total material sq ft needed for a full wrap (including waste/overlap)

export interface VehicleModel {
  make: string;
  model: string;
  year?: string;
  bodyType: string;
  totalSqft: number;
}

export interface VehicleCategory {
  type: string;
  avgSqft: number;
  models: VehicleModel[];
}

export const vehicleDatabase: VehicleCategory[] = [
  {
    type: "Compact / Coupe",
    avgSqft: 250,
    models: [
      { make: "Honda", model: "Civic Coupe", bodyType: "Coupe", totalSqft: 250 },
      { make: "Toyota", model: "GR86", bodyType: "Coupe", totalSqft: 225 },
      { make: "Subaru", model: "BRZ", bodyType: "Coupe", totalSqft: 225 },
      { make: "Mazda", model: "MX-5 Miata", bodyType: "Roadster", totalSqft: 200 },
      { make: "Nissan", model: "370Z / Z", bodyType: "Coupe", totalSqft: 240 },
      { make: "BMW", model: "2 Series Coupe", bodyType: "Coupe", totalSqft: 250 },
      { make: "Ford", model: "Mustang", bodyType: "Coupe", totalSqft: 275 },
      { make: "Chevrolet", model: "Camaro", bodyType: "Coupe", totalSqft: 270 },
      { make: "Dodge", model: "Challenger", bodyType: "Coupe", totalSqft: 290 },
      { make: "Hyundai", model: "Veloster", bodyType: "Hatchback", totalSqft: 230 },
    ],
  },
  {
    type: "Sedan",
    avgSqft: 290,
    models: [
      { make: "Honda", model: "Civic Sedan", bodyType: "Sedan", totalSqft: 275 },
      { make: "Honda", model: "Accord", bodyType: "Sedan", totalSqft: 300 },
      { make: "Toyota", model: "Corolla", bodyType: "Sedan", totalSqft: 270 },
      { make: "Toyota", model: "Camry", bodyType: "Sedan", totalSqft: 300 },
      { make: "Nissan", model: "Altima", bodyType: "Sedan", totalSqft: 295 },
      { make: "Nissan", model: "Sentra", bodyType: "Sedan", totalSqft: 260 },
      { make: "Hyundai", model: "Elantra", bodyType: "Sedan", totalSqft: 270 },
      { make: "Hyundai", model: "Sonata", bodyType: "Sedan", totalSqft: 300 },
      { make: "Kia", model: "Forte", bodyType: "Sedan", totalSqft: 265 },
      { make: "Mazda", model: "Mazda3", bodyType: "Sedan", totalSqft: 260 },
      { make: "Subaru", model: "WRX", bodyType: "Sedan", totalSqft: 270 },
      { make: "BMW", model: "3 Series", bodyType: "Sedan", totalSqft: 290 },
      { make: "Tesla", model: "Model 3", bodyType: "Sedan", totalSqft: 280 },
      { make: "Dodge", model: "Charger", bodyType: "Sedan", totalSqft: 325 },
      { make: "Lexus", model: "IS", bodyType: "Sedan", totalSqft: 275 },
    ],
  },
  {
    type: "Hatchback / Wagon",
    avgSqft: 260,
    models: [
      { make: "Honda", model: "Civic Hatchback", bodyType: "Hatchback", totalSqft: 265 },
      { make: "Toyota", model: "GR Corolla", bodyType: "Hatchback", totalSqft: 270 },
      { make: "Mazda", model: "Mazda3 Hatchback", bodyType: "Hatchback", totalSqft: 255 },
      { make: "Volkswagen", model: "Golf GTI", bodyType: "Hatchback", totalSqft: 250 },
      { make: "Subaru", model: "Impreza", bodyType: "Hatchback", totalSqft: 260 },
      { make: "Hyundai", model: "Elantra N", bodyType: "Hatchback", totalSqft: 265 },
    ],
  },
  {
    type: "Compact SUV / Crossover",
    avgSqft: 300,
    models: [
      { make: "Toyota", model: "RAV4", bodyType: "SUV", totalSqft: 305 },
      { make: "Honda", model: "CR-V", bodyType: "SUV", totalSqft: 300 },
      { make: "Mazda", model: "CX-5", bodyType: "SUV", totalSqft: 290 },
      { make: "Subaru", model: "Crosstrek", bodyType: "SUV", totalSqft: 275 },
      { make: "Subaru", model: "Forester", bodyType: "SUV", totalSqft: 295 },
      { make: "Hyundai", model: "Tucson", bodyType: "SUV", totalSqft: 300 },
      { make: "Kia", model: "Sportage", bodyType: "SUV", totalSqft: 300 },
      { make: "Nissan", model: "Rogue", bodyType: "SUV", totalSqft: 305 },
      { make: "Tesla", model: "Model Y", bodyType: "SUV", totalSqft: 290 },
    ],
  },
  {
    type: "Full-Size SUV",
    avgSqft: 375,
    models: [
      { make: "Toyota", model: "4Runner", bodyType: "SUV", totalSqft: 350 },
      { make: "Toyota", model: "Highlander", bodyType: "SUV", totalSqft: 340 },
      { make: "Toyota", model: "Land Cruiser", bodyType: "SUV", totalSqft: 400 },
      { make: "Jeep", model: "Wrangler (4-door)", bodyType: "SUV", totalSqft: 325 },
      { make: "Jeep", model: "Grand Cherokee", bodyType: "SUV", totalSqft: 350 },
      { make: "Ford", model: "Bronco", bodyType: "SUV", totalSqft: 330 },
      { make: "Ford", model: "Expedition", bodyType: "SUV", totalSqft: 420 },
      { make: "Chevrolet", model: "Tahoe", bodyType: "SUV", totalSqft: 400 },
      { make: "Chevrolet", model: "Suburban", bodyType: "SUV", totalSqft: 450 },
      { make: "BMW", model: "X5", bodyType: "SUV", totalSqft: 350 },
    ],
  },
  {
    type: "Truck",
    avgSqft: 340,
    models: [
      { make: "Toyota", model: "Tacoma", bodyType: "Truck", totalSqft: 290 },
      { make: "Toyota", model: "Tundra", bodyType: "Truck", totalSqft: 370 },
      { make: "Ford", model: "F-150", bodyType: "Truck", totalSqft: 360 },
      { make: "Ford", model: "Ranger", bodyType: "Truck", totalSqft: 290 },
      { make: "Chevrolet", model: "Silverado 1500", bodyType: "Truck", totalSqft: 365 },
      { make: "Chevrolet", model: "Colorado", bodyType: "Truck", totalSqft: 285 },
      { make: "Ram", model: "1500", bodyType: "Truck", totalSqft: 365 },
      { make: "Nissan", model: "Frontier", bodyType: "Truck", totalSqft: 280 },
      { make: "Tesla", model: "Cybertruck", bodyType: "Truck", totalSqft: 350 },
    ],
  },
  {
    type: "Sports / Exotic",
    avgSqft: 240,
    models: [
      { make: "Chevrolet", model: "Corvette", bodyType: "Sports", totalSqft: 250 },
      { make: "Porsche", model: "911", bodyType: "Sports", totalSqft: 235 },
      { make: "Porsche", model: "Cayman", bodyType: "Sports", totalSqft: 220 },
      { make: "Lamborghini", model: "Huracán", bodyType: "Sports", totalSqft: 240 },
      { make: "Nissan", model: "GT-R", bodyType: "Sports", totalSqft: 265 },
      { make: "Toyota", model: "Supra", bodyType: "Sports", totalSqft: 240 },
      { make: "BMW", model: "M4", bodyType: "Coupe", totalSqft: 265 },
    ],
  },
  {
    type: "Van / Minivan",
    avgSqft: 400,
    models: [
      { make: "Honda", model: "Odyssey", bodyType: "Minivan", totalSqft: 325 },
      { make: "Toyota", model: "Sienna", bodyType: "Minivan", totalSqft: 325 },
      { make: "Ford", model: "Transit", bodyType: "Van", totalSqft: 475 },
      { make: "Mercedes-Benz", model: "Sprinter", bodyType: "Van", totalSqft: 550 },
      { make: "Ram", model: "ProMaster", bodyType: "Van", totalSqft: 500 },
    ],
  },
];

// Coverage multipliers (percentage of total sqft used)
export const coverageOptions = [
  { id: "full", label: "Full Wrap", description: "Complete vehicle coverage", multiplier: 1.0 },
  { id: "half", label: "Half Wrap", description: "One side + hood or rear", multiplier: 0.55 },
  { id: "partial", label: "Partial Wrap", description: "Selected panels only", multiplier: 0.35 },
  { id: "hood-roof", label: "Hood + Roof", description: "Top surfaces only", multiplier: 0.2 },
  { id: "hood", label: "Hood Only", description: "Front hood panel", multiplier: 0.1 },
  { id: "rear", label: "Rear Only", description: "Trunk/tailgate area", multiplier: 0.12 },
  { id: "side-panels", label: "Side Panels", description: "Both door areas", multiplier: 0.4 },
];

// Design tier pricing per sqft (calibrated for material-based sqft)
export const designTiers = [
  {
    id: "premade",
    label: "Pre-Made Design",
    description: "Choose from our existing anime designs",
    pricePerSqft: 5,
    turnaround: "5-7 business days",
  },
  {
    id: "semicustom",
    label: "Semi-Custom",
    description: "Modify an existing design with your preferences",
    pricePerSqft: 9,
    turnaround: "10-14 business days",
  },
  {
    id: "fullcustom",
    label: "Fully Custom Itasha",
    description: "Original artwork designed specifically for your vehicle",
    pricePerSqft: 15,
    turnaround: "3-5 weeks",
  },
];

// Material/finish options
export const finishOptions = [
  { id: "gloss", label: "High Gloss", priceAdd: 0 },
  { id: "matte", label: "Matte", priceAdd: 2 },
  { id: "satin", label: "Satin", priceAdd: 2 },
];

// Installation option
export const installOptions = [
  { id: "ship", label: "Ship to Me (DIY)", price: 0 },
  { id: "install-houston", label: "Professional Install (Houston, TX)", price: 800 },
  { id: "install-partner", label: "Install via Partner Shop", price: 600 },
];

// Get all unique makes
export function getAllMakes(): string[] {
  const makes = new Set<string>();
  vehicleDatabase.forEach((cat) =>
    cat.models.forEach((m) => makes.add(m.make))
  );
  return Array.from(makes).sort();
}

// Get models for a specific make
export function getModelsForMake(make: string): VehicleModel[] {
  const models: VehicleModel[] = [];
  vehicleDatabase.forEach((cat) =>
    cat.models.forEach((m) => {
      if (m.make === make) models.push(m);
    })
  );
  return models;
}

// Calculate price
export function calculatePrice(
  sqft: number,
  coverageMultiplier: number,
  pricePerSqft: number,
  finishAdd: number,
  installPrice: number
): { subtotal: number; designFee: number; total: number; effectiveSqft: number } {
  const effectiveSqft = Math.round(sqft * coverageMultiplier);
  const subtotal = effectiveSqft * (pricePerSqft + finishAdd);
  const designFee = 99; // Refundable design fee
  const total = subtotal + installPrice + designFee;
  return { subtotal, designFee, total, effectiveSqft };
}
