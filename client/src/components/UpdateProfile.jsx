import { Button, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { updateUser } from "../redux/state/authSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const UpdateProfile = ({onClose}) => {
  const {user} = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();
    async function onSubmit(values) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        if (key === "profile_pic") {
          formData.append(key, value[0]); // Access first file if `profile_pic` is a FileList
        } else {
          formData.append(key, value);
        }
      }
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]); // Check if the file is logged here
      }
      
      try {
        await dispatch(updateUser(formData))
        toast.success("Profile updated successfully.")
      } catch (error) {
        toast.error(`Error updating the user: ${error}`)
        console.log(error);
      }
    }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
        encType="multipart/form-data"
      >
        <Input
          autoFocus
          label="Name"
          type="text"
          placeholder=""
          variant="underlined"
          defaultValue={user?.name}
          {...register("name", {
            required: "Name is required",
          })}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
        <Input
          autoFocus
          label="Email Address"
          type="text"
          placeholder=""
          variant="underlined"
          defaultValue={user?.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
            onChange: () => trigger("email"),
          })}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Input
          autoFocus
          label="Contact "
          type="text"
          placeholder=""
          variant="underlined"
          defaultValue={user?.contact_info}
          {...register("contact_info", {
            required: "Contact is required",
          })}
          isInvalid={!!errors.contact_info}
          errorMessage={errors.contact_info?.message}
        />
        <Input
          autoFocus
          label="Address"
          type="text"
          placeholder=""
          variant="underlined"
          defaultValue={user?.address}
          {...register("address", {
            required: "Address is required",
          })}
          isInvalid={!!errors.address}
          errorMessage={errors.address?.message}
        />
        <Input
          autoFocus
          label="City"
          type="text"
          placeholder=""
          variant="underlined"
          defaultValue={user?.city}
          {...register("city", {
            required: "City is required",
          })}
          isInvalid={!!errors.city}
          errorMessage={errors.city?.message}
        />
        <Input
          autoFocus
          label="State"
          type="text"
          placeholder=""
          variant="underlined"
          defaultValue={user?.state}
          {...register("state", {
            required: "State is required",
          })}
          isInvalid={!!errors.state}
          errorMessage={errors.state?.message}
        />
        <Input
          autoFocus
          label="Profile Photo"
          type="file"
          accept="image/*"
          placeholder="Upload an image"
          variant="underlined"
          {...register("profile_pic", {
            required: "Profile picture is required",
          })}
          isInvalid={!!errors.profile_pic}
          errorMessage={errors.profile_pic?.message}
        />
        <div className="p-5 right-0 bottom-0 absolute flex gap-4">
          <Button color="primary" type="submit">
            Save
          </Button>
          <Button color="danger" onPress={onClose} variant="light">
            Close
          </Button>
        </div>
      </form>
    </>
  );
};
export default UpdateProfile;