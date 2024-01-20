const inputBox = document.getElementById("input-box");
const button = document.querySelector("button");
const list = document.querySelector(".list-container");
const showUploadButton = document.getElementById("showUploadPopup");
const uploadPopup = document.getElementById("uploadPopup");
const closeUploadButton = document.getElementById("popup_close_btn");
const hideInput = document.getElementById("hideInput");
const uploadPopupBlur = document.getElementById("uploadPopupBlur");

showUploadButton.addEventListener("click", () => {
  uploadPopup.style.opacity = "1";
  uploadPopup.style.pointerEvents = "auto";
  uploadPopupBlur.classList.add("blurred-background");
});

// Add a close button or another event to hide the popup
// For example:
closeUploadButton.addEventListener("click", () => {
  uploadPopup.style.opacity = "0";
  uploadPopup.style.pointerEvents = "none";
  uploadPopupBlur.classList.remove("blurred-background");
});

document
  .querySelector("button")
  .addEventListener("click", function submitForm() {
    document.getElementById("addTask").submit();
  });

//upload image function
function openFileInput() {
  document.getElementById("fileInput").click();
}

function handleFileSelect() {
  var fileInput = document.getElementById("fileInput");
  handleFiles(fileInput.files);
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy"; // Change cursor style to indicate copy
}

function handleFileDrop(event) {
  event.preventDefault();
  var files = event.dataTransfer.files;
  handleFiles(files);
}

function handleFiles(files) {
  // You can now perform further actions with the selected files
  // For example, you can send them to the server using a POST request

  // Example using fetch:
  var formData = new FormData();
  formData.append("file", files[0]); // Assuming you want to send only the first file
  fetch("your_server_endpoint", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the server response
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
