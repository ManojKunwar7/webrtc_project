import { ModeToggle } from "@/components/ui/mode-toggle";
import { Favorite } from "@mui/icons-material";
import { ReactNode } from "react";
import CallNotify from "./(home)/_components/call-notify/call-notify";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full p-2">
      <div className="flex items-center justify-between h-[5%]">
        <h1 className="text-2xl">Video Chat App</h1>
        <ModeToggle />
      </div>
      <div className="w-full h-[90%]">{children}</div>
      <div className="flex items-center justify-between h-[5%]">
        <h5>@Copyright by manoj</h5>
        <p>
          Made with love <Favorite color="error" />
        </p>
      </div>
      <CallNotify />
    </div>
  );
};
export default AppLayout;
