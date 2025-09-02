import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProviders from '../components/FeaturedProviders';
import HowItWorks from '../components/HowItWorks';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedProviders />
      <HowItWorks />
    </div>
  );
};

export default Home;