"use client";
import Image from "next/image";
import { Box, Card, Heading, Stack } from "@twilio-paste/core";
import { FC } from "react";
import logo from "../../../public/logo.svg";

export type DialPadProps = {
  children?: React.ReactNode;
  subheader: string;
  identity: string;
};

const DialPad: FC<DialPadProps> = ({ subheader, identity, children }) => {
  return (
    <Card>
      <Stack orientation={"vertical"} spacing={"space40"}>
        <Box alignContent={"center"} justifyContent={"center"} display={"grid"}>
          <Image src={logo} alt={"Twilio"} />
        </Box>
        <Heading as={"div"} variant={"heading10"} marginBottom="space0">
          Web RTC Demo
        </Heading>
        {subheader && (
          <Heading as={"div"} variant={"heading40"} marginBottom="space0">
            {subheader}
          </Heading>
        )}
        {identity && (
          <Heading as={"div"} variant={"heading40"}>
            {identity}
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
