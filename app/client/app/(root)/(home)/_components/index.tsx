import CallComponent from "./call/call";
import JoinRoomComponent from "./join-room/join-room";

const Home = () => {
  return (
    <>
      <div className="h-[90%] p-2">
        <div className="flex flex-row gap-4 items-center justify-center h-full">
          <JoinRoomComponent />
          <CallComponent />
        </div>
      </div>
    </>
  );
};

export default Home;
