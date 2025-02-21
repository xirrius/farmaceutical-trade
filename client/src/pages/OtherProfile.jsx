import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { MapPin, Send, Undo2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOtherProfile } from "../services/users";
import NotFound from "./NotFound";
import { getUserProducts } from "../services/products";
import UserProductsCarousel from "../components/UserProductsCarousel";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const OtherProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getOtherProfile(id);
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getUserProducts(id);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

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

  if (!profile) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex justify-center container">
      <div className="w-full p-3 md:p-6  rounded-lg flex flex-col md:flex-row md:gap-16 justify-between">
        <div className="flex flex-col items-center md:items-baseline w-full md:w-[40%] border-b-1 md:border-0">
          <img
            src={
              profile.profile_pic ||
              `https://ui-avatars.com/api/?name=${profile.name}`
            }
            alt="Profile"
            className="w-96 h-96 md:w-48 md:h-48 lg:w-72 lg:h-72 xl:w-96 xl:h-96 rounded-lg mb-4 border-gray-400 border-1 object-cover"
          />
          <h1 className="text-2xl font-semibold mb-1">{profile.name}</h1>
          <p className="text-gray-500 mb-6">
            {t("User ID:")} {profile.user_id}
          </p>

          <div className="mb-3 text-center md:text-left">
            <p className="text-sm text-gray-400">{t("Created")}</p>
            <p className="font-medium text-gray-500">
              {new Date(profile.created_at).toLocaleDateString()} -{" "}
              {new Date(profile.created_at).toLocaleTimeString()}
            </p>
          </div>

          <div className="mb-3 text-center md:text-left">
            <p className="text-sm text-gray-400">{t("Last Updated")}</p>
            <p className="font-medium text-gray-500">
              {new Date(profile.updated_at).toLocaleDateString()} -{" "}
              {new Date(profile.updated_at).toLocaleTimeString()}
            </p>
          </div>

          <Button
            className="my-4"
            variant="flat"
            color="secondary"
            onClick={() => {
              if (!isAuthenticated) {
                onOpen();
                return;
              }
              navigate(`/conversations/${profile.user_id}`);
            }}
            endContent={<Send />}
          >
            {t("Send a message")}
          </Button>
          <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {t("Wait a minute!")}
                  </ModalHeader>
                  <ModalBody>{t("You need to sign in to continue.")}</ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      {t("Go Back")}
                    </Button>
                    <Button color="primary" onPress={() => navigate("/login")}>
                      {t("Sign In")}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

        <div className="text-left space-y-4 w-full md:w-[60%]">
          <h1 className="font-black text-3xl md:text-6xl py-3">
            {profile.name}
          </h1>
          <div className="flex items-center gap-5">
            <MapPin></MapPin>
            <span className="text-gray-600">
              {profile.city}
              {", "}
              {profile.state}
            </span>
          </div>

          <div className="space-y-4 py-4">
            <h1 className="text-lg font-semibold">
              {t("Contact Information")}
            </h1>
            <div className="flex gap-3 items-center">
              <p className="text-sm text-gray-400 w-32">{t("Email")}</p>
              <p className="text font-medium text-blue-500">{profile.email}</p>
            </div>

            <div className="flex gap-3 items-center">
              <p className="text-sm text-gray-400 w-32">{t("Address")}</p>
              <p className="text font-medium">{profile.address}</p>
            </div>

            <div className="flex gap-3 items-center">
              <p className="text-sm text-gray-400 w-32">{t("Contact Info")}</p>
              <p className="text font-medium text-blue-500">
                {profile.contact_info}
              </p>
            </div>
          </div>

          <div className="pb-8 pt-4 border-y-1">
            <h1 className="pb-4 font-bold">{t("Listings")}</h1>
            <div className=" flex flex-wrap gap-2">
              {products ? (
                <UserProductsCarousel userProducts={products} />
              ) : (
                <p className="text-gray-600">{t("No Listings")}</p>
              )}
            </div>
          </div>
          <Button
            color="danger"
            className="w-32 md:w-64"
            onClick={() => navigate(-1)}
            startContent={<Undo2 />}
          >
            {t("Go Back")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtherProfile;
