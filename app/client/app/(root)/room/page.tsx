import RoomIndex from "./_component";

const RoomPage = ({
  searchParams,
  ...rest
}: {
  rest: any;
  searchParams: { id: string };
}) => {
  const { id } = searchParams;
  return <RoomIndex roomId={id} />;
};

export default RoomPage;
