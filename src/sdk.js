let value = null;

// Automatically tell listeners about (possible) iframe dimensions
addEventListener(
  "resize",
  function onResize(event) {
    send({
      action: "frame-resize",
      width: window.innerWidth,
      height: window.innerHeight,
    });
  },
  false
);

// Mock send
function send({ action, ...rest }) {
  console.log(action, rest);
}

export const sdk = {
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
    getComponentConfig() {
      return Promise.resolve(
        JSON.parse(localStorage.getItem("componentConfig") || "{}")
      );
    },
  },
  componentConfig: {
    setValue(config) {
      localStorage.setItem("componentConfig", JSON.stringify(config));
    },
    getValue() {
      localStorage.getItem("componentConfig");
    },
  },
};
