import { sdk } from "../sdk.js";

const form = document.querySelector("form");

const config = {
  enums: ["", ""],
  multiple: false,
};

window.removeEnum = function (index) {
  config.enums.splice(index, 1);
  sdk.componentConfig.setValue(config);
  render();
};

window.addEnum = function () {
  config.enums.push("");
  sdk.componentConfig.setValue(config);
  render();
};

(function init() {
  const conf = sdk.componentConfig.getValue();

  if (conf?.enums) {
    config.enums = conf.enums;
    config.multiple = !!conf.multiple;
  }

  // Listen for any input change
  form.addEventListener("change", function onFormChange() {
    const formData = new FormData(form);

    config.multiple = formData.get("multiple") === "on";

    formData.getAll("enumValue").forEach((e, i) => (config.enums[i] = e));

    sdk.componentConfig.setValue(config);
    sdk.layout.resize();
  });

  render();
})();

function render() {
  form.innerHTML = `
    <div style="margin: 15px 0;">
      <label>
        Allow multiple
        <input type="checkbox" ${
          config.multiple && "checked"
        } name="multiple" />
      </label>
    </div>
    ${config.enums
      .map(
        (e, index) => `
        <div>
          <input value="${e}" name="enumValue" />
          <button type="button" onclick="removeEnum(${index})">-</button>
        </div>`
      )
      .join("")}
    <button type="button" onclick="addEnum()">+</button>
  `;
}
