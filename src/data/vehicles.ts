// Vehicle database with estimated wrap square footage
// Sources: Industry standards + JD Power research
// Average car needs ~250 sqft total surface area

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
    avgSqft: 170,
    models: [
      { make: "Honda", model: "Civic Coupe", bodyType: "Coupe", totalSqft: 165 },
      { make: "Toyota", model: "GR86", bodyType: "Coupe", totalSqft: 155 },
      { make: "Subaru", model: "BRZ", bodyType: "Coupe", totalSqft: 155 },
      { make: "Mazda", model: "MX-5 Miata", bodyType: "Roadster", totalSqft: 130 },
      { make: "Nissan", model: "370Z / Z", bodyType: "Coupe", totalSqft: 160 },
      { make: "BMW", model: "2 Series Coupe", bodyType: "Coupe", totalSqft: 170 },
      { make: "Ford", model: "Mustang", bodyType: "Coupe", totalSqft: 190 },
      { make: "Chevrolet", model: "Camaro", bodyType: "Coupe", totalSqft: 185 },
      { make: "Dodge", model: "Challenger", bodyType: "Coupe", totalSqft: 200 },
      { make: "Hyundai", model: "Veloster", bodyType: "Hatchback", totalSqft: 155 },
    ],
  },
  {
    type: "Sedan",
    avgSqft: 210,
    models: [
      { make: "Honda", model: "Civic Sedan", bodyType: "Sedan", totalSqft: 195 },
      { make: "Honda", model: "Accord", bodyType: "Sedan", totalSqft: 220 },
      { make: "Toyota", model: "Corolla", bodyType: "Sedan", totalSqft: 190 },
      { make: "Toyota", model: "Camry", bodyType: "Sedan", totalSqft: 220 },
      { make: "Nissan", model: "Altima", bodyType: "Sedan", totalSqft: 215 },
      { make: "Nissan", model: "Sentra", bodyType: "Sedan", totalSqft: 185 },
      { make: "Hyundai", model: "Elantra", bodyType: "Sedan", totalSqft: 195 },
      { make: "Hyundai", model: "Sonata", bodyType: "Sedan", totalSqft: 220 },
      { make: "Kia", model: "Forte", bodyType: "Sedan", totalSqft: 190 },
      { make: "Mazda", model: "Mazda3", bodyType: "Sedan", totalSqft: 185 },
      { make: "Subaru", model: "WRX", bodyType: "Sedan", totalSqft: 190 },
      { make: "BMW", model: "3 Series", bodyType: "Sedan", totalSqft: 210 },
      { make: "Tesla", model: "Model 3", bodyType: "Sedan", totalSqft: 200 },
      { make: "Dodge", model: "Charger", bodyType: "Sedan", totalSqft: 235 },
      { make: "Lexus", model: "IS", bodyType: "Sedan", totalSqft: 200 },
    ],
  },
  {
    type: "Hatchback / Wagon",
    avgSqft: 185,
    models: [
      { make: "Honda", model: "Civic Hatchback", bodyType: "Hatchback", totalSqft: 185 },
      { make: "Toyota", model: "GR Corolla", bodyType: "Hatchback", totalSqft: 190 },
      { make: "Mazda", model: "Mazda3 Hatchback", bodyType: "Hatchback", totalSqft: 180 },
      { make: "Volkswagen", model: "Golf GTI", bodyType: "Hatchback", totalSqft: 175 },
      { make: "Subaru", model: "Impreza", bodyType: "Hatchback", totalSqft: 185 },
      { make: "Hyundai", model: "Elantra N", bodyType: "Hatchback", totalSqft: 190 },
    ],
  },
  {
    type: "Compact SUV / Crossover",
    avgSqft: 240,
    models: [
      { make: "Toyota", model: "RAV4", bodyType: "SUV", totalSqft: 240 },
      { make: "Honda", model: "CR-V", bodyType: "SUV", totalSqft: 235 },
      { make: "Mazda", model: "CX-5", bodyType: "SUV", totalSqft: 225 },
      { make: "Subaru", model: "Crosstrek", bodyType: "SUV", totalSqft: 210 },
      { make: "Subaru", model: "Forester", bodyType: "SUV", totalSqft: 230 },
      { make: "Hyundai", model: "Tucson", bodyType: "SUV", totalSqft: 235 },
      { make: "Kia", model: "Sportage", bodyType: "SUV", totalSqft: 235 },
      { make: "Nissan", model: "Rogue", bodyType: "SUV", totalSqft: 240 },
      { make: "Tesla", model: "Model Y", bodyType: "SUV", totalSqft: 225 },
    ],
  },
  {
    type: "Full-Size SUV",
    avgSqft: 310,
    models: [
      { make: "Toyota", model: "4Runner", bodyType: "SUV", totalSqft: 280 },
      { make: "Toyota", model: "Highlander", bodyType: "SUV", totalSqft: 275 },
      { make: "Toyota", model: "Land Cruiser", bodyType: "SUV", totalSqft: 330 },
      { make: "Jeep", model: "Wrangler (4-door)", bodyType: "SUV", totalSqft: 260 },
      { make: "Jeep", model: "Grand Cherokee", bodyType: "SUV", totalSqft: 285 },
      { make: "Ford", model: "Bronco", bodyType: "SUV", totalSqft: 265 },
      { make: "Ford", model: "Expedition", bodyType: "SUV", totalSqft: 345 },
      { make: "Chevrolet", model: "Tahoe", bodyType: "SUV", totalSqft: 340 },
      { make: "Chevrolet", model: "Suburban", bodyType: "SUV", totalSqft: 370 },
      { make: "BMW", model: "X5", bodyType: "SUV", totalSqft: 290 },
    ],
  },
  {
    type: "Truck",
    avgSqft: 270,
    models: [
      { make: "Toyota", model: "Tacoma", bodyType: "Truck", totalSqft: 230 },
      { make: "Toyota", model: "Tundra", bodyType: "Truck", totalSqft: 300 },
      { make: "Ford", model: "F-150", bodyType: "Truck", totalSqft: 290 },
      { make: "Ford", model: "Ranger", bodyType: "Truck", totalSqft: 235 },
      { make: "Chevrolet", model: "Silverado 1500", bodyType: "Truck", totalSqft: 295 },
      { make: "Chevrolet", model: "Colorado", bodyType: "Truck", totalSqft: 230 },
      { make: "Ram", model: "1500", bodyType: "Truck", totalSqft: 295 },
      { make: "Nissan", model: "Frontier", bodyType: "Truck", totalSqft: 225 },
      { make: "Tesla", model: "Cybertruck", bodyType: "Truck", totalSqft: 280 },
    ],
  },
  {
    type: "Sports / Exotic",
    avgSqft: 160,
    models: [
      { make: "Chevrolet", model: "Corvette", bodyType: "Sports", totalSqft: 170 },
      { make: "Porsche", model: "911", bodyType: "Sports", totalSqft: 155 },
      { make: "Porsche", model: "Cayman", bodyType: "Sports", totalSqft: 145 },
      { make: "Lamborghini", model: "Huracán", bodyType: "Sports", totalSqft: 160 },
      { make: "Nissan", model: "GT-R", bodyType: "Sports", totalSqft: 180 },
      { make: "Toyota", model: "Supra", bodyType: "Sports", totalSqft: 160 },
      { make: "BMW", model: "M4", bodyType: "Coupe", totalSqft: 180 },
    ],
  },
  {
    type: "Van / Minivan",
    avgSqft: 330,
    models: [
      { make: "Honda", model: "Odyssey", bodyType: "Minivan", totalSqft: 270 },
      { make: "Toyota", model: "Sienna", bodyType: "Minivan", totalSqft: 270 },
      { make: "Ford", model: "Transit", bodyType: "Van", totalSqft: 400 },
      { make: "Mercedes-Benz", model: "Sprinter", bodyType: "Van", totalSqft: 450 },
      { make: "Ram", model: "ProMaster", bodyType: "Van", totalSqft: 420 },
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

// Design tier pricing per sqft
export const designTiers = [
  {
    id: "premade",
    label: "Pre-Made Design",
    description: "Choose from our existing anime designs",
    pricePerSqft: 7,
    turnaround: "5-7 business days",
  },
  {
    id: "semicustom",
    label: "Semi-Custom",
    description: "Modify an existing design with your preferences",
    pricePerSqft: 12,
    turnaround: "10-14 business days",
  },
  {
    id: "fullcustom",
    label: "Fully Custom Itasha",
    description: "Original artwork designed specifically for your vehicle",
    pricePerSqft: 20,
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
