"use client";

import { CustomizationProvider } from "@twilio-paste/core/customization";
import CenterLayout from "@/components/CenterLayout";
import MainWidget from "@/components/MainWidget";
import DeviceControls from "@/components/DeviceControls";
import DialPad from "@/components/DialPad";
import VoiceService from "@/services/VoiceService";
import { useEffect, useState } from "react";
import { Phase } from "@/types/Phases";
import { useUserMedia } from "../services/useUserMedia";
import { Alert, Button } from "@twilio-paste/core";
import useDevices from "@/services/useDevices";
import { Call, Device } from "@twilio/voice-sdk";
import CallControls from "@/components/CallControls";

export default function Home() {
  const [device, setDevice] = useState<Device>();
  const [call, setCall] = useState<Call>();

  const [isMute, setMute] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("Loading...");
  const [isMainButtonEnabled, setMainButtonEnabled] = useState<boolean>(true);
  const { stream, error } = useUserMedia({ audio: true, video: false });
  const [phase, setPhase] = useState<Phase>(Phase.Initializing);
  const { audioInputDevices, audioOutputDevices } = useDevices({
    camera: false,
    microphone: true,
  });

  const [speakerDevices, setSpeakerDevices] = useState<Set<MediaDeviceInfo>>();
  const [ringtoneDevices, setRingtoneDevices] =
    useState<Set<MediaDeviceInfo>>();

  useEffect(() => {
    console.log(`Current Phase: ${[phase]}`);
    switch (phase) {
      case Phase.Initializing:
        setMainButtonEnabled(false);
        console.log("Init Voice Service");
        VoiceService.init("demo").then((device) => {
          console.log("Init Voice Service - Done");
          setStatusText("Press me");
          setPhase(Phase.Ready);
          setDevice(device);
          registerDeviceHandlers(device);
          device.register();
        });

      case Phase.Ready:
        setMainButtonEnabled(true);
        break;

      case Phase.Dialling:
        setStatusText("Dialling...");
        break;

      case Phase.RemoteAudio:
        console.log("Have remote audio");
        setStatusText("Connected");
        break;
    }
  }, [phase]);

  const handleOnMainPress = () => {
    console.log("Main button press");

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

      case Phase.RemoteAudio:
      case Phase.Dialling:
        console.log("Disconnecting");
        call?.disconnect();
        break;
    }
  };

  const updateAllAudioDevices = () => {
    if (device && device.audio) {
      setSpeakerDevices(device.audio.speakerDevices?.get());
      setRingtoneDevices(device.audio.ringtoneDevices?.get());
    }
  };

  const registerDeviceHandlers = (device: Device) => {
    device.on("error", function (error) {
      console.log("Twilio.Device Error: " + error.message);
    });

    device.on("registered", function () {
      console.log("Device registered");
      setStatusText("Tap to call");
      setPhase(Phase.Ready);
    });

    if (device.audio) {
      device.audio.on("deviceChange", updateAllAudioDevices.bind(device));
    }
  };

  const registerCallHandler = (call: Call) => {
    call.on("error", (e: any) => {
      console.log("Call error", e);
      handleDisconnectedIncomingCall(e);
    });
    call.on("ringing", () => setPhase(Phase.Ringing));
    call.on("audio", () => setPhase(Phase.RemoteAudio));
    call.on("mute", (isMute, call) => {
      console.log("Call mute status now:", isMute);
      setMute(isMute);
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
      call.mute(!isMute);
      console.log("Muting call", call);
    }
  };

  return (
    <CustomizationProvider baseTheme="dark">
      <CenterLayout>
        {error && (
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
            isMuted={isMute}
            onMutePress={handleMutePress}
            isEnabled={phase === Phase.RemoteAudio}
          />
        </DialPad>
      </CenterLayout>
    </CustomizationProvider>
  );
}
