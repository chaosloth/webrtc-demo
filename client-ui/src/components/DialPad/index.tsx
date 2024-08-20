"use client";
import Image from "next/image";
import {
  Box,
  Card,
  Heading,
  Stack,
  StatusBadge,
  StatusBadgeVariants,
} from "@twilio-paste/core";
import { FC } from "react";
import logo from "../../../public/logo.svg";
import { Phase } from "@/types/Phases";

export type DialPadProps = {
  children?: React.ReactNode;
  subheader: string;
  phase: Phase;
};

const DialPad: FC<DialPadProps> = ({ subheader, phase, children }) => {
  const getPhaseBadge = (): StatusBadgeVariants => {
    switch (phase) {
      case Phase.Initializing:
        return "ConnectivityOffline";
      case Phase.Ready:
        return "ConnectivityAvailable";
      case Phase.Accepted:
        return "ProcessInProgress";
      default:
        return "ConnectivityNeutral";
    }
  };

  return (
    <Box
      style={{
        borderRadius: "8px",
        padding: "2px",
        background:
          "linear-gradient(90deg, rgba(89,255,0,1) 0%, rgba(3,159,255,1) 99%)",
      }}
    >
      <Card>
        <Stack orientation={"vertical"} spacing={"space40"}>
          <Box
            alignContent={"center"}
            justifyContent={"center"}
            display={"grid"}
          >
            {/* <Image src={logo} alt={"Twilio"} /> */}
            <div
              style={{
                background:
                  "linear-gradient(90deg, rgba(89,255,0,1) 0%, rgba(3,159,255,1) 99%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "transparent",
                WebkitTextFillColor: "transparent",
                fontSize: "3em",
                fontWeight: "bold",
                lineHeight: "1em",
              }}
            >
              {process.env.NEXT_PUBLIC_UI_TITLE || "Click to call"}
            </div>
          </Box>
          <Heading as={"div"} variant={"heading20"} marginBottom="space0">
            {process.env.NEXT_PUBLIC_UI_SUBTITLE || "Web RTC"}
          </Heading>
          {subheader && (
            <Heading as={"div"} variant={"heading40"} marginBottom="space0">
              {subheader}
            </Heading>
          )}
          {phase && (
            <Heading as={"div"} variant={"heading40"}>
              <StatusBadge variant={getPhaseBadge()} as={"span"}>
                {phase}
              </StatusBadge>
            </Heading>
          )}
          <Stack orientation={"vertical"} spacing={"space80"}>
            {children}
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export default DialPad;
