import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Offer, SalesStats } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    name: "MKA Premium Brake Shoes",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400", // Representative bicycle/motor part image
    price: 380,
    category: "Brakes",
    rating: 4.8,
    description: "High-friction compound brake shoes designed for superior stopping power in wet and dry conditions. Compatible with popular Indian commuter bikes including Splendor, Passion, and HF Deluxe.",
    stock: true
  },
  {
    name: "Heavy Duty Drive Chain Kit",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400", // Motorbike chain/bike image
    price: 1450,
    category: "Transmission",
    rating: 4.9,
    description: "Pre-stretched high-tensile alloy steel chain and sprocket set. Designed for high cargo capacity, extreme durability, and smooth torque transmission.",
    stock: true
  },
  {
    name: "MKA Performance Carburetor Assembly",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=400", // Metallic mechanical part
    price: 2100,
    category: "Engine",
    rating: 4.7,
    description: "High-precision fuel-air mixing carburetor. Boosts cold-start performance and optimizes fuel efficiency by up to 12% in standard riding conditions.",
    stock: true
  },
  {
    name: "LED Headlight Bulb H4 Dual Beam",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=400", // Glowing light look
    price: 650,
    category: "Electrical",
    rating: 4.6,
    description: "Ultra-bright 6000K cool white LED conversion kit. Emits 300% more light than factory halogens with a sharp cutoff pattern to avoid blinding traffic.",
    stock: true
  },
  {
    name: "MKA Gas-Charged Shock Absorbers",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400", // Metallic piston / damper
    price: 2400,
    category: "Suspension",
    rating: 4.8,
    description: "Premium nitrogen-filled dual rear shock absorbers. Features 5-step preload adjustment to ensure passenger comfort on uneven terrains.",
    stock: true
  },
  {
    name: "Premium Oil Filter Element",
    image: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&q=80&w=400", // Metallic engine part filter
    price: 120,
    category: "Filters",
    rating: 4.5,
    description: "Micro-pore filtration paper with high dirt-holding capacity. Traps 99.5% of carbon residues and abrasive steel fragments to maximize engine life.",
    stock: true
  },
  {
    name: "MKA Cylinder Gasket Set",
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=400", // Circular metallic mechanical plate
    price: 420,
    category: "Engine",
    rating: 4.4,
    description: "Asbestos-free multi-layer steel cylinder head gaskets. Engineered to resist extreme combustion heat and pressure, preventing compression leaks.",
    stock: false
  },
  {
    name: "Ergonomic Foam Comfort Seat Cover",
    image: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=400", // Seat/fabric texture
    price: 550,
    category: "Accessories",
    rating: 4.7,
    description: "Anti-slip waterproof seat wrap loaded with double-density foam. Restores saddle comfort for long delivery runs and daily commuting.",
    stock: true
  },
  {
    name: "Zero Carbon Drive Belt (Gates)",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=400",
    price: 12500,
    category: "Transmission",
    rating: 4.9,
    description: "Genuine OEM Gates Carbon Drive Belt designed for Zero SR, SR/F, and SR/S electric motorcycles. High-tensile carbon fiber cords deliver instant torque with zero maintenance.",
    stock: true
  },
  {
    name: "Zero 6kW Quick Charger Module",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400",
    price: 45000,
    category: "Electrical",
    rating: 4.8,
    description: "High-speed 6kW EV charger module for Zero S, DS, and SR/F electric models. Reduces charging time by up to 75% for ultimate roadside convenience.",
    stock: true
  },
  {
    name: "Zero J-Juan Brake Pad Set",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400",
    price: 3200,
    category: "Brakes",
    rating: 4.7,
    description: "Premium sintered copper-alloy replacement brake pad kit for Zero J-Juan caliper braking systems. Consistent grip and heat dissipation.",
    stock: true
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    code: "MKAFIRST",
    description: "Get a flat ₹150 discount on your first in-person store purchase of ₹1,000 or above at the MKA motors showroom.",
    discount: "₹150 Off",
    expiry: "2026-12-31"
  },
  {
    code: "DRIVECHAIN20",
    description: "Claim 20% discount on heavy duty drive chain sprocket sets when buying wholesale quantities.",
    discount: "20% Off",
    expiry: "2026-10-15"
  },
  {
    code: "BRAKECLEAN",
    description: "Get a complimentary chain lube spray or brake fluid flush bottle on buying any set of brake shoes.",
    discount: "Free Gift",
    expiry: "2026-08-31"
  }
];

export const INITIAL_STATS: SalesStats = {
  totalStock: 350,
  totalServices: 1420,
  todaySales: 24500,
  monthSales: 680000,
  yearSales: 7800000
};

export async function seedDatabaseIfNeeded() {
  try {
    // 1. Seed Products - DISABLED (No auto-added products, manual additions only per user instructions)
    console.log("Auto-seeding of products is disabled. All products must be added manually.");

    // 2. Seed Offers
    const offersSnap = await getDocs(collection(db, 'offers'));
    if (offersSnap.empty) {
      console.log("Seeding initial active offers into Firestore...");
      const batch = writeBatch(db);
      INITIAL_OFFERS.forEach((offer) => {
        const docRef = doc(collection(db, 'offers'));
        batch.set(docRef, offer);
      });
      await batch.commit();
      console.log("Seeded offers successfully.");
    }

    // 3. Seed Stats
    const statsSnap = await getDocs(collection(db, 'stats'));
    if (statsSnap.empty) {
      console.log("Seeding initial sales statistics into Firestore...");
      // Use 'global' as the document ID so we always have a single predictable record
      await setDoc(doc(db, 'stats', 'global'), {
        ...INITIAL_STATS,
        updatedAt: new Date().toISOString()
      });
      console.log("Seeded global statistics successfully.");
    }
  } catch (err) {
    console.warn("Failed to seed database (likely permissions or offline during setup):", err);
  }
}

/**
 * Manually seeds all default products (including Zero Motorcycles electric spares)
 * into Firestore (or local storage if offline demo mode is active).
 */
export async function seedAllProductsManually(isDemoMode: boolean = false) {
  if (isDemoMode) {
    localStorage.setItem('mka_local_products', JSON.stringify(INITIAL_PRODUCTS));
    // Trigger window storage reload event to sync states
    window.dispatchEvent(new Event('storage'));
    return;
  }

  // Firestore seeding
  const productsSnap = await getDocs(collection(db, 'products'));
  const existingNames = new Set(productsSnap.docs.map(doc => doc.data().name));
  
  const missingProducts = INITIAL_PRODUCTS.filter(p => !existingNames.has(p.name));
  if (missingProducts.length > 0) {
    const batch = writeBatch(db);
    missingProducts.forEach((product) => {
      const docRef = doc(collection(db, 'products'));
      batch.set(docRef, product);
    });
    await batch.commit();
  } else {
    // If somehow all exist, just re-add standard products
    const batch = writeBatch(db);
    INITIAL_PRODUCTS.forEach((product) => {
      const docRef = doc(collection(db, 'products'));
      batch.set(docRef, product);
    });
    await batch.commit();
  }
}
