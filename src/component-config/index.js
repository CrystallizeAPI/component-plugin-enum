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
  });

  render();
})();

function render() {
  form.innerHTML = `
    <div class="config-inner" style="margin: 15px 0;">
      <div class="">
        ${config.enums
          .map(
            (e, index) => `
        <div class="input-group">
          <input value="${e}" name="enumValue" class="input-group-field" />
          <button type="button" class="input-group-btn" onclick="removeEnum(${index})">-</button>
        </div>`
          )
          .join("")}
      </div>
      <div class="checkbox-group">  
      <label class="input-group-label" for="allowMultiple">
        Allow multiple
      </label>
      <input id="allowMultiple" type="checkbox" ${
        config.multiple && "checked"
      } name="multiple" />
    </div>
    </div>
    <button type="button" class="input-add" onclick="addEnum()">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.97432 5.67568L7.97432 6.02568L8.32432 6.02568L12.4865 6.02568C13.1291 6.02568 13.65 6.5466 13.65 7.18919C13.65 7.83178 13.1291 8.3527 12.4865 8.3527L8.32432 8.3527L7.97432 8.3527L7.97432 8.7027L7.97432 12.4865C7.97432 13.1291 7.4534 13.65 6.81081 13.65C6.16821 13.65 5.64729 13.1291 5.64729 12.4865L5.64729 8.7828L5.64729 8.4328L5.29729 8.4328L1.55356 8.4328C0.888855 8.4328 0.350001 7.89395 0.350001 7.22924C0.350001 6.56453 0.888853 6.02568 1.55356 6.02568L5.2973 6.02568L5.6473 6.02568L5.6473 5.67568L5.64729 1.51352C5.64729 0.870924 6.16821 0.35 6.81081 0.35C7.4534 0.35 7.97432 0.870923 7.97432 1.51351L7.97432 5.67568Z" fill="#DAF0ED" stroke="#828A90" stroke-width="0.7"/>
      </svg>
    </button>
  `;

  sdk.layout.resize();
}
