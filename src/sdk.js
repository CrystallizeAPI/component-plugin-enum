let value = null;

// Determine the unique frame identifier
const url = new URL(location.href);
const frameId = url.searchParams.get("fid");

// Todo: set the appropriate origin?
let targetOrigin = "*";
try {
  const referrerUrl = new URL(document.referrer);
  targetOrigin = referrerUrl.origin;
} catch (e) {}

function onResize() {
  send({
    action: "resize",
    width: document.body.offsetWidth,
    height: document.body.offsetHeight,
  });
}

// Automatically tell listeners about (possible) iframe dimensions
addEventListener("resize", onResize, false);

// Talk to the parent frame
function send(args) {
  window.parent.postMessage(JSON.stringify({ frameId, ...args }), targetOrigin);
}

// Listen for incoming messages
window.addEventListener(
  "message",
  function onMessage(ev) {
    try {
      const payload = JSON.parse(ev.data);
      if (payload.frameId === frameId) {
        const { messageId, ...data } = payload;
        const listenerIndex = listeningQueue.findIndex(
          (l) => l.messageId === messageId
        );
        if (listenerIndex !== -1) {
          const [listener] = listeningQueue.splice(listenerIndex, 1);
          listener.callback(data);
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
  false
);

let messageIdIncr = 0;
const listeningQueue = [];
function sendAndWaitForResponse(args) {
  return new Promise((r) => {
    const messageId = messageIdIncr++;

    listeningQueue.push({
      messageId,
      callback: r,
    });

    send({
      messageId,
      ...args,
    });
  });
}

export const sdk = {
  layout: {
    resize: onResize,
  },
  context: {
    getLanguage() {
      return Promise.resolve("en");
    },
  },
  field: {
    async getValue() {
      const { value } = await sendAndWaitForResponse({
        action: "field.getValue",
      });
      return value;
    },
    setValue(value) {
      send({ action: "field.setValue", value });
    },
    componentConfig() {
      return sdk.componentConfig.getValue();
    },
  },
  componentConfig: {
    setValue(config) {
      localStorage.setItem("componentConfig", JSON.stringify(config));
    },
    getValue() {
      return JSON.parse(localStorage.getItem("componentConfig") || "{}");
    },
  },
};
