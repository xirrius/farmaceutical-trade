import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Image, Trash2 } from "lucide-react";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { deleteMedia } from "../services/products";
import toast from "react-hot-toast";

const EditMediaCarousel = ({ media }) => {

    const [mediaFiles, setMediaFiles] = useState([])

    useEffect(() => {
      setMediaFiles(media)
    }, [media])
    

    const handleDeleteMedia = async (product_id, media_id) => {
      try {
        const data = await deleteMedia(product_id, media_id);
        toast.success(data.message);
        setMediaFiles((prev) =>
          prev.filter((itm) => itm.media_id !== media_id)
        );
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={2}
      navigation={true}
      modules={[Navigation, Pagination]}
      pagination={{
        dynamicBullets: true,
      }}
    >
      {mediaFiles.length > 0 &&
        mediaFiles.map((item, index) => (
          <SwiperSlide key={index} className="sm:p-10">
            <div className="h-[350px]">
              {item.media_type === "image" ? (
                <>
                  <img
                    src={item.url}
                    alt={`Media ${index}`}
                    className="rounded-lg object-cover w-[100%] h-[100%]"
                  />
                  <Button
                    isIconOnly
                    color="primary"
                    variant="solid"
                    size="sm"
                    className="absolute top-12 right-12"
                    onClick={() =>
                      handleDeleteMedia(item.product_id, item.media_id)
                    }
                  >
                    <Trash2 className="w-[20px]" color="white" />
                  </Button>
                </>
              ) : (
                <>
                  <video
                    controls
                    className="rounded-lg object-cover w-[100%] h-[100%]"
                  >
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    isIconOnly
                    color="primary"
                    variant="solid"
                    size="sm"
                    className="absolute sm:top-12 sm:right-12 top-3 right-3"
                    onClick={() =>
                      handleDeleteMedia(item.product_id, item.media_id)
                    }
                  >
                    <Trash2 className="w-[20px]" color="white" />
                  </Button>
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      {mediaFiles.length === 0 && (
        <div className="h-[350px] border-2 rounded-lg w-[100%] flex items-center justify-center">
          <Image />
        </div>
      )}
    </Swiper>
  );
};
export default EditMediaCarousel;
