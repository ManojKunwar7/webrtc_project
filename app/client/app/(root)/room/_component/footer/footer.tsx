import { Button } from "@/components/ui/button";
import FooterWrapper from "./footer-wrapper";
import { CallEnd } from "@mui/icons-material";
import Link from "next/link";

const FooterLayout = () => {
  return (
    <FooterWrapper>
      <div className="flex items-center justify-center">
        <Link href="/">
          <Button variant="destructive">
            <CallEnd />
          </Button>
        </Link>
      </div>
    </FooterWrapper>
  );
};

export default FooterLayout;
