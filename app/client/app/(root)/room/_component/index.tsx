import FooterLayout from "./footer/footer";
import MainLayout from "./main/main";
import NotFound from "./not-found";
import RoomWrapper from "./wrapper";

const RoomIndex = ({ roomId }: { roomId: string }) => {
  return (
    <RoomWrapper>
      {!roomId ? (
        <NotFound />
      ) : (
        <>
          <MainLayout roomId={roomId} />
          <FooterLayout />
        </>
      )}
    </RoomWrapper>
  );
};

export default RoomIndex;
