import { useEffect, useState } from "react";
import {
  getTransaction,
  updateTransactionStatus,
} from "../services/transactions";
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

const Transaction = () => {
  const [transaction, setTransaction] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [product, setProduct] = useState();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await getTransaction(id);
        setTransaction(data.transaction);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  useEffect(() => {
    if (transaction && transaction.product_id) {
      setLoadingProduct(true);
      const fetchProduct = async () => {
        try {
          const data = await getProduct(transaction.product_id);
          setProduct(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [transaction]);

  const handleUpdateStatus = async (val) => {
    console.log(val);
    try {
      await updateTransactionStatus(transaction.transaction_id, val);
      toast.success("Activity updated.");
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (loading || (transaction && loadingProduct)) {
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

  if (!transaction || !product) {
    return <NotFound />;
  }

  return (
    <div className="container min-h-screen">
      <h1 className="text-xl font-bold pt-4 pl-8">Activity</h1>

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
              Last Updated:{" "}
              {new Date(transaction.updated_at).toLocaleTimeString()},{" "}
              {new Date(transaction.updated_at).toLocaleDateString()}
            </p>
          </div>
          <Divider className="my-4" />
          <div className="text-sm text-gray-500">
            Date: {new Date(transaction.transaction_date).toLocaleDateString()}
          </div>
          <div className=" flex gap-4 my-2">
            <p>Amount: ₹{transaction.price}</p>
            <p>
              Quantity: {transaction.quantity} {product.unit}
            </p>
          </div>
          <Divider className="my-4" />
          <div className="flex gap-4 items-center text-sm text-gray-700 py-2">
            <p>
              {transaction.role === "buyer" &&
              transaction.transaction_type === "rent"
                ? "Owner: "
                : transaction.role === "buyer" &&
                  transaction.transaction_type === "buy"
                ? "Seller: "
                : transaction.role === "seller" &&
                  transaction.transaction_type === "rent" ? "Renter: " : "Buyer: "}
            </p>
            <User
              className="cursor-pointer"
              onClick={() =>
                navigate(`/profile/${transaction.otherParty.user_id}`)
              }
              name={transaction.otherParty.name}
              description={`${transaction.otherParty.city}, ${transaction.otherParty.state}`}
              avatarProps={{
                src: transaction.otherParty.profile_pic,
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
                  transaction.status === "completed"
                    ? `success`
                    : transaction.status === "cancelled"
                    ? `danger`
                    : `warning`
                }
              >
                {transaction.status.charAt(0).toUpperCase() +
                  transaction.status.slice(1)}
              </Chip>
            </div>
          </div>
          <Spacer y={6} />
          {transaction.role === "seller" &&
            transaction.status === "pending" && (
              <div className="flex gap-4">
                <Button
                  color="success"
                  variant="bordered"
                  onClick={() => handleUpdateStatus("completed")}
                >
                  Mark As Completed
                </Button>
                <Button
                  color="danger"
                  variant="bordered"
                  onClick={() => handleUpdateStatus("cancelled")}
                >
                  Mark As Cancelled
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
