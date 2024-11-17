import { useEffect, useState } from "react";
import { getTransactions } from "../services/transactions";
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
import { useTranslation } from "react-i18next";

const Transactions = () => {
  const [transactions, setTransactions] = useState();
  const [loading, setLoading] = useState(true);
  const [transactionType, setTransactionType] = useState("buyer");
  const [transactionStatus, setTransactionStatus] = useState("pending");
  const [order, setOrder] = useState("desc");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const params = {
          status: transactionStatus,
          order,
          type: transactionType,
        };
        console.log(params);

        const data = await getTransactions(params);
        setTransactions(data);
      } catch (error) {
        console.error(error);
        setTransactions();
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [transactionStatus, order, transactionType]);

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

  return (
    <div className="container min-h-screen">
      <h1 className="text-xl font-bold p-4">{t("Activity Log")}</h1>
      <Tabs
        aria-label="Options"
        selectedKey={transactionType}
        onSelectionChange={setTransactionType}
      >
        <Tab key="buyer" title={t("Buy")}>
          <Card className="w-full">
            <CardHeader className="p-2 flex gap-2">
              <Select
                variant="bordered"
                label=""
                selectedKeys={[order]}
                className="max-w-48"
                onChange={(e) => setOrder(e.target.value)}
              >
                <SelectItem key="asc">{t("Oldest")}</SelectItem>
                <SelectItem key="desc">{t("Latest")}</SelectItem>
              </Select>
              <Select
                variant="bordered"
                label=""
                selectedKeys={[transactionStatus]}
                className="max-w-48"
                onChange={(e) => setTransactionStatus(e.target.value)}
              >
                <SelectItem key="pending">{t("Pending")}</SelectItem>
                <SelectItem key="completed">{t("Completed")}</SelectItem>
                <SelectItem key="cancelled">{t("Cancelled")}</SelectItem>
              </Select>
            </CardHeader>
            {transactions ? (
              <CardBody className="flex flex-col gap-4 w-full p-4">
                {transactions.map((item) => (
                  <div key={item.transaction_id} className="">
                    <Divider y={4} />
                    <div className="mt-4 flex justify-between items-start">
                      <h1 className="text-xl">{item.product.product_name}</h1>
                      <p className="text-xs text-gray-700">
                        {t("Last Updated:")}{" "}
                        {new Date(item.updated_at).toLocaleTimeString()},{" "}
                        {new Date(item.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {t("Date:")}{" "}
                      {new Date(item.transaction_date).toLocaleDateString()}
                    </div>
                    <div className=" flex gap-4 my-2">
                      <p>{t("Amount")}: ₹{item.price}</p>
                      <p>
                        {t("Quantity")}: {item.quantity} {item.product.unit}
                      </p>
                    </div>
                    <div className="flex gap-4 items-center text-sm text-gray-700 py-2">
                      <p>
                        {item.transaction_type === "rent"
                          ? t("Owner: ")
                          : t("Seller: ")}
                      </p>
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
                        <p>{t("Status")}: </p>
                        <Chip
                          variant="bordered"
                          color={
                            item.status === "completed"
                              ? `success`
                              : item.status === "cancelled"
                              ? `danger`
                              : `warning`
                          }
                        >
                          {t(item.status.charAt(0).toUpperCase() +
                            item.status.slice(1))}
                        </Chip>
                      </div>
                      <Button
                        color="primary"
                        onClick={() =>
                          navigate(`/transactions/${item.transaction_id}`)
                        }
                      >
                        {t("View")}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardBody>
            ) : (
              <div className="flex items-center justify-center w-full h-96 text-xl font-semibold text-red-400">
                {t("No activities to show.")}
              </div>
            )}
          </Card>
        </Tab>
        <Tab key="seller" title={t("Sell")}>
          <Card className="w-full">
            <CardHeader className="p-2 flex gap-2">
              <Select
                variant="bordered"
                label=""
                selectedKeys={[order]}
                className="max-w-48"
                onChange={(e) => setOrder(e.target.value)}
              >
                <SelectItem key="asc">{t("Oldest")}</SelectItem>
                <SelectItem key="desc">{t("Latest")}</SelectItem>
              </Select>
              <Select
                variant="bordered"
                label=""
                selectedKeys={[transactionStatus]}
                className="max-w-48"
                onChange={(e) => setTransactionStatus(e.target.value)}
              >
                <SelectItem key="pending">{t("Pending")}</SelectItem>
                <SelectItem key="completed">{t("Completed")}</SelectItem>
                <SelectItem key="cancelled">{t("Cancelled")}</SelectItem>
              </Select>
            </CardHeader>
            {transactions ? (
              <CardBody className="flex flex-col gap-4 w-full p-4">
                {transactions.map((item) => (
                  <div key={item.transaction_id} className="">
                    <Divider y={4} />
                    <div className="mt-4 flex justify-between items-start">
                      <h1 className="text-xl">{item.product.product_name}</h1>
                      <p className="text-xs text-gray-700">
                        {t("Last Updated:")}{" "}
                        {new Date(item.updated_at).toLocaleTimeString()},{" "}
                        {new Date(item.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {t("Date:")}{" "}
                      {new Date(item.transaction_date).toLocaleDateString()}
                    </div>
                    <div className=" flex gap-4 my-2">
                      <p>{t("Amount:")} ₹{item.price}</p>
                      <p>
                        {t("Quantity")}: {item.quantity} {item.product.unit}
                      </p>
                    </div>
                    <div className="flex gap-4 items-center text-sm text-gray-700 py-2">
                      <p>
                        {item.transaction_type === "rent"
                          ? t("Renter: ")
                          : t("Buyer: ")}
                      </p>
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
                        <p>{t("Status")}: </p>
                        <Chip
                          variant="bordered"
                          color={
                            item.status === "completed"
                              ? `success`
                              : item.status === "cancelled"
                              ? `danger`
                              : `warning`
                          }
                        >
                          {t(item.status.charAt(0).toUpperCase() +
                            item.status.slice(1))}
                        </Chip>
                      </div>
                      <Button
                        color="primary"
                        onClick={() =>
                          navigate(`/transactions/${item.transaction_id}`)
                        }
                      >
                        {t("View")}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardBody>
            ) : (
              <div className="flex items-center justify-center w-full h-96 text-xl font-semibold text-red-400">
                {t("No activities to show.")}
              </div>
            )}
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};
export default Transactions;
