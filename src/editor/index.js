import { sdk } from "../sdk.js";

(async function init() {
  const { enums, multiple } = await sdk.field.componentConfig();
  const valueAsString = await sdk.field.getValue();

  window.onFormChange = function (event) {
    const formData = new FormData(document.querySelector("form"));
    const selectedEnums = formData.getAll("enumValue");

    sdk.field.setValue(JSON.stringify({ selectedEnums }));
  };

  window.onSingleValueChange = function (event) {
    sdk.field.setValue(JSON.stringify({ selectedEnums: [event.target.value] }));
  };

  let value = { selectedEnums: [] };
  if (typeof valueAsString === "string") {
    try {
      value = JSON.parse(valueAsString);
    } catch (e) {}
  }

  const main = document.querySelector("main");

  render();

  function render() {
    if (!multiple) {
      main.innerHTML = `
        <span class="fancy-select">
          <select onchange="onSingleValueChange(event)">
            ${(enums || [])
              .map(
                (e) =>
                  `<option ${
                    value.selectedEnums.some((sel) => sel === e) && "selected"
                  }>${e}</option>`
              )
              .join("")}
          </select>
        </span>
      `;
    } else {
      main.innerHTML = `
        <form onchange="onFormChange(event)">
          ${enums
            .map(
              (e, index) => `
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="enumValue"
                    value="${e}"
                    ${value.selectedEnums.some((sel) => sel === e) && "checked"}
                  />
                  ${e}
                </label>
              </div>
            `
            )
            .join("")}
        </form>
      `;
    }

    sdk.layout.resize();
  }
})();
