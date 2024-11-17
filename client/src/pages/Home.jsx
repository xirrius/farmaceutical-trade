import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { FileClock, Notebook, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div>
        <div className="relative">
          <video
            src="./hero.mp4"
            autoPlay
            loop
            className="w-full h-[600px] object-cover"
          >
            <source src="./hero.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute top-0 w-full h-full text-white p-5 pl-12 flex items-center"
            style={{
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.9544159544159544) 1%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-5xl leading-tight tracking-wider italic md:max-w-[70%]">
                Empowering Farmers with Seamless Trade Solutions!
              </h1>
              <p className="tracking-widest">
                Buy, sell, and rent agricultural assets with ease.
              </p>
              <div className="ml-5 flex gap-12 mt-5">
                <Button
                  variant="shadow"
                  color="danger"
                  onClick={() => navigate("/products")}
                >
                  Browse Marketplace
                </Button>
                <Button
                  variant="ghost"
                  color="warning"
                  onClick={() => navigate("/register")}
                >
                  Sign Up Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-14">
          <h1 className="text-3xl mb-5 leading-tight tracking-wider">
            What We Offer
          </h1>
          <div className="flex flex-wrap gap-4 items-center justify-center py-6">
            <Card className="p-8 w-96 h-[320px]">
              <CardHeader className="p-4 flex-col items-center">
                <Store size={64} />
              </CardHeader>
              <CardBody className="text-center overflow-visible py-2 items-center gap-2">
                <h4 className="font-semibold tracking-wide text-large">
                  Marketplace with Personalized Filters
                </h4>
                <p className="text-gray-400 tracking-wide">
                  Browse a wide variety of agricultural assets and filter
                  products based on your needs such as price, category, and
                  availability.
                </p>
              </CardBody>
            </Card>
            <Card className="p-8 w-96 h-[320px]">
              <CardHeader className="p-4 flex-col items-center">
                <FileClock size={64} />
              </CardHeader>
              <CardBody className="overflow-visible py-2 text-center items-center gap-2">
                <h4 className="font-semibold tracking-wide text-large">
                  Activity Log
                </h4>
                <p className="text-gray-400 tracking-wide">
                  Keep track of your buying, selling, and rental activities in
                  one place.
                </p>
              </CardBody>
            </Card>
            <Card className="p-8 w-96 h-[320px]">
              <CardHeader className="p-4 flex-col items-center">
                <Notebook size={64} />
              </CardHeader>
              <CardBody className="overflow-visible py-2 items-center gap-2 text-center">
                <h4 className="font-semibold tracking-wide text-large">
                  Rental Logs
                </h4>
                <p className="text-gray-400 tracking-wide">
                  Simplify renting with detailed logs and status tracking.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="mt-16 relative">
          <img
            src="./cta.jpg"
            alt=""
            className="w-full h-[400px] object-cover"
          />
          <div
            className="absolute top-0 w-full h-full text-white p-5 pl-12 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-5xl leading-tight tracking-wider italic text-center">
                Start Trading Smarter Today!
              </h1>
              <div className="flex gap-12 mt-5 justify-center">
                <Button
                  variant="shadow"
                  color="success"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  variant="shadow"
                  color="warning"
                  onClick={() => navigate("/register")}
                >
                  Get Started
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
