import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addReview, getProduct, getReviews } from "../services/products";
import ProductMediaCarousel from "./ProductMediaCarousel";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spacer,
  Spinner,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { createTransaction } from "../services/transactions";
import { toast } from "react-hot-toast";
import ProductReviewCarousel from "./ProductReviewCarousel";
import NotFound from "../pages/NotFound";
import { Pencil, Plus, Undo2 } from "lucide-react";

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState("buy");
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [rating, setRating] = useState();
  const [reviewText, setReviewText] = useState("");
  const handleSecondModalOpen = () => setIsSecondModalOpen(true);
  const handleSecondModalClose = () => setIsSecondModalOpen(false);
  const {
    register: registerBuy,
    handleSubmit: handleSubmitBuy,
    formState: { errors: errorsBuy },
  } = useForm();
  const {
    register: registerRent,
    handleSubmit: handleSubmitRent,
    formState: { errors: errorsRent },
  } = useForm();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const data = await getReviews(id);
      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  async function onSubmit(values) {
    if (!isAuthenticated) {
      onOpen();
      return;
    }
    const requestData = {
      ...values,
      product_id: product.product_id,
      transaction_type: selected,
    };
    try {
      const data = await createTransaction(requestData);
      toast.success("Request made successfully.");
      console.log(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Request failed");
    }
  }

  const handleAddReviewModal = async () => {
    if (!isAuthenticated) {
      onOpen();
      return;
    } else {
      handleSecondModalOpen();
    }
  };
  
  const handleAddReview = async () => {
    try {
      const data = await addReview(product.product_id, {
        rating: parseInt(rating),
        review_text: reviewText,
      });
      toast.success(data.message);
      fetchReviews();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (loading) {
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

  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="container min-h-screen">
      <div className="flex md:flex-row flex-col items-center justify-between gap-3 my-5">
        <div className="w-[100%] md:w-[50%]">
          <ProductMediaCarousel media={product?.media} />
        </div>
        <div className="w-[100%] md:w-[50%]">
          <User
            className="cursor-pointer"
            name={product?.user?.name}
            description={`${product?.user?.city}, ${product?.user?.state}`}
            avatarProps={{
              src: product?.user?.profile_pic,
            }}
            onClick={() =>
              navigate(
                `/profile/${
                  user?.user_id != product.user_id ? product.user_id : ""
                }`
              )
            }
          />
          <h1 className="text-2xl">{product?.product_name}</h1>
          <Spacer y={2} />
          <p className="text-lg text-gray-600">{product.description}</p>
          <Spacer y={2} />
          <div className="flex gap-4">
            <Chip color="warning" variant="flat" className="text-xs sm:text-sm">
              {product?.category?.category_name}
            </Chip>
            <Chip color="warning" variant="flat" className="text-xs sm:text-sm">
              {product?.subcategory?.subcategory_name}
            </Chip>
            <Chip color="warning" variant="flat" className="text-xs sm:text-sm">
              {product?.condition?.charAt(0).toUpperCase() +
                product?.condition?.slice(1)}
            </Chip>
          </div>
          <Divider className="my-4" />
          <Chip
            color="primary"
            variant="bordered"
            className="text-xs sm:text-sm"
          >
            {product?.status?.charAt(0).toUpperCase() + product?.status?.slice(1)}
          </Chip>
          <Divider className="my-4" />
          <Chip
            color="warning"
            variant="flat"
            className="text-xs sm:text-sm mr-2"
          >
            ₹{product.price}
          </Chip>
          <Chip color="warning" variant="flat" className="text-xs sm:text-sm">
            {product.quantity} {product.unit}
          </Chip>
          <Spacer y={6} />
          <Button
            color="primary"
            onClick={handleAddReviewModal}
            startContent={<Plus />}
          >
            Add Review
          </Button>
          <Modal
            backdrop={"blur"}
            isOpen={isSecondModalOpen}
            onClose={handleSecondModalClose}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Leave a Review</ModalHeader>
                  <ModalBody>
                    <form className="flex flex-col gap-3">
                      <Select
                        label="Rating"
                        variant="bordered"
                        placeholder=""
                        selectedKeys={[rating]}
                        className=""
                        onChange={(e) => setRating(e.target.value)}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num}>{num.toString()}</SelectItem>
                        ))}
                      </Select>
                      <Textarea
                        label="Leave a comment."
                        variant="bordered"
                        placeholder=""
                        disableAutosize
                        classNames={{
                          base: "",
                          input: "resize-y min-h-[40px]",
                        }}
                        value={reviewText}
                        onValueChange={setReviewText}
                      />
                      <ModalFooter>
                        <Button
                          color="primary"
                          onClick={handleAddReview}
                          type="submit"
                        >
                          Submit
                        </Button>
                        <Button
                          color="danger"
                          variant="flat"
                          onPress={handleSecondModalClose}
                        >
                          Close
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
      <Divider className="my-4" />
      <h1 className="text-lg sm:pl-10 font-bold">Reviews</h1>
      <ProductReviewCarousel reviewList={reviews} />
      <Divider className="my-4" />
      {user?.user_id != product.user_id ? (
        <Tabs
          aria-label="Options"
          placement="start"
          selectedKey={selected}
          onSelectionChange={setSelected}
        >
          <Tab key="buy" title="Buy" className="w-full">
            <Card className="mb-8">
              <CardBody>
                <form
                  onSubmit={handleSubmitBuy(onSubmit)}
                  className="flex flex-col gap-3"
                >
                  <Input
                    autoFocus
                    label="Quantity"
                    type="number"
                    placeholder="Set a quantity"
                    variant="bordered"
                    endContent={product.unit}
                    defaultValue={product?.quantity}
                    {...registerBuy("quantity", {
                      required: "Quantity is required",
                      min: { value: 1, message: "Quantity must be at least 1" },
                      max: {
                        value: product.quantity,
                        message: `Quantity cannot exceed ${product.quantity}`,
                      },
                    })}
                    value={quantity}
                    onValueChange={setQuantity}
                    isInvalid={!!errorsBuy.quantity}
                    errorMessage={errorsBuy.quantity?.message}
                  />
                  <Input
                    isDisabled
                    type="number"
                    label="Price"
                    variant="bordered"
                    defaultValue={quantity * product.price}
                    value={quantity * product.price}
                    startContent="₹"
                  />
                  <Button color="primary" type="submit" className="w-48">
                    Make a request
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="rent" title="Rent" className="w-full">
            <Card className="mb-8">
              <CardBody>
                <form
                  onSubmit={handleSubmitRent(onSubmit)}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2">
                    <Input
                      autoFocus
                      label="Quantity"
                      type="number"
                      placeholder="Set a quantity"
                      variant="bordered"
                      endContent={product.unit}
                      defaultValue={product?.quantity}
                      {...registerRent("quantity", {
                        required: "Quantity is required",
                        min: {
                          value: 1,
                          message: "Quantity must be at least 1",
                        },
                        max: {
                          value: product.quantity,
                          message: `Quantity cannot exceed ${product.quantity}`,
                        },
                      })}
                      value={quantity}
                      onValueChange={setQuantity}
                      isInvalid={!!errorsRent.quantity}
                      errorMessage={errorsRent.quantity?.message}
                    />
                    <Input
                      autoFocus
                      label="Duration"
                      type="number"
                      placeholder="Set a duration"
                      variant="bordered"
                      endContent={"days"}
                      {...registerRent("duration", {
                        required: "Duration is required",
                        min: {
                          value: 1,
                          message: "Duration must be at least 1",
                        },
                      })}
                      isInvalid={!!errorsRent.duration}
                      errorMessage={errorsRent.duration?.message}
                    />
                  </div>
                  <Input
                    isDisabled
                    type="number"
                    label="Price"
                    variant="bordered"
                    value={quantity * product.price}
                    defaultValue={quantity * product.price}
                    startContent="₹"
                  />
                  <Button color="primary" type="submit" className="w-48">
                    Make a request
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      ) : (
        <Button
          onClick={() => navigate(`/products/${product.product_id}/edit`)}
          className="w-32"
          startContent={<Pencil />}
        >
          Edit Listing
        </Button>
      )}
      <Divider className="my-4" />
      <Button
        className="w-32 mb-8"
        onClick={() => navigate(-1)}
        startContent={<Undo2 />}
      >
        Go Back
      </Button>
      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Wait a minute!
              </ModalHeader>
              <ModalBody>You need to sign in to continue.</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Go back
                </Button>
                <Button color="primary" onPress={() => navigate("/login")}>
                  Sign In
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default Product;
