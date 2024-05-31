"use client";
import {
  Box,
  Card,
  Heading,
  Stack,
  StatusBadge,
  StatusBadgeVariants,
} from "@twilio-paste/core";
import { FC } from "react";
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
    <Card>
      <Stack orientation={"vertical"} spacing={"space40"}>
        <Box alignContent={"center"} justifyContent={"center"} display={"grid"}>
          {/* <Image src={logo} alt={"Twilio"} /> */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #FF726D 5%, #FF4DA9 45%, #CD42D7 85%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "transparent",
              WebkitTextFillColor: "transparent",
              fontSize: "2.5em",
              fontWeight: "bold",
              lineHeight: "1em",
            }}
          >
            Voice Intelligence
          </div>
        </Box>
        <Heading as={"div"} variant={"heading20"} marginBottom="space0">
          Just even more awesome!
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
  );
};

export default DialPad;
