import { sdk } from "../sdk.js";

const form = document.querySelector("form");

let enums = ["", "", "", ""];

window.removeEnum = function (index) {
  enums.splice(index, 1);
  render();
};

window.addEnum = function () {
  enums.push("");
  render();
};

// Listen for any input change
form.addEventListener("change", function onFormChange() {
  const formData = new FormData(form);
  formData.getAll("enumValue").forEach((e, i) => (enums[i] = e));

  sdk.componentConfig.setValue({
    enums,
  });
});

render();

function render() {
  form.innerHTML = `
    <h3>Please create the available enum values</h3>
    ${enums
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
