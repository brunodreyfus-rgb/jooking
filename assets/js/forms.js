const WEB3FORMS_KEY = "bddf807e-4379-4fff-9ddd-10ae7385397c";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[name="access_key"]').forEach(input => {
    input.value = WEB3FORMS_KEY;
  });
});
