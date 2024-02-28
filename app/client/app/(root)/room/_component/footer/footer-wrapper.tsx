import { ReactNode } from "react";

const FooterWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="h-[10%] w-full">{children}</div>;
};

export default FooterWrapper;
