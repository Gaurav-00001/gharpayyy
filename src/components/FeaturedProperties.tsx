import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const properties = [
  {
    image: property1,
    title: "Sunshine PG for Men",
    location: "Koramangala, Bangalore",
    price: 8500,
    rating: 4.6,
    occupancy: "Triple Sharing",
    amenities: ["WiFi", "AC", "Food"],
    verified: true,
    gender: "male" as const,
  },
  {
    image: property2,
    title: "GreenView Ladies PG",
    location: "HSR Layout, Bangalore",
    price: 10000,
    rating: 4.8,
    occupancy: "Double Sharing",
    amenities: ["WiFi", "AC", "Food"],
    verified: true,
    gender: "female" as const,
  },
  {
    image: property3,
    title: "Urban Nest Co-Living",
    location: "Indiranagar, Bangalore",
    price: 12500,
    rating: 4.7,
    occupancy: "Single Room",
    amenities: ["WiFi", "AC", "Food"],
    verified: true,
    gender: "unisex" as const,
  },
];

const FeaturedProperties = () => {
  return (
    <section id="properties" className="py-20 md:py-28 bg-surface">
      <div className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-medium text-secondary uppercase tracking-wider">
            Featured Listings
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            Top Rated PGs Near You
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Handpicked, verified accommodations with the best amenities and reviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PropertyCard {...p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
