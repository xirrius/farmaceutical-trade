import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Divider,
  Spacer,
  Spinner,
  User,
} from "@nextui-org/react";
import NotFound from "../pages/NotFound";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../services/products";
import ProductMediaCarousel from "./ProductMediaCarousel";
import { Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import { getRental, updateRentalStatus } from "../services/rentals";

const Transaction = () => {
  const [rental, setRental] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [product, setProduct] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const data = await getRental(id);
        setRental(data.rental);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRental();
  }, [id]);

  useEffect(() => {
    if (rental && rental.product_id) {
      setLoadingProduct(true);
      const fetchProduct = async () => {
        try {
          const data = await getProduct(rental.product_id);
          setProduct(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [rental]);

  const handleUpdateStatus = async () => {
    try {
      await updateRentalStatus(id);
      toast.success("Rental entry updated.");
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getRentalStatus = (endDate) => {
    const end = new Date(endDate);

    const today = new Date();

    const dayDifference = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    return dayDifference > 0
      ? `${dayDifference} days remaining`
      : `${Math.abs(dayDifference)} days overdue`;
  };

  if (loading || (rental && loadingProduct)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner
          size="lg"
          label="Loading..."
          color="danger"
          labelColor="danger"
        />
      </div>
    );
  }

  if (!rental || !product) {
    return <NotFound />;
  }

  return (
    <div className="container min-h-screen">
      <h1 className="text-xl font-bold pt-4 pl-8">Rental Entry</h1>

      <div className="flex md:flex-row flex-col items-center justify-between gap-3 my-5">
        <div className="w-[100%] md:w-[50%]">
          <ProductMediaCarousel media={product?.media} />
        </div>
        <div className="w-[100%] md:w-[50%]">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl">{product.product_name}</h1>
              <Spacer y={2} />
              <p className="text-lg text-gray-600">{product.description}</p>
              <Spacer y={2} />
              <div className="flex gap-4">
                <Chip
                  color="warning"
                  variant="flat"
                  className="text-xs sm:text-sm"
                >
                  {product?.category.category_name}
                </Chip>
                <Chip
                  color="warning"
                  variant="flat"
                  className="text-xs sm:text-sm"
                >
                  {product?.subcategory.subcategory_name}
                </Chip>
                <Chip
                  color="warning"
                  variant="flat"
                  className="text-xs sm:text-sm"
                >
                  {product.condition.charAt(0).toUpperCase() +
                    product.condition.slice(1)}
                </Chip>
              </div>
            </div>
            <p className="text-xs text-gray-700">
              Last Updated: {new Date(rental.updated_at).toLocaleTimeString()},{" "}
              {new Date(rental.updated_at).toLocaleDateString()}
            </p>
          </div>
          <Divider className="my-4" />
          <div className="text-sm text-gray-500">
            Start Date: {new Date(rental.rental_start_date).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">
            End Date: {new Date(rental.rental_end_date).toLocaleDateString()}
          </div>
          <div className=" flex gap-4 my-2">
            {rental.status !== "returned"
              ? getRentalStatus(rental.rental_end_date)
              : "Returned"}
          </div>
          <Divider className="my-4" />
          <div className="flex gap-4 items-center text-sm text-gray-700 py-2">
            <p>{rental.role === "renter" ? "Owner: " : "Renter: "}</p>
            <User
              className="cursor-pointer"
              onClick={() => navigate(`/profile/${rental.otherParty.user_id}`)}
              name={rental.otherParty.name}
              description={`${rental.otherParty.city}, ${rental.otherParty.state}`}
              avatarProps={{
                src: rental.otherParty.profile_pic,
              }}
            />
          </div>
          <Divider className="my-4" />
          <div className="flex justify-between items-center text-sm text-gray-700 py-2">
            <div className="flex gap-4 items-center text-sm text-gray-700">
              <p>Status: </p>
              <Chip
                variant="bordered"
                color={
                  rental.status === "returned"
                    ? `success`
                    : rental.status === "overdue"
                    ? `danger`
                    : `warning`
                }
              >
                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
              </Chip>
            </div>
          </div>
          <Spacer y={6} />
          {rental.role == "owner" && rental.status === "active" && (
            <div className="flex gap-4">
              <Button
                color="success"
                variant="bordered"
                onClick={() => handleUpdateStatus()}
              >
                Mark As Returned
              </Button>
            </div>
          )}
          <Divider className="my-4" />
          <Button
            color="primary"
            className="w-32 md:w-64 mb-8"
            onClick={() => navigate(-1)}
            startContent={<Undo2 />}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Transaction;
