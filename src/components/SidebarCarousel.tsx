import Slider from 'react-slick';

const SidebarCarousel = () => {
const slides = [
  {
    image: 'src/assets/slide1.png',
    title: 'YouTube Analytics Dashboard',
    description: 'A modern dashboard that tracks and visualizes your YouTube channel performance, combining analytics, revenue, and public channel stats in one app.',
  },
  {
    image: 'src/assets/slide2.png',
    title: 'Secure Google Login',
    description: 'Login safely using Google OAuth 2.0. Tokens are stored locally for session persistence, and read-only scopes ensure secure access to your analytics data.',
  },
  {
    image: 'src/assets/slide3.png',
    title: 'Channel Analytics Insights',
    description: 'Track daily views, subscribers gained, watch time, and average view duration. Visualize trends with interactive Line charts for better decision making.',
  },
  {
    image: 'src/assets/slide1.png',
    title: 'Revenue Tracking',
    description: 'View estimated revenue, ad revenue, red partner revenue, and gross revenue. Monthly charts provide a clear overview, with friendly messages if revenue is unavailable.',
  },
  {
    image: 'src/assets/slide2.png',
    title: 'Public Channel Stats',
    description: 'Fetch statistics for any public channel using its channel ID. See title, thumbnail, subscribers, total views, total videos, and channel description.',
  },
  {
    image: 'src/assets/slide3.png',
    title: 'User-Friendly Interface',
    description: 'Responsive React.js UI with interactive charts powered by Chart.js. Easily filter by date ranges and navigate analytics with clarity.',
  },
  {
    image: 'src/assets/slide1.png',
    title: 'Future Enhancements',
    description: 'Export reports, add real-time notifications, support multiple channels, and integrate cross-platform analytics to maximize insights.',
  },
];


  const settings = {
    dots: true,
    infinite: true,
    speed:500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
      <Slider {...settings} className="my-40 w-100">
        {slides.map((slide, idx) => (
          <div key={idx}>
            <div>
            <img
              src={slide.image}
              alt={`Slide ${idx}`}
              className="m-auto w-50"
            />
            </div>
            <div className="mt-8 text-center w-100">
              <div className="text-white max-w-lg space-y-2">
                <h2 className="text-[28px]  text-center">{slide.title}</h2>
                
                <p className=" text-center py-12">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
  );
};

export default SidebarCarousel;
