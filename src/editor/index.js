import { sdk } from "../sdk.js";

window.onValueChange = function (event) {
  sdk.field.setValue({ selectedEnum: event.target.value });
};

(async function init() {
  const { enums, multiple } = await sdk.field.componentConfig();
  const value = await sdk.field.getValue();

  const main = document.querySelector("main");

  render();

  function render() {
    if (!multiple) {
      main.innerHTML = `
        <select onchange="onValueChange(event)">
          ${(enums || [])
            .map(
              (e) =>
                `<option ${
                  e === value.selectedEnum && "selected"
                }>${e}</option>`
            )
            .join("")}
        </select>
      `;
    } else {
      main.innerHTML = `
        <div>
          ${enums
            .map(
              (e, index) => `
              <div>
                <label>
                  <input type="checkbox" name="enum${index}" />
                  ${e}
                </label>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }
  }
})();
