import Image from "next/image";

import { Mail, Telephone } from "@/components/svg";
import LogoImage from "@/public/images/logo-white.webp";

const HELPLINE_PHONE = "+88 011020202505";
const HELPLINE_EMAIL = "support@akij.work";

export function Footer() {
  const phoneHref = `tel:${HELPLINE_PHONE.replaceAll(/\s/g, "")}`;

  return (
    <footer className="w-full bg-[#130B2C] py-6 text-white">
      <div className="container-wrapper flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xl leading-[130%] font-normal text-white">
            Powered by
          </p>
          <Image src={LogoImage} alt="AKIJ RESOURCE" width={116} height={32} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <p className="text-base leading-[150%] font-medium text-white">
            Helpline
          </p>
          <a
            className="inline-flex items-center gap-2 text-base leading-[150%] font-normal text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
            href={phoneHref}
          >
            <Telephone />
            <span>{HELPLINE_PHONE}</span>
          </a>
          <a
            className="inline-flex items-center gap-2 text-base leading-[150%] font-normal text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
            href={`mailto:${HELPLINE_EMAIL}`}
          >
            <Mail />
            <span>{HELPLINE_EMAIL}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
