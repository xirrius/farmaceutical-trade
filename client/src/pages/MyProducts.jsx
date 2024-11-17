import { useEffect, useState } from "react";
import { deleteProduct, getMyProducts } from "../services/products";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import NotFound from "./NotFound";
import { Pencil, Trash2, Undo2 } from "lucide-react";
import toast from "react-hot-toast";

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getMyProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  if (!products) {
    return <NotFound />;
  }

  const handleDeleteProduct = async (id) => {
    try {
      const data = await deleteProduct(id);
      toast.success(data.message);
      setProducts((prev) => prev.filter((itm) => itm.product_id !== id));
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className="container min-h-screen">
      <h1 className="text-xl font-bold p-4">My Items</h1>
      <div className="flex flex-wrap gap-4 py-4 px-4 items-center justify-center lg:justify-start">
        {products &&
          products.map((product) => (
            <Card
              className="w-full md:w-[320px] md:h-[410px] lg:w-96 lg:h-[500px]"
              key={product.product_id}
            >
              <CardHeader className="flex-col items-start">
                <h1 className="text-xl lg:text-2xl font-black p-3 pb-0">
                  {product.product_name}
                </h1>
                <Chip
                  color="warning"
                  variant="bordered"
                  className="absolute right-2 top-2 text-xs sm:text-sm"
                >
                  {product.status.charAt(0).toUpperCase() +
                    product.status.slice(1)}
                </Chip>
              </CardHeader>
              <CardBody>
                <div className="px-5">
                  {product.media?.length > 0 &&
                    (product.media[0].media_type === "image" ? (
                      <img
                        src={product.media[0].url}
                        alt="Product media"
                        className="w-full rounded-xl h-[240px] md:h-[180px] lg:h-[240px] object-cover"
                      />
                    ) : product.media[0].media_type === "video" ? (
                      <video
                        muted
                        autoPlay
                        loop
                        controls
                        src={product.media[0].url}
                        className="w-full rounded-xl h-[240px] md:h-[180px] lg:h-[240px] object-cover"
                      />
                    ) : null)}
                </div>

                <div className="px-5 py-2">
                  <p className="text-sm sm:text-medium font-light text-gray-700 pb-4 pl-2">
                    {product.description}
                  </p>

                  <div className="flex gap-1 sm:gap-3 ">
                    <Chip
                      color="warning"
                      variant="flat"
                      className="text-xs sm:text-sm"
                    >
                      ₹{product.price}
                    </Chip>
                    <Chip
                      color="warning"
                      variant="flat"
                      className="text-xs sm:text-sm"
                    >
                      {product.quantity} {product.unit}
                    </Chip>
                  </div>
                  <Spacer y={4} />
                  <div className="flex gap-1 sm:gap-3">
                    <Chip
                      color="warning"
                      variant="flat"
                      className="text-xs sm:text-sm"
                    >
                      {product.category.category_name}
                    </Chip>
                    <Chip
                      color="warning"
                      variant="flat"
                      className="text-xs sm:text-sm"
                    >
                      {product.subcategory.subcategory_name}
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
              </CardBody>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  color="primary"
                  auto
                  isIconOnly
                  className=""
                  onClick={() =>
                    navigate(`/products/${product.product_id}/edit`)
                  }
                >
                  <Pencil />
                </Button>
                <Button
                  size="sm"
                  color="flat"
                  auto
                  isIconOnly
                  className=""
                  onPress={onOpen}
                >
                  <Trash2 color="red" />
                </Button>
                <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Are you sure?
                        </ModalHeader>
                        <ModalBody>
                          Are you sure you want to delete this item?
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="primary"
                            variant="light"
                            onPress={onClose}
                          >
                            Go back
                          </Button>
                          <Button
                            color="danger"
                            onPress={() =>
                              handleDeleteProduct(product.product_id)
                            }
                          >
                            Delete
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </Card>
          ))}
      </div>
      <Button
        className="w-32 mb-8 m-4"
        onClick={() => navigate(-1)}
        startContent={<Undo2 />}
      >
        Go Back
      </Button>
    </div>
  );
};

export default MyProducts;
