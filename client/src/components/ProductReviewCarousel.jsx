import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@nextui-org/react";
import { Star, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { deleteReview } from "../services/products";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ProductReviewCarousel = ({ reviewList }) => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [slides, setSlides] = useState(3);
  const {t} = useTranslation()

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    if (window.innerWidth <= 1200) {
      setSlides(2.3);
    } else {
      setSlides(1.7);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth > 1200) {
      setSlides(3);
    } else if (windowWidth <= 1200 && windowWidth > 768) {
      setSlides(2);
    } else if (windowWidth <= 768 && windowWidth > 576) {
      setSlides(1.5);
    } else {
      setSlides(1);
    }
  }, [windowWidth]);

  useEffect(() => {
    setReviews(reviewList);
  }, [reviewList]);

  const handleDeleteReview = async (product_id, review_id) => {
    try {
      const data = await deleteReview(product_id, review_id);
      toast.success(data.message);
      setReviews((prev) =>
        prev.filter((review) => review.review_id !== review_id)
      );
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={slides}
      navigation={true}
      modules={[Navigation, Pagination]}
      pagination={{
        dynamicBullets: true,
      }}
    >
      {reviews.length > 0 &&
        reviews.map((item, index) => (
          <SwiperSlide key={index} className="p-10">
            <Card className="h-[200px]">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src={item.user.profile_pic}
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {item.user.name}
                    </h4>
                  </div>
                </div>
                <Chip
                  startContent={<Star size={15} />}
                  color="warning"
                  radius="full"
                  size="md"
                  variant="bordered"
                >
                  {item.rating}
                </Chip>
              </CardHeader>
              <CardBody className="text-small text-default-400">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      fill={index < item.rating ? "#ffc800" : "#666"}
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="pl-1 pt-2">{item.review_text}</p>
              </CardBody>
              <CardFooter className="gap-3 justify-between">
                <p className=" text-default-400 text-small">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
                <Button
                  isIconOnly
                  color="none"
                  size="sm"
                  onClick={() =>
                    handleDeleteReview(item.product_id, item.review_id)
                  }
                >
                  {user?.user_id == item.user_id && (
                    <Trash2 className="w-[20px]" color="red" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          </SwiperSlide>
        ))}
      {reviews.length === 0 && <p className="text-gray-600 pl-10">{t("No Reviews")}</p>}
    </Swiper>
  );
};
export default ProductReviewCarousel;
