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
    avgSqft: 52,
    models: [
      { make: "Honda", model: "Civic Coupe", bodyType: "Coupe", totalSqft: 50 },
      { make: "Toyota", model: "GR86", bodyType: "Coupe", totalSqft: 48 },
      { make: "Subaru", model: "BRZ", bodyType: "Coupe", totalSqft: 48 },
      { make: "Mazda", model: "MX-5 Miata", bodyType: "Roadster", totalSqft: 42 },
      { make: "Nissan", model: "370Z / Z", bodyType: "Coupe", totalSqft: 50 },
      { make: "BMW", model: "2 Series Coupe", bodyType: "Coupe", totalSqft: 52 },
      { make: "Ford", model: "Mustang", bodyType: "Coupe", totalSqft: 56 },
      { make: "Chevrolet", model: "Camaro", bodyType: "Coupe", totalSqft: 55 },
      { make: "Dodge", model: "Challenger", bodyType: "Coupe", totalSqft: 58 },
      { make: "Hyundai", model: "Veloster", bodyType: "Hatchback", totalSqft: 48 },
    ],
  },
  {
    type: "Sedan",
    avgSqft: 62,
    models: [
      { make: "Honda", model: "Civic Sedan", bodyType: "Sedan", totalSqft: 58 },
      { make: "Honda", model: "Accord", bodyType: "Sedan", totalSqft: 64 },
      { make: "Toyota", model: "Corolla", bodyType: "Sedan", totalSqft: 57 },
      { make: "Toyota", model: "Camry", bodyType: "Sedan", totalSqft: 65 },
      { make: "Nissan", model: "Altima", bodyType: "Sedan", totalSqft: 63 },
      { make: "Nissan", model: "Sentra", bodyType: "Sedan", totalSqft: 56 },
      { make: "Hyundai", model: "Elantra", bodyType: "Sedan", totalSqft: 58 },
      { make: "Hyundai", model: "Sonata", bodyType: "Sedan", totalSqft: 65 },
      { make: "Kia", model: "Forte", bodyType: "Sedan", totalSqft: 57 },
      { make: "Mazda", model: "Mazda3", bodyType: "Sedan", totalSqft: 56 },
      { make: "Subaru", model: "WRX", bodyType: "Sedan", totalSqft: 57 },
      { make: "BMW", model: "3 Series", bodyType: "Sedan", totalSqft: 62 },
      { make: "Tesla", model: "Model 3", bodyType: "Sedan", totalSqft: 60 },
      { make: "Dodge", model: "Charger", bodyType: "Sedan", totalSqft: 68 },
      { make: "Lexus", model: "IS", bodyType: "Sedan", totalSqft: 60 },
    ],
  },
  {
    type: "Hatchback / Wagon",
    avgSqft: 55,
    models: [
      { make: "Honda", model: "Civic Hatchback", bodyType: "Hatchback", totalSqft: 55 },
      { make: "Toyota", model: "GR Corolla", bodyType: "Hatchback", totalSqft: 56 },
      { make: "Mazda", model: "Mazda3 Hatchback", bodyType: "Hatchback", totalSqft: 54 },
      { make: "Volkswagen", model: "Golf GTI", bodyType: "Hatchback", totalSqft: 53 },
      { make: "Subaru", model: "Impreza", bodyType: "Hatchback", totalSqft: 55 },
      { make: "Hyundai", model: "Elantra N", bodyType: "Hatchback", totalSqft: 55 },
    ],
  },
  {
    type: "Compact SUV / Crossover",
    avgSqft: 65,
    models: [
      { make: "Toyota", model: "RAV4", bodyType: "SUV", totalSqft: 65 },
      { make: "Honda", model: "CR-V", bodyType: "SUV", totalSqft: 64 },
      { make: "Mazda", model: "CX-5", bodyType: "SUV", totalSqft: 62 },
      { make: "Subaru", model: "Crosstrek", bodyType: "SUV", totalSqft: 58 },
      { make: "Subaru", model: "Forester", bodyType: "SUV", totalSqft: 63 },
      { make: "Hyundai", model: "Tucson", bodyType: "SUV", totalSqft: 64 },
      { make: "Kia", model: "Sportage", bodyType: "SUV", totalSqft: 64 },
      { make: "Nissan", model: "Rogue", bodyType: "SUV", totalSqft: 65 },
      { make: "Tesla", model: "Model Y", bodyType: "SUV", totalSqft: 63 },
    ],
  },
  {
    type: "Full-Size SUV",
    avgSqft: 82,
    models: [
      { make: "Toyota", model: "4Runner", bodyType: "SUV", totalSqft: 78 },
      { make: "Toyota", model: "Highlander", bodyType: "SUV", totalSqft: 76 },
      { make: "Toyota", model: "Land Cruiser", bodyType: "SUV", totalSqft: 88 },
      { make: "Jeep", model: "Wrangler (4-door)", bodyType: "SUV", totalSqft: 72 },
      { make: "Jeep", model: "Grand Cherokee", bodyType: "SUV", totalSqft: 78 },
      { make: "Ford", model: "Bronco", bodyType: "SUV", totalSqft: 72 },
      { make: "Ford", model: "Expedition", bodyType: "SUV", totalSqft: 92 },
      { make: "Chevrolet", model: "Tahoe", bodyType: "SUV", totalSqft: 90 },
      { make: "Chevrolet", model: "Suburban", bodyType: "SUV", totalSqft: 100 },
      { make: "BMW", model: "X5", bodyType: "SUV", totalSqft: 80 },
    ],
  },
  {
    type: "Truck",
    avgSqft: 75,
    models: [
      { make: "Toyota", model: "Tacoma", bodyType: "Truck", totalSqft: 68 },
      { make: "Toyota", model: "Tundra", bodyType: "Truck", totalSqft: 85 },
      { make: "Ford", model: "F-150", bodyType: "Truck", totalSqft: 82 },
      { make: "Ford", model: "Ranger", bodyType: "Truck", totalSqft: 68 },
      { make: "Chevrolet", model: "Silverado 1500", bodyType: "Truck", totalSqft: 84 },
      { make: "Chevrolet", model: "Colorado", bodyType: "Truck", totalSqft: 67 },
      { make: "Ram", model: "1500", bodyType: "Truck", totalSqft: 84 },
      { make: "Nissan", model: "Frontier", bodyType: "Truck", totalSqft: 66 },
      { make: "Tesla", model: "Cybertruck", bodyType: "Truck", totalSqft: 80 },
    ],
  },
  {
    type: "Sports / Exotic",
    avgSqft: 50,
    models: [
      { make: "Chevrolet", model: "Corvette", bodyType: "Sports", totalSqft: 52 },
      { make: "Porsche", model: "911", bodyType: "Sports", totalSqft: 48 },
      { make: "Porsche", model: "Cayman", bodyType: "Sports", totalSqft: 46 },
      { make: "Lamborghini", model: "Huracán", bodyType: "Sports", totalSqft: 48 },
      { make: "Nissan", model: "GT-R", bodyType: "Sports", totalSqft: 54 },
      { make: "Toyota", model: "Supra", bodyType: "Sports", totalSqft: 50 },
      { make: "BMW", model: "M4", bodyType: "Coupe", totalSqft: 55 },
    ],
  },
  {
    type: "Van / Minivan",
    avgSqft: 130,
    models: [
      { make: "Honda", model: "Odyssey", bodyType: "Minivan", totalSqft: 105 },
      { make: "Toyota", model: "Sienna", bodyType: "Minivan", totalSqft: 105 },
      { make: "Ford", model: "Transit", bodyType: "Van", totalSqft: 180 },
      { make: "Mercedes-Benz", model: "Sprinter", bodyType: "Van", totalSqft: 200 },
      { make: "Ram", model: "ProMaster", bodyType: "Van", totalSqft: 190 },
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
    pricePerSqft: 18,
    turnaround: "5-7 business days",
  },
  {
    id: "semicustom",
    label: "Semi-Custom",
    description: "Modify an existing design with your preferences",
    pricePerSqft: 30,
    turnaround: "10-14 business days",
  },
  {
    id: "fullcustom",
    label: "Fully Custom Itasha",
    description: "Original artwork designed specifically for your vehicle",
    pricePerSqft: 48,
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
