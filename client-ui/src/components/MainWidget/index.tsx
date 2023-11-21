"use client";

import { Text, Box } from "@twilio-paste/core";
import { FC } from "react";

export type MainWidgetProps = {
  children?: React.ReactNode;
  enabled: boolean;
  handlePress: () => void;
  status: string;
};

const MainWidget: FC<MainWidgetProps> = (props) => {
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
        <Text
          as="span"
          fontSize={"fontSize70"}
          cursor="pointer"
          color={props.enabled ? "colorText" : "colorTextWeak"}
        >
          {props.status}
        </Text>
      </Box>
    </Box>
  );
};

export default MainWidget;
