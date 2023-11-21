"use client";

import { CustomizationProvider } from "@twilio-paste/core/customization";
import CenterLayout from "@/components/CenterLayout";
import MainWidget from "@/components/MainWidget";

import DialPad from "@/components/DialPad";
import VoiceService from "@/services/VoiceService";
import { useEffect, useState } from "react";
import { Phase } from "@/types/Phases";
import { Alert, Button } from "@twilio-paste/core";

import { Call, Device } from "@twilio/voice-sdk";
import CallControls from "@/components/CallControls";

export default function Home() {
  const [device, setDevice] = useState<Device>();
  const [call, setCall] = useState<Call>();

  const [isMuted, setMuted] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("Loading...");
  const [isMainButtonEnabled, setMainButtonEnabled] = useState<boolean>(false);
  const [phase, setPhase] = useState<Phase>(Phase.Initializing);
  const [hasPermissionError, setPermissionError] = useState(false);

  useEffect(() => {
    console.log("**I should fire once**");
  }, []);

  useEffect(() => {
    console.log("Init Voice Service");
    setStatusText("Initializing");
    VoiceService.init("demo").then((device) => {
      console.log("Init Voice Service - Done");
      setDevice(device);
      registerDeviceHandlers(device);
      device.register();
      setPhase(Phase.Ready);
    });
  }, []);

  useEffect(() => {
    console.log(`Current Phase: ${[phase]}`);
    switch (phase) {
      case Phase.Initializing:
        setMainButtonEnabled(false);

      case Phase.Ready:
        setStatusText("Tap to call");
        setMainButtonEnabled(true);
        break;

      case Phase.Dialling:
        setStatusText("Dialling...");
        break;

      case Phase.Accepted:
      case Phase.RemoteAudio:
        console.log("Have remote audio");
        setStatusText("Connected");
        break;
    }
  }, [phase]);

  const handleOnMainPress = () => {
    console.log("Main button press, current phase:", phase);

    switch (phase) {
      case Phase.Initializing:
        console.log("Press during init");
        break;
      case Phase.Ready:
        console.log("Press during ready");
        if (device) {
          device.connect().then((call) => {
            registerCallHandler(call);
            setCall(call);
          });
        }
        setPhase(Phase.Dialling);
        break;

      case Phase.Accepted:
      case Phase.Ringing:
      case Phase.RemoteAudio:
      case Phase.Dialling:
        console.log("Disconnecting");
        call?.disconnect();
        break;
    }
  };

  const registerDeviceHandlers = (device: Device) => {
    device.on("error", function (error) {
      console.log("Twilio.Device Error: " + error.message);
    });

    device.on("registered", function () {
      console.log("Device registered");
      setPhase(Phase.Ready);
    });
  };

  const registerCallHandler = (call: Call) => {
    call.on("error", (e: any) => {
      if (31401 === e.code) setPermissionError(true);

      console.log("Call error", e);
      if (e) console.log(JSON.stringify(e));
      handleDisconnectedIncomingCall(e);
    });
    call.on("accept", (call) => {
      setCall(call);
      setPhase(Phase.Accepted);
    });
    call.on("ringing", (hasEarlyMedia) => {
      console.log("Has early media: ", hasEarlyMedia);
      setPhase(Phase.Ringing);
    });
    call.on("audio", () => setPhase(Phase.RemoteAudio));
    call.on("mute", (isMute, call) => {
      console.log("Call mute status now:", isMute);
      setMuted(isMute);
    });
    call.on("cancel", handleDisconnectedIncomingCall);
    call.on("disconnect", handleDisconnectedIncomingCall);
    call.on("reject", handleDisconnectedIncomingCall);
    call.on("warning", (name, data) => {
      console.warn(name, data);
    });
  };

  const handleDisconnectedIncomingCall = (payload: any) => {
    setPhase(Phase.Ready);
    setStatusText("Disconnected");
    console.log("handleDisconnectedIncomingCall called", payload);
  };

  const handleMutePress = () => {
    console.log("Mute pressed");
    if (call) {
      call.mute(!isMuted);
      console.log("Muting call", call);
    }
  };

  return (
    <CustomizationProvider baseTheme="dark">
      <CenterLayout>
        {hasPermissionError && (
          <Alert variant="error">
            <strong>Opps </strong>Microphone access is required. Please try
            again{" "}
            <Button variant="link" onClick={() => window.location.reload()}>
              Click here reload
            </Button>
          </Alert>
        )}
        <DialPad subheader={"Real calls over the net"} identity={phase}>
          <MainWidget
            enabled={isMainButtonEnabled}
            status={statusText}
            handlePress={handleOnMainPress}
          />

          <CallControls
            isMuted={isMuted}
            onMutePress={handleMutePress}
            isEnabled={phase === Phase.Accepted || phase === Phase.RemoteAudio}
          />
        </DialPad>
      </CenterLayout>
    </CustomizationProvider>
  );
}
