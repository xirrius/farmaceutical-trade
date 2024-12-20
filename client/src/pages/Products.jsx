import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/products";
import { getCategories, getSubCategories } from "../services/categories";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Pagination,
  useDisclosure,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalContent,
  Modal,
  Card,
  CardHeader,
  CardBody,
  Spacer,
  User,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import NotFound from "./NotFound";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const Products = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async (id) => {
      const data = await getSubCategories(id);
      setSubCategories(data);
    };
    fetchSubCategories(category);
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("rerun");
        const data = await getProducts({
          page,
          limit,
          sortBy,
          order,
          search,
          category,
          subcategory,
          condition,
          status,
          maxPrice,
          maxQuantity,
        });
        setProducts(data.result);
        setTotalPages(Math.ceil(data.total / limit));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [
    page,
    limit,
    sortBy,
    order,
    search,
    category,
    subcategory,
    condition,
    status,
    maxPrice,
    maxQuantity,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner
          size="lg"
          label={t("Loading...")}
          color="danger"
          labelColor="danger"
        />
      </div>
    );
  }

  if (!products) {
    return <NotFound />;
  }

  return (
    <div className="container">
        <Button isIconOnly onClick={() => navigate(-1)} className="my-2"><ArrowLeft/></Button>
      <h1 className="text-2xl font-bold tracking-widest text-center my-4">{t("Marketplace")}</h1>
      <div className="hidden sm:flex p-2 flex-col gap-2 justify-center">
        <Input
          isClearable
          placeholder={t("Search...")}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xxxl"
        />
        <div className="flex gap-2 flex-wrap justify-center">
          <Select
            variant="bordered"
            label={t("Select a category")}
            selectedKeys={[category]}
            className="max-w-xs w-48 md:w-64"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <SelectItem key={item.category_id}>
                {t(item.category_name)}
              </SelectItem>
            ))}
          </Select>
          <Select
            variant="bordered"
            label={t("Select a subcategory")}
            selectedKeys={[subcategory]}
            className="max-w-xs w-48 md:w-64"
            onChange={(e) => setSubcategory(e.target.value)}
          >
            {subcategories.map((item) => (
              <SelectItem key={item.subcategory_id}>
                {t(item.subcategory_name)}
              </SelectItem>
            ))}
          </Select>
          <Select
            variant="bordered"
            label={t("Timeline")}
            selectedKeys={[order]}
            className="max-w-xs w-48 md:w-64"
            onChange={(e) => setOrder(e.target.value)}
          >
            <SelectItem key="asc">{t("Oldest")}</SelectItem>
            <SelectItem key="desc">{t("Latest")}</SelectItem>
          </Select>
          <Select
            variant="bordered"
            label={t("Price")}
            selectedKeys={[maxPrice]}
            className="max-w-xs w-48 md:w-64"
            onChange={(e) => setMaxPrice(e.target.value)}
          >
            <SelectItem key={50}>{t("Below 50")}</SelectItem>
            <SelectItem key={100}>{t("Below 100")}</SelectItem>
            <SelectItem key={500}>{t("Below 500")}</SelectItem>
            <SelectItem key={1000}>{t("Below 1000")}</SelectItem>
          </Select>
          <Select
            variant="bordered"
            label={t("Quantity")}
            selectedKeys={[maxQuantity]}
            className="max-w-xs w-48 md:w-64"
            onChange={(e) => setMaxQuantity(e.target.value)}
          >
            <SelectItem key={50}>{t("Below 5")}</SelectItem>
            <SelectItem key={100}>{t("Below 10")}</SelectItem>
            <SelectItem key={500}>{t("Below 50")}</SelectItem>
            <SelectItem key={1000}>{t("Below 100")}</SelectItem>
          </Select>
          <Select
            variant="bordered"
            label={t("Condition")}
            selectedKeys={[condition]}
            className="max-w-xs w-48 md:w-64"
            onChange={(e) => setCondition(e.target.value)}
          >
            <SelectItem key={"new"}>{t("New")}</SelectItem>
            <SelectItem key={"used"}>{t("Used")}</SelectItem>
          </Select>
          <Select
            variant="bordered"
            label={t("Status")}
            selectedKeys={[status]}
            className="max-w-xs w-48 md:w-64"
            onChange={(e) => setStatus(e.target.value)}
          >
            <SelectItem key={"available"}>{t("Available")}</SelectItem>
            <SelectItem key={"sold"}>{t("Sold")}</SelectItem>
            <SelectItem key={"rented"}>{t("Rented")}</SelectItem>
          </Select>
        </div>
      </div>
      <div className="flex justify-center py-3 ">
        <Button
          color="primary"
          onPress={onOpen}
          className="sm:hidden m-auto w-64"
        >
          {t("Apply Filters")}
        </Button>
      </div>
      <Modal size={"full"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pl-10">
                {t("Filters")}
              </ModalHeader>
              <ModalBody>
                <div className="flex p-2 flex-col gap-2 justify-center">
                  <Input
                    isClearable
                    placeholder={t("Search...")}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xxxl py-2"
                  />
                  <div className="flex gap-2 flex-col">
                    <Select
                      variant="bordered"
                      label={t("Select a category")}
                      selectedKeys={[category]}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((item) => (
                        <SelectItem key={item.category_id}>
                          {t(item.category_name)}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      variant="bordered"
                      label={t("Select a subcategory")}
                      selectedKeys={[subcategory]}
                      onChange={(e) => setSubcategory(e.target.value)}
                    >
                      {subcategories.map((item) => (
                        <SelectItem key={item.subcategory_id}>
                          {t(item.subcategory_name)}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      variant="bordered"
                      label={t("Timeline")}
                      selectedKeys={[order]}
                      onChange={(e) => setOrder(e.target.value)}
                    >
                      <SelectItem key="asc">{t("Oldest")}</SelectItem>
                      <SelectItem key="desc">{t("Latest")}</SelectItem>
                    </Select>
                    <Select
                      variant="bordered"
                      label={t("Price")}
                      selectedKeys={[maxPrice]}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    >
                      <SelectItem key={50}>{t("Below 50")}</SelectItem>
                      <SelectItem key={100}>{t("Below 100")}</SelectItem>
                      <SelectItem key={500}>{t("Below 500")}</SelectItem>
                      <SelectItem key={1000}>{t("Below 1000")}</SelectItem>
                    </Select>
                    <Select
                      variant="bordered"
                      label={t("Quantity")}
                      selectedKeys={[maxQuantity]}
                      onChange={(e) => setMaxQuantity(e.target.value)}
                    >
                      <SelectItem key={50}>{t("Below 5")}</SelectItem>
                      <SelectItem key={100}>{t("Below 10")}</SelectItem>
                      <SelectItem key={500}>{t("Below 50")}</SelectItem>
                      <SelectItem key={1000}>{t("Below 100")}</SelectItem>
                    </Select>
                    <Select
                      variant="bordered"
                      label={t("Condition")}
                      selectedKeys={[condition]}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      <SelectItem key={"new"}>{t("New")}</SelectItem>
                      <SelectItem key={"used"}>{t("Used")}</SelectItem>
                    </Select>
                    <Select
                      variant="bordered"
                      label={t("Status")}
                      selectedKeys={[status]}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <SelectItem key={"available"}>{t("Available")}</SelectItem>
                      <SelectItem key={"sold"}>{t("Sold")}</SelectItem>
                      <SelectItem key={"rented"}>{t("Rented")}</SelectItem>
                    </Select>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("Close")}
                </Button>
                <Button color="primary" onPress={onClose}>
                  {t("Apply")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="flex flex-wrap gap-4 py-4 items-center justify-center">
        {products &&
          products.map((product) => (
            <Card
              className="w-full md:w-[320px] md:h-[410px] lg:w-[420px] lg:h-[520px]"
              key={product.product_id}
            >
              <CardHeader className="flex-col items-start">
                <User
                  className="cursor-pointer"
                  name={product.user.name}
                  description={`${product.user.city}, ${product.user.state}`}
                  avatarProps={{
                    src: product.user.profile_pic,
                  }}
                  onClick={() =>
                    navigate(
                      `/profile/${
                        user?.user_id != product.user_id ? product.user_id : ""
                      }`
                    )
                  }
                />
                <h1 className="text-xl lg:text-2xl font-black p-3 pb-0">
                  {product.product_name}
                </h1>
                <Chip
                  color="warning"
                  variant="bordered"
                  className="absolute right-2 top-2 text-xs sm:text-sm"
                >
                  {t(product.status.charAt(0).toUpperCase() +
                    product.status.slice(1))}
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
                      {t(product.category.category_name)}
                    </Chip>
                    <Chip
                      color="warning"
                      variant="flat"
                      className="text-xs sm:text-sm"
                    >
                      {t(product.subcategory.subcategory_name)}
                    </Chip>
                    <Chip
                      color="warning"
                      variant="flat"
                      className="text-xs sm:text-sm"
                    >
                      {t(product.condition.charAt(0).toUpperCase() +
                        product.condition.slice(1))}
                    </Chip>
                  </div>
                </div>
              </CardBody>
              <Button
                size="sm"
                color="warning"
                auto
                className="absolute bottom-4 right-4"
                onClick={() => navigate(`/products/${product.product_id}`)}
              >
                {t("View")}
              </Button>
            </Card>
          ))}
      </div>
      <div className="flex flex-col w-full items-center gap-2 p-4">
        <Pagination
          total={totalPages}
          color="secondary"
          page={page}
          onChange={page}
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
          >
            {t("Previous")}
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            onPress={() =>
              setPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
          >
            {t("Next")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;
