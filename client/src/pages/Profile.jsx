import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UpdateProfile from "../components/UpdateProfile";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center container">
      <div className="w-full p-3 md:p-6  rounded-lg flex flex-col md:flex-row md:gap-16 justify-between">
        <div className="flex flex-col items-center md:items-baseline w-full md:w-[40%] border-b-1 md:border-0">
          <img
            src={
              user.profile_pic ||
              `https://ui-avatars.com/api/?name=${user.name}`
            }
            alt="Profile"
            className="w-96 h-96 md:w-48 md:h-48 lg:w-72 lg:h-72 xl:w-96 xl:h-96 rounded-lg mb-4 border-gray-400 border-1 object-cover"
          />
          <h1 className="text-2xl font-semibold mb-1">{user.name}</h1>
          <p className="text-gray-500 mb-6">User ID: {user.user_id}</p>

          <div className="mb-3 text-center md:text-left">
            <p className="text-sm text-gray-400">Created</p>
            <p className="font-medium text-gray-500">
              {new Date(user.created_at).toLocaleDateString()} -{" "}
              {new Date(user.created_at).toLocaleTimeString()}
            </p>
          </div>

          <div className="mb-3 text-center md:text-left">
            <p className="text-sm text-gray-400">Last Updated</p>
            <p className="font-medium text-gray-500">
              {new Date(user.updated_at).toLocaleDateString()} -{" "}
              {new Date(user.updated_at).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="text-left space-y-4 w-full md:w-[60%]">
          <h1 className="font-black text-3xl md:text-6xl py-3">{user.name}</h1>
          <div className="flex items-center gap-5">
            <MapPin></MapPin>
            <span className="text-gray-600">
              {user.city}
              {", "}
              {user.state}
            </span>
          </div>

          <div></div>

          <div className="space-y-4 py-4">
            <h1 className="text-lg font-semibold">Contact Information</h1>
            <div className="flex gap-3 items-center">
              <p className="text-sm text-gray-400 w-32">Email</p>
              <p className="text font-medium text-blue-500">{user.email}</p>
            </div>

            <div className="flex gap-3 items-center">
              <p className="text-sm text-gray-400 w-32">Address</p>
              <p className="text font-medium">{user.address}</p>
            </div>

            <div className="flex gap-3 items-center">
              <p className="text-sm text-gray-400 w-32">Contact Info</p>
              <p className="text font-medium text-blue-500">
                {user.contact_info}
              </p>
            </div>
          </div>

          <Button color="secondary" className="w-32 md:w-64" onPress={onOpen}>
            Update Profile
          </Button>

          <div className="pb-8 pt-4 border-y-1">
            <h1 className="pb-4 font-bold">Other Options</h1>
            <div className=" flex flex-wrap gap-2">
              <Button
                color="secondary"
                className=" w-32 md:w-64"
                onClick={() => navigate("/products/my")}
              >
                View Listings
              </Button>
              <Button
                color="secondary"
                className=" w-32 md:w-64"
                onClick={() => navigate("/transactions/")}
              >
                View Transactions
              </Button>
              <Button
                color="secondary"
                className="w-32 md:w-64"
                onClick={() => navigate("/rentals/")}
              >
                View Rentals
              </Button>
            </div>
          </div>
          <Button
            color="danger"
            className="w-32 md:w-64"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Profile
              </ModalHeader>
              <ModalBody>
                <UpdateProfile onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;