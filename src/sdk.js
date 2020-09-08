let value = null;

// Determine the unique frame identifier
const url = new URL(location.href);
const frameId = url.searchParams.get("fid");

// Automatically tell listeners about (possible) iframe dimensions
addEventListener(
  "resize",
  function onResize() {
    send({
      action: "resize",
      width: window.innerWidth,
      height: window.innerHeight,
    });
  },
  false
);

// Ping back to the initiator
send({
  action: "init",
});

// Talk to the parent frame
function send({ ...args }) {
  // Todo: set the appropriate origin
  const targetOrigin = "*";

  window.parent.postMessage(JSON.stringify({ frameId, ...args }), targetOrigin);
}

export const sdk = {
  context: {
    getLanguage() {
      return Promise.resolve("en");
    },
  },
  field: {
    getValue() {
      return Promise.resolve(
        JSON.parse(localStorage.getItem("editorValue") || "{}")
      );
    },
    setValue(v) {
      value = v;
      localStorage.setItem("editorValue", JSON.stringify(v));
      return Promise.resolve();
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
