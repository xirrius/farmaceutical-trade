import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { File, Image } from "lucide-react";

const ProductMediaCarousel = ({ media }) => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      navigation={true}
      modules={[Navigation, Pagination]}
      pagination={{
        dynamicBullets: true,
      }}
    >
      {media.length > 0 &&
        media.map((item, index) => (
          <SwiperSlide key={index} className="sm:p-10">
            <div className="h-[350px]">
              {item.media_type === "image" ? (
                <img
                  src={item.url}
                  alt={`Media ${index}`}
                  className="rounded-lg object-cover w-[100%] h-[100%]"
                />
              ) : (
                <video
                  controls
                  className="rounded-lg object-cover w-[100%] h-[100%]"
                >
                  <source src={item.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </SwiperSlide>
        ))}
      {media.length === 0 && (
        <div className="h-[350px] border-2 rounded-lg w-[100%] flex items-center justify-center">
          <Image />
        </div>
      )}
    </Swiper>
  );
};
export default ProductMediaCarousel;
