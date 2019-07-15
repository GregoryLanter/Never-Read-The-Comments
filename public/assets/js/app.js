let articleID = "";

$(".save").on("click", function (event) {
  event.preventDefault();
  console.log(this);
  let title = this.parentElement.children[0].textContent;
  let blurb = this.parentElement.children[1].textContent;
  let url = this.parentElement.children[2].href;
  console.log("save button");
  var newArticle = {
    title: this.parentElement.children[0].textContent,
    blurb: this.parentElement.children[1].textContent,
    url: this.parentElement.children[2].href
  }
  console.log(newArticle);
  $.post("/api/save/", newArticle)
    .then(function (data) {
      console.log(data);
    });
});
$("#saveComment").on("click", function (event) {
  event.preventDefault();
  console.log("========================================================");
  console.log("Save comment")
  console.log(this);
  console.log("========================================================");
  let title = $("#title").val();
  let noteText = $("#comment").val();
  console.log("save button");
  var newNote = {
    title: title,
    body: noteText
  }
  console.log(newNote);
  $.post("/api/saveNote/" + articleID, newNote)
    .then(function (data) {
      console.log(data);
    });
});
$("#scrape").on("click", function (event) {
  event.preventDefault();
  $.ajax("/scrape", {}).then(function (resEvents) {
    console.log("scrape client side");
    console.log(resEvents);
    window.location.replace("/scrape");
  })
});
$("#showSaved").on("click", function (event) {
  event.preventDefault();
  console.log("ShowSaved");
  window.location.replace("/showSaved");
});
$(".remove").on("click", function (event) {
  event.preventDefault();
  console.log(this);
  let id = this.id;
  console.log("remove button");
  $.post("/api/remove/", id)
    .then(function (data) {
      console.log(data);
    });
});
/*$(".comment").on("click", function(event) {
  event.preventDefault();
  console.log(this);
  let modal = document.getElementById('myModal');
  modal.style.display = "block";
});*/
$(".modalControl").on("click", function (event) {
  event.preventDefault();
  console.log(this);
  let modal = document.getElementById('myModal');
  if ($(this).attr("data-state") === "Close") {
    modal.style.display = "None";
  } else {
    articleID = $(this).attr("id")
    modal.style.display = "Block";
    $.ajax("/getNotes/" + articleID, {}).then(function (resEvents) {
      console.log("scrape client side");
      console.log(resEvents);
    })
  }
});

