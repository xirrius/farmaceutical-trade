import { useEffect, useState } from "react";
import { getAllConversations } from "../services/messages";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spinner,
  User,
} from "@nextui-org/react";
import { MessageSquareText, SquareArrowOutUpRight, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Conversations = () => {
  const [conversations, setConversations] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { onlineUsers } = useSelector((state) => state.messages);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getAllConversations();
        setConversations(data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const getUserStatus = (id) => {
    const isPresent =
      onlineUsers.find((item) => parseInt(item) === id) !== undefined;
    return isPresent ? "Online" : "Offline";
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

  if (!conversations) {
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center text-xl text-red-500">
        <p>You do not have any conversations going on at the moment...</p>
        <Button
          color="primary"
          className="w-32 md:w-64 mb-8"
          onClick={() => navigate(-1)}
          startContent={<Undo2 />}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center overflow-hidden">
      <Card className="w-full h-[568px] m-12">
        <CardHeader className="p-5 text-2xl font-bold">
          Conversations
        </CardHeader>
        <CardBody className="p-10 flex flex-col gap-8">
          {conversations &&
            conversations.map((itm) => (
              <div key={itm.user_id} className="flex flex-col gap-4">
                <Divider my={4} />
                <div className="flex justify-between">
                  <User
                    name={itm.name}
                    description={getUserStatus(itm.user_id)}
                    avatarProps={{
                      src: itm.profile_pic,
                    }}
                  />
                  <div className="flex gap-4">
                    <Button
                      isIconOnly
                      onClick={() => navigate(`/profile/${itm.user_id}`)}
                    >
                      <SquareArrowOutUpRight />
                    </Button>
                    <Button
                      isIconOnly
                      onClick={() => navigate(`/conversations/${itm.user_id}`)}
                    >
                      <MessageSquareText />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            className="m-4"
            onClick={() => navigate(-1)}
            startContent={<Undo2 />}
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default Conversations;
