import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
  User,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { getRentals } from "../services/rentals";

const Rentals = () => {
  const [rentals, setRentals] = useState();
  const [loading, setLoading] = useState(true);
  const [rentalType, setRentalType] = useState("renter");
  const [rentalStatus, setRentalStatus] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const params = {
          status: rentalStatus,
          type: rentalType,
        };
        console.log(params);
        const data = await getRentals(params);
        setRentals(data);
      } catch (error) {
        console.error(error);
        setRentals();
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, [rentalStatus, rentalType]);

  const getRentalStatus = (endDate) => {
    // Convert ISO 8601 strings to Date objects
    const end = new Date(endDate);

    // Get the current date
    const today = new Date();

    // Calculate the difference in days
    const dayDifference = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    // Determine the status message
    return dayDifference > 0
      ? `${dayDifference} days remaining`
      : `${Math.abs(dayDifference)} days overdue`;
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

  return (
    <div className="container min-h-screen">
      <h1 className="text-xl font-bold p-4">Rental Log</h1>
      <Tabs
        aria-label="Options"
        selectedKey={rentalType}
        onSelectionChange={setRentalType}
      >
        <Tab key="renter" title="Renter">
          <Card className="w-full">
            <CardHeader className="p-2 flex gap-2">
              <Select
                variant="bordered"
                label=""
                selectedKeys={[rentalStatus]}
                className="max-w-48"
                onChange={(e) => setRentalStatus(e.target.value)}
              >
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="returned">Returned</SelectItem>
                <SelectItem key="overdue">Overdue</SelectItem>
              </Select>
            </CardHeader>
            {rentals ? (
              <CardBody className="flex flex-col gap-4 w-full p-4">
                {rentals.map((item) => (
                  <div key={item.rental_id} className="">
                    <Divider y={4} />
                    <div className="mt-4 flex justify-between items-start">
                      <h1 className="text-xl">{item.product.product_name}</h1>
                      <p className="text-xs text-gray-700">
                        Last Updated:{" "}
                        {new Date(item.updated_at).toLocaleTimeString()},{" "}
                        {new Date(item.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.status !== "returned"
                        ? getRentalStatus(item.rental_end_date)
                        : new Date(item.rental_end_date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-4 items-center text-sm text-gray-700 py-2">
                      <p>Owner:</p>
                      <User
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(`/profile/${item.otherParty.user_id}`)
                        }
                        name={item.otherParty.name}
                        description={`${item.otherParty.city}, ${item.otherParty.state}`}
                        avatarProps={{
                          src: item.otherParty.profile_pic,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-700 py-2">
                      <div className="flex gap-4 items-center text-sm text-gray-700">
                        <p>Status: </p>
                        <Chip
                          variant="bordered"
                          color={
                            item.status === "returned"
                              ? `success`
                              : item.status === "overdue"
                              ? `danger`
                              : `warning`
                          }
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Chip>
                      </div>
                      <Button
                        color="primary"
                        onClick={() => navigate(`/rentals/${item.rental_id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardBody>
            ) : (
              <div className="flex items-center justify-center w-full h-96 text-xl font-semibold text-red-400">
                No rental entries to show.
              </div>
            )}
          </Card>
        </Tab>
        <Tab key="owner" title="Owner">
          <Card className="w-full">
            <CardHeader className="p-2 flex gap-2">
              <Select
                variant="bordered"
                label=""
                selectedKeys={[rentalStatus]}
                className="max-w-48"
                onChange={(e) => setRentalStatus(e.target.value)}
              >
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="returned">Returned</SelectItem>
                <SelectItem key="overdue">Overdue</SelectItem>
              </Select>
            </CardHeader>
            {rentals ? (
              <CardBody className="flex flex-col gap-4 w-full p-4">
                {rentals.map((item) => (
                  <div key={item.rental_id} className="">
                    <Divider y={4} />
                    <div className="mt-4 flex justify-between items-start">
                      <h1 className="text-xl">{item.product.product_name}</h1>
                      <p className="text-xs text-gray-700">
                        Last Updated:{" "}
                        {new Date(item.updated_at).toLocaleTimeString()},{" "}
                        {new Date(item.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.status !== "returned"
                        ? getRentalStatus(item.rental_end_date)
                        : new Date(item.rental_end_date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-4 items-center text-sm text-gray-700 py-2">
                      <p>Renter:</p>
                      <User
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(`/profile/${item.otherParty.user_id}`)
                        }
                        name={item.otherParty.name}
                        description={`${item.otherParty.city}, ${item.otherParty.state}`}
                        avatarProps={{
                          src: item.otherParty.profile_pic,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-700 py-2">
                      <div className="flex gap-4 items-center text-sm text-gray-700">
                        <p>Status: </p>
                        <Chip
                          variant="bordered"
                          color={
                            item.status === "returned"
                              ? `success`
                              : item.status === "overdue"
                              ? `danger`
                              : `warning`
                          }
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Chip>
                      </div>
                      <Button
                        color="primary"
                        onClick={() => navigate(`/rentals/${item.rental_id}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardBody>
            ) : (
              <div className="flex items-center justify-center w-full h-96 text-xl font-semibold text-red-400">
                No activities to show.
              </div>
            )}
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};
export default Rentals;
