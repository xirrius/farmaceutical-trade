import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from "@nextui-org/react";

const UserProductsCarousel = ({ userProducts }) => {

  return (
    <Swiper
      spaceBetween={1}
      slidesPerView={1}
      navigation={true}
      modules={[Navigation, Pagination]}
      pagination={{
        dynamicBullets: true,
      }}
    >
      {userProducts &&
        userProducts.map((item, index) => (
          <SwiperSlide key={index} className="p-5">
            <Card className="max-w-[400px]">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {item.product_name}
                    </h4>
                  </div>
                </div>
                <Chip
                  color="warning"
                  radius="full"
                  size="md"
                  variant="bordered"
                  className="text-small"
                >
                  {item.status.charAt(0).toUpperCase() +
                    item.status.slice(1)}
                </Chip>
              </CardHeader>
              <CardBody className="text-small text-default-400">
                <p className="pl-1 pt-2">
                  {item.quantity} {item.unit}
                </p>
                <p className="pl-1 pt-2">₹{item.price}</p>
              </CardBody>
              <CardFooter className="gap-3 justify-between">
                <p className=" text-default-400 text-small">
                  {new Date(item.updated_at).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};
export default UserProductsCarousel;
