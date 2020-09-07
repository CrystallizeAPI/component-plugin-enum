import { sdk } from "../sdk.js";

window.onValueChange = function (event) {
  sdk.field.setValue({ selectedEnum: event.target.value });
};

(async function init() {
  const { enums } = await sdk.field.getComponentConfig();
  const value = await sdk.field.getValue();

  render();

  function render() {
    document.querySelector("main").innerHTML = `
    <select onchange="onValueChange(event)">
      ${enums.map(
        (e) => `<option ${e === value.selectedEnum && "selected"}>${e}</option>`
      )}
    </select>
  `;
  }
})();
