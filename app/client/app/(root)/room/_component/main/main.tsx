import MainWrapper from "./main-wrapper";

const MainLayout = ({ roomId }: { roomId: string }) => {
  return (
    <MainWrapper>
      <div>Main Area</div>
      <div>
        Room id is {roomId}
      </div>
    </MainWrapper>
  );
};

export default MainLayout;
