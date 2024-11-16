import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCategories, getSubCategories } from "../services/categories";
import { createProduct } from "../services/products";
import {toast} from "react-hot-toast"

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const categoryValue = watch("category_id");

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
    console.log(values);
    try {
      const data = await createProduct(values)
      navigate('/')
      toast.success(data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  return (
    <div className="container min-h-[700px]">
      <h1 className="text-xl font-bold p-4">Create An Item</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-4"
        encType="multipart/form-data"
      >
        <Input
          autoFocus
          label="Name"
          type="text"
          placeholder=""
          variant="bordered"
          {...register("product_name", {
            required: "Name is required",
          })}
          isInvalid={!!errors.product_name}
          errorMessage={errors.product_name?.message}
        />
        <Controller
          name="description" // Name of the form field
          control={control}
          defaultValue=""
          rules={{
            required: "Description is required", // Validation rule
          }}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Description"
              variant="bordered"
              placeholder="Enter your description"
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
            render={({ field }) => (
              <Select
                label="Select a category"
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
                    {item.category_name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name="subcategory_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Select a subcategory"
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
                    {item.subcategory_name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Input
            autoFocus
            label="Quantity"
            type="number"
            placeholder=""
            variant="bordered"
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true, // Converts input value to number
              validate: (value) =>
                value > 0 || "Quantity must be greater than 0",
            })}
            isInvalid={!!errors.quantity}
            errorMessage={errors.quantity?.message}
          />
          <Input
            autoFocus
            label="Unit"
            type="text"
            placeholder=""
            variant="bordered"
            {...register("unit", {
              required: "Unit is required",
            })}
            isInvalid={!!errors.unit}
            errorMessage={errors.unit?.message}
          />
        </div>
        <Input
          autoFocus
          label="Price"
          type="number"
          placeholder=""
          startContent="₹"
          variant="bordered"
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true, // Converts input value to number
            validate: (value) => value > 0 || "Price must be greater than 0",
          })}
          isInvalid={!!errors.price}
          errorMessage={errors.price?.message}
        />
        <div className="flex gap-2">
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select
                label="Condition"
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
                <SelectItem key="new">New</SelectItem>
                <SelectItem key="used">Used</SelectItem>
              </Select>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
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
                <SelectItem key="available">Available</SelectItem>
                <SelectItem key="sold">Sold</SelectItem>
                <SelectItem key="rented">Rented</SelectItem>
              </Select>
            )}
          />
        </div>
        <div className="p-5 right-0 bottom-0 absolute flex gap-4">
          <Button color="primary" type="submit">
            Create
          </Button>
          <Button color="danger" variant="light" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AddProduct;
