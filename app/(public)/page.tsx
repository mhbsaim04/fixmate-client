import { Categories } from "@/components/home/categories";
import { FeaturedServices } from "@/components/home/featured-services";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { TechnicianCta } from "@/components/home/technician-cta";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { getServices } from "@/lib/public-api";

export default async function HomePage() {
  // The API returns approved + available services sorted by createdAt desc.
  const { services } = await getServices({ sort: "newest", limit: 6 });
  return (
    <>
      <Hero />
      <FeaturedServices services={services} />
      <HowItWorks />
      <Categories />
      <WhyChooseUs />
      <TechnicianCta />
    </>
  );
}
