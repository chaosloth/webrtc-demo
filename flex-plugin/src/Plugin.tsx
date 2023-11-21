import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";

const PLUGIN_NAME = "FlexWebRTCPatch";

export default class Plugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    /*
     * Conference calls need a From number in case of using PSTN
     * This adds a From number using the Task Attributes
     * Ref: FLEXUI-1625
     */
    Flex.Actions.addListener("beforeAcceptTask", (payload: any) => {
      if (Flex.TaskHelper.isCallTask(payload.task)) {
        const fromAttribute = payload.task.attributes.from;
        const clientTest = /[a-zA-Z]/;
        if (clientTest.test(fromAttribute)) {
          payload.conferenceOptions.from = fromAttribute;
        }
      }
    });
  }
}
