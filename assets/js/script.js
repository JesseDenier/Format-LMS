//Connect all references by ID between HTML and Javascript.
function getElementById(id) {
  return document.querySelector("#" + id);
}

// Returns user to the home page.
function goBack() {
  window.location.href = "index.html";
}

// Adds event listener to Course Return button.
courseReturnBtn.addEventListener("click", goBack);
