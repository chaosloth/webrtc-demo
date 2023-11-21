"use client";

import { Text, Box, Stack, Flex } from "@twilio-paste/core";
import { FC } from "react";

export type MainWidgetProps = {
  children?: React.ReactNode;
  enabled: boolean;
  handlePress: () => void;
  status: string;
  isOnCall: boolean;
  timer: number;
};

const MainWidget: FC<MainWidgetProps> = (props) => {
  const minutes = Math.floor(props.timer / 60);
  const seconds = props.timer - minutes * 60;

  const stringPadLeft = (value: number, pad: string, length: number) => {
    return (new Array(length + 1).join(pad) + value).slice(-length);
  };

  const finalTime =
    stringPadLeft(minutes, "0", 2) + ":" + stringPadLeft(seconds, "0", 2);

  return (
    <Box alignContent={"center"} justifyContent={"center"} display={"grid"}>
      <Box
        marginTop={"space40"}
        borderColor={"colorBorderDecorative10Weaker"}
        borderStyle={"solid"}
        borderWidth={"borderWidth30"}
        borderRadius={"borderRadiusCircle"}
        height={"200px"}
        width={"200px"}
        alignContent={"center"}
        justifyContent={"center"}
        display={"grid"}
        _hover={{ backgroundColor: "colorBackgroundBodyInverse" }}
        cursor={"pointer"}
        onClick={props.handlePress}
      >
        {props.isOnCall ? (
          <Box textAlign={"center"}>
            <Text
              as="p"
              fontSize={"fontSize70"}
              cursor="pointer"
              color={props.enabled ? "colorText" : "colorTextWeak"}
            >
              {finalTime}
            </Text>
            <Text
              marginTop={"space40"}
              as="p"
              fontSize={"fontSize30"}
              cursor="pointer"
              color={props.enabled ? "colorText" : "colorTextWeak"}
            >
              Tap to disconnect
            </Text>
          </Box>
        ) : (
          <Text
            as="span"
            fontSize={"fontSize70"}
            cursor="pointer"
            color={props.enabled ? "colorText" : "colorTextWeak"}
          >
            {props.status}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MainWidget;
