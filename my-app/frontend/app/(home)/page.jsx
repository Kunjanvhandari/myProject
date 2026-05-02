import HomeLayout from "../layouts/HomeLayout/layout";
import Banner from "./Banner";
import FeaturedBook from "./FeaturedBook";
import ComingSoonCarousel from "./ComingSoonCarousel";
import BookNewsletter from "./BookNewsletter";
import ArtistList from "./ArtistList";
import GallaryBooks from "./GallaryBooks";
import DigitalContent from "./DigitalContent";
import NewReleaseBooks from "./NewReleaseBooks";

export default function Home() {
  return (
    <>
      <HomeLayout>
    
        <Banner/>
        <GallaryBooks/>
        <DigitalContent/>
        <NewReleaseBooks/>
        <FeaturedBook />
        <ComingSoonCarousel />
        <BookNewsletter />
        <ArtistList/>
        
      </HomeLayout>
    </>
  );
} 
