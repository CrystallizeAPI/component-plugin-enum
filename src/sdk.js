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
function send({ ...args }) {
  window.parent.postMessage(JSON.stringify({ frameId, ...args }), targetOrigin);
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
