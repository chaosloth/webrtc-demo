import { Call, Device } from "@twilio/voice-sdk";

class VoiceService {
  device: Device | undefined = undefined;
  token: string = "";
  identity: string = "";

  async init(identity: string): Promise<Device> {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_OVERRIDE || ""}/api/token`,
        {
          method: "POST",
          body: JSON.stringify({ identity }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = await resp.json();

      this.device = new Device(token);
      this.device.updateOptions({
        logLevel: "DEBUG",
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        //region: "ie1",
        // edge: ['dublin', 'ashburn']
      });

      return this.device;
    } catch (error) {
      console.error("Error initializing VoiceService:", error);
      throw error;
    }
  }

  registerDevice(): void {
    if (this.device) this.device.register();
  }

  getToken(): string {
    return this.token;
  }

  getDevice(): Device | undefined {
    return this.device;
  }
}

const service = new VoiceService();

export default service;
