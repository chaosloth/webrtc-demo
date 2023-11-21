"use client";

import { Button, ButtonGroup, Form } from "@twilio-paste/core";
import { FC } from "react";

export type CenterLayoutProps = {
  isEnabled: boolean;
  isMuted: boolean;
  onMutePress: () => void;
};

const CallControls: FC<CenterLayoutProps> = (props) => {
  return (
    <Form>
      <Button
        variant={props.isMuted ? "primary" : "destructive"}
        disabled={!props.isEnabled}
        onClick={props.onMutePress}
      >
        Press to {props.isMuted ? "unmute" : "mute"}
      </Button>
    </Form>
  );
};

export default CallControls;
