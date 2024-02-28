import { ReactNode } from "react";

const MainWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="h-[90%]">{children}</div>;
};

export default MainWrapper;
