import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories, getSubCategories } from "../services/categories";
import { editProduct, getProduct, uploadMedia } from "../services/products";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import NotFound from "./NotFound";
import EditMediaCarousel from "../components/EditMediaCarousel";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const EditProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm();

  const {
    register: registerFile,
    handleSubmit: handleSubmitFile,
    formState: { errors: errorsFile },
  } = useForm();

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const categoryValue = watch("category_id");
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchProduct = async (id) => {
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct(id);
  }, [id]);

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
    fetchSubCategories(categoryValue);
  }, [categoryValue]);

  const onSubmit = async (values) => {
    try {
      const data = await editProduct(product.product_id, values);
      navigate("/");
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmitFile = async (values) => {
    try {
      console.log(values.file[0]);
      const formData = new FormData();
      formData.append("file", values.file[0]);
      await uploadMedia(product.product_id, formData);
      toast.success(t("File uploaded successfully."));
      fetchProduct(id);
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
          label={t("Loading...")}
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
    <div className="container">
      <h1 className="font-bold p-4 pl-10 text-xl">{t("Update Item Media")}</h1>
      <Button className="ml-10 mb-3" startContent={<Plus />} onPress={onOpen}>
        {t("Add Media")}
      </Button>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("Add Media")}
              </ModalHeader>
              <ModalBody>
                <form
                  encType="multipart/form-data"
                  onSubmit={handleSubmitFile(onSubmitFile)}
                >
                  <Input
                    autoFocus
                    label={t("Add an image or a video")}
                    type="file"
                    accept="image/*, video/*"
                    placeholder={t("Upload")}
                    variant="bordered"
                    {...registerFile("file", {
                      required: t("File is required"),
                    })}
                    isInvalid={!!errorsFile.file}
                    errorMessage={errorsFile.file?.message}
                  />
                  <ModalFooter>
                    <Button color="primary" type="submit">
                      {t("Add")}
                    </Button>
                    <Button color="danger" variant="light" onPress={onClose}>
                      {t("Cancel")}
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <EditMediaCarousel media={product?.media} />
      <div className="pb-6">
        <Card className="my-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 p-4"
            encType="multipart/form-data"
          >
            <h1 className="font-bold">{t("Update Item Details")}</h1>
            <Input
              autoFocus
              label={t("Name")}
              type="text"
              placeholder=""
              defaultValue={product.product_name}
              variant="bordered"
              {...register("product_name", {
                required: t("Name is required"),
              })}
              isInvalid={!!errors.product_name}
              errorMessage={errors.product_name?.message}
            />
            <Controller
              name="description" // Name of the form field
              control={control}
              defaultValue={product.description}
              rules={{
                required: t("Description is required"), // Validation rule
              }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label={t("Description")}
                  variant="bordered"
                  placeholder={t("Enter your description")}
                  disableAnimation
                  disableAutosize
                  classNames={{
                    input: "resize-y min-h-[40px]",
                  }}
                  isInvalid={!!errors.description} // Highlight error state
                  errorMessage={errors.description?.message} // Show error message
                />
              )}
            />
            <div className="flex gap-2">
              <Controller
                name="category_id"
                control={control}
                defaultValue={product.category_id}
                render={({ field }) => (
                  <Select
                    label={t("Select a category")}
                    variant="bordered"
                    placeholder=""
                    selectedKeys={
                      field.value ? new Set([String(field.value)]) : new Set()
                    }
                    onSelectionChange={(selected) => {
                      const selectedValue = Array.from(selected)[0];
                      field.onChange(Number(selectedValue));
                    }}
                  >
                    {categories.map((item) => (
                      <SelectItem key={item.category_id}>
                        {t(item.category_name)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                name="subcategory_id"
                control={control}
                defaultValue={product.subcategory_id}
                render={({ field }) => (
                  <Select
                    label={t("Select a subcategory")}
                    variant="bordered"
                    placeholder=""
                    selectedKeys={
                      field.value ? new Set([String(field.value)]) : new Set()
                    }
                    onSelectionChange={(selected) => {
                      const selectedValue = Array.from(selected)[0];
                      field.onChange(Number(selectedValue));
                    }}
                  >
                    {subcategories.map((item) => (
                      <SelectItem key={item.subcategory_id}>
                        {t(item.subcategory_name)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Input
                autoFocus
                label={t("Quantity")}
                type="number"
                placeholder=""
                defaultValue={product.quantity}
                variant="bordered"
                {...register("quantity", {
                  required: t("Quantity is required"),
                  valueAsNumber: true, // Converts input value to number
                  validate: (value) =>
                    value > 0 || t("Quantity must be greater than 0"),
                })}
                isInvalid={!!errors.quantity}
                errorMessage={errors.quantity?.message}
              />
              <Input
                autoFocus
                label={t("Unit")}
                type="text"
                placeholder=""
                defaultValue={product.unit}
                variant="bordered"
                {...register("unit", {
                  required: t("Unit is required"),
                })}
                isInvalid={!!errors.unit}
                errorMessage={errors.unit?.message}
              />
            </div>
            <Input
              autoFocus
              label={t("Price")}
              type="number"
              placeholder=""
              defaultValue={product.price}
              startContent="₹"
              variant="bordered"
              {...register("price", {
                required: t("Price is required"),
                valueAsNumber: true, // Converts input value to number
                validate: (value) =>
                  value > 0 || t("Price must be greater than 0"),
              })}
              isInvalid={!!errors.price}
              errorMessage={errors.price?.message}
            />
            <div className="flex gap-2">
              <Controller
                name="condition"
                defaultValue={product.condition}
                control={control}
                render={({ field }) => (
                  <Select
                    label={t("Condition")}
                    variant="bordered"
                    placeholder=""
                    selectedKeys={
                      field.value ? new Set([String(field.value)]) : new Set()
                    }
                    onSelectionChange={(selected) => {
                      const selectedValue = Array.from(selected)[0];
                      field.onChange(selectedValue);
                    }}
                  >
                    <SelectItem key="new">{t("New")}</SelectItem>
                    <SelectItem key="used">{t("Used")}</SelectItem>
                  </Select>
                )}
              />
              <Controller
                name="status"
                control={control}
                defaultValue={product.status}
                render={({ field }) => (
                  <Select
                    label={t("Status")}
                    variant="bordered"
                    placeholder=""
                    selectedKeys={
                      field.value ? new Set([String(field.value)]) : new Set()
                    }
                    onSelectionChange={(selected) => {
                      const selectedValue = Array.from(selected)[0];
                      field.onChange(selectedValue);
                    }}
                  >
                    <SelectItem key="available">{t("Available")}</SelectItem>
                    <SelectItem key="sold">{t("Sold")}</SelectItem>
                    <SelectItem key="rented">{t("Rented")}</SelectItem>
                  </Select>
                )}
              />
            </div>
            <div className="pt-5 justify-end flex gap-4">
              <Button color="primary" type="submit">
                {t("Save")}
              </Button>
              <Button
                color="danger"
                variant="light"
                onClick={() => navigate(-1)}
              >
                {t("Cancel")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
export default EditProduct;
