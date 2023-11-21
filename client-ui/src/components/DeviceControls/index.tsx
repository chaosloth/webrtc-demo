"use client";
import {
  Option,
  Form,
  FormControl,
  Select,
  Button,
  Flex,
} from "@twilio-paste/core";
import { BuiltInIcon } from "@twilio-paste/icons/esm/BuiltInIcon";

import { FC, useEffect, useState } from "react";

export type DeviceControlsProps = {
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
};

const DeviceControls: FC<DeviceControlsProps> = (props) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {}, []);

  if (!expanded)
    return (
      <Flex hAlignContent={"right"}>
        <Button
          variant="secondary"
          size="circle"
          onClick={() => setExpanded(!expanded)}
        >
          <BuiltInIcon decorative />
        </Button>
      </Flex>
    );

  return (
    <Form>
      <FormControl>
        <Select placeholder="Choose microphone">
          {props.audioInputDevices ? (
            props.audioInputDevices.map((audioInput: MediaDeviceInfo) => (
              <Option key={audioInput.deviceId} value={audioInput.deviceId}>
                {audioInput.label}
              </Option>
            ))
          ) : (
            <Option key="no-mic-permission" value="no-mic-permission">
              Microphone permissions have not been granted in the browser
            </Option>
          )}
        </Select>
      </FormControl>

      <FormControl>
        <Select placeholder="Choose output">
          {props.audioOutputDevices ? (
            props.audioOutputDevices.map((audioOutput: MediaDeviceInfo) => (
              <Option key={audioOutput.deviceId} value={audioOutput.deviceId}>
                {audioOutput.label}
              </Option>
            ))
          ) : (
            <Option key="no-mic-permission" value="no-mic-permission">
              Speaker permissions have not been granted in the browser
            </Option>
          )}
        </Select>
      </FormControl>

      <Button variant="primary" onClick={() => setExpanded(!expanded)}>
        Save
      </Button>
    </Form>
  );
};

export default DeviceControls;
