import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchConversation,
  sendMessageAsync,
} from "../redux/state/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import { getOtherProfile } from "../services/users";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Spinner,
  User,
} from "@nextui-org/react";
import { ArrowLeft, SendHorizontal } from "lucide-react";

const Conversation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [other, setOther] = useState();
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const { activeConversation, onlineUsers } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      await dispatch(fetchConversation(id));
    };
    loadMessages();
  }, [id, dispatch]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getOtherProfile(id);
        setOther(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // useEffect(() => {
  //   const markAllAsRead = () => {
  //     activeConversation?.conversation?.forEach((msg) => {
  //       if (!msg.is_read && msg.sender_id !== user.user_id) {
  //         handleMarkAsRead(msg.message_id);
  //       }
  //     });
  //   };

  //   markAllAsRead();
  // }, [activeConversation, user]);


  const getUserStatus = (id) => {
    const isPresent =
      onlineUsers.find((item) => parseInt(item) === id) !== undefined;
    return isPresent ? "Online" : "Offline";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp); // Convert timestamp to Date object
    const hours = date.getHours().toString().padStart(2, "0"); // Get hours, pad for 2 digits
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes, pad for 2 digits
    const day = date.getDate().toString().padStart(2, "0"); // Get day, pad for 2 digits
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month (0-indexed), pad
    return `${hours}:${minutes}, ${day}/${month}`; // Return formatted string
  };

  const handleSendMessage = async () => {
    try {     
      await dispatch(sendMessageAsync({
        receiver_id: other.user_id,
        content: value,
      }));
      setValue("")
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation]);

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
    <div className="container flex items-center justify-center overflow-hidden">
      <Card className="w-full h-[632px] max-h-full my-4 sm:mx-10">
        <CardHeader className="flex-col items-start gap-3">
          <div className="flex gap-4 items-center">
            <Button isIconOnly variant="flat" onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <User
              name={other.name}
              description={getUserStatus(other.user_id)}
              avatarProps={{
                src: other.profile_pic,
              }}
              className="cursor-pointer"
              onClick={() => navigate(`/profile/${other.user_id}`)}
            />
          </div>
          <Divider my={2} />
        </CardHeader>
        <CardBody className="gap-4">
          {activeConversation?.conversation?.map((msg) => (
            <div
              key={msg.message_id}
              className={` flex flex-col ${
                user.user_id === msg.sender_id ? "self-end" : ""
              }`}
            >
              <div
                className={`${
                  user.user_id === msg.sender_id
                    ? "bg-slate-300 self-end"
                    : "bg-slate-800 text-stone-50"
                } rounded-3xl py-3 px-4 fit-content`}
              >
                {msg.content}
              </div>
              <div
                className={`flex items-center gap-1 text-xs mx-4 mt-1 text-gray-600 ${
                  user.user_id === msg.sender_id ? "self-end" : ""
                }`}
              >
                {/* {user.user_id === msg.sender_id && (
                  <Check size={16} color={`${msg.is_read ? "blue" : "gray"}`} />
                )} */}
                <p>{formatTimestamp(msg.timestamp)}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardBody>
        <CardFooter className="gap-2">
          <Input
            label=""
            isClearable
            placeholder="Type a message..."
            variant="bordered"
            value={value}
            onValueChange={setValue}
          />
          <Button
            isIconOnly
            variant="bordered"
            color="primary"
            onClick={handleSendMessage}
          >
            <SendHorizontal />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default Conversation;
