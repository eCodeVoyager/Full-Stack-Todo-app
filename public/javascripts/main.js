const toggleForm = () => {
  const container = document.querySelector(".container");
  container.classList.toggle("active");
};

document
  .querySelector("#singinBtn")
  .addEventListener("click", function submitForm() {
    document.getElementById("myForm_login").submit();
  });

document
  .querySelector("#singupBtn")
  .addEventListener("click", function submitForm() {
    document.getElementById("myForm_register").submit();
  });
