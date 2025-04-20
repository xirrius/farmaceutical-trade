import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { FileClock, Notebook, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigate = useNavigate()
  const {t} = useTranslation()
  return (
    <div>
      <div className="pattern-bg">
        <div className="relative">
          <video
            src="./hero.mp4"
            autoPlay
            muted
            loop
            className="w-full h-[600px] object-cover"
          >
            <source src="./hero.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute top-0 w-full h-full text-white p-5 sm:pl-12 flex items-center"
            style={{
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.9544159544159544) 1%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-5xl leading-tight tracking-wider italic md:max-w-[70%]">
                {t("Empowering Farmers with Seamless Trade Solutions!")}
              </h1>
              <p className="tracking-widest">
                {t("Buy, sell, and rent agricultural assets with ease.")}
              </p>
              <div className="sm:ml-5 flex gap-8 sm:gap-12 mt-5">
                <Button
                  variant="shadow"
                  color="danger"
                  onClick={() => navigate("/products")}
                >
                  {t("Browse Marketplace")}
                </Button>
                <Button
                  variant="ghost"
                  color="warning"
                  onClick={() => navigate("/register")}
                >
                  {t("Sign Up Now")}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center my-20">
          <h1 className="text-3xl mb-5 leading-tight tracking-wider">
            {t("What We Offer")}
          </h1>
          <div className="flex flex-wrap gap-4 items-center justify-center py-6">
            <Card className="p-8 w-96 h-[320px]">
              <CardHeader className="p-4 flex-col items-center">
                <Store size={64} />
              </CardHeader>
              <CardBody className="text-center overflow-visible py-2 items-center gap-2">
                <h4 className="font-semibold tracking-wide text-large">
                  {t("Marketplace with Personalized Filters")}
                </h4>
                <p className="text-gray-400 tracking-wide">
                  {t(
                    "Browse a wide variety of agricultural assets and filter products based on your needs such as price, category, and availability."
                  )}
                </p>
              </CardBody>
            </Card>
            <Card className="p-8 w-96 h-[320px]">
              <CardHeader className="p-4 flex-col items-center">
                <FileClock size={64} />
              </CardHeader>
              <CardBody className="overflow-visible py-2 text-center items-center gap-2">
                <h4 className="font-semibold tracking-wide text-large">
                  {t("Activity Log")}
                </h4>
                <p className="text-gray-400 tracking-wide">
                  {t(
                    "Keep track of your buying, selling, and rental activities in one place."
                  )}
                </p>
              </CardBody>
            </Card>
            <Card className="p-8 w-96 h-[320px]">
              <CardHeader className="p-4 flex-col items-center">
                <Notebook size={64} />
              </CardHeader>
              <CardBody className="overflow-visible py-2 items-center gap-2 text-center">
                <h4 className="font-semibold tracking-wide text-large">
                  {t("Rental Logs")}
                </h4>
                <p className="text-gray-400 tracking-wide">
                  {t(
                    "Simplify renting with detailed logs and status tracking."
                  )}
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="bg-green-100 text-center py-12 px-4 rounded-xl mt-10 shadow md:mx-20 mx-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-green-800 mb-6">
            {t("Get Smart Medicine Recommendations for Crops & Animals")}
          </h2>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition" onClick={() => navigate("/predict")}>
              {t("Try the Model")}
            </button>
        </div>
        <div className="mt-24 relative">
          <img
            src="./cta.jpg"
            alt=""
            className="w-full h-[400px] object-cover"
          />
          <div
            className="absolute top-0 w-full h-full text-white p-5 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-5xl leading-tight tracking-wider italic text-center">
                {t("Start Trading Smarter Today!")}
              </h1>
              <div className="flex gap-8 sm:gap-12 mt-5 justify-center">
                <Button
                  variant="shadow"
                  color="success"
                  onClick={() => navigate("/login")}
                >
                  {t("Sign In")}
                </Button>
                <Button
                  variant="shadow"
                  color="warning"
                  onClick={() => navigate("/register")}
                >
                  {t("Get Started")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
