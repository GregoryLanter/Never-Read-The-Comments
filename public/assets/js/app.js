//import { link } from "fs";

let articleID = "";

$(".save").on("click", function (event) {
  event.preventDefault();
  console.log(this);
  let title = this.parentElement.children[0].textContent;
  let blurb = this.parentElement.children[1].textContent;
  let url = this.parentElement.children[2].href;
  let arr = [];

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
      let dataArr = resEvents.notes;
      console.log(dataArr);
      console.log(dataArr[0].title);
      var $ul = document.getElementById("comments");
      for (let i = 0; i < dataArr.length; i++) {
        var $li = document.createElement("li");
        $li.id = dataArr[i]._id;
        $li.className = "noteList";
        $li.textContent = dataArr[i].title;
        //$li.dataset("body", dataArr[i].body)
        $ul.append($li);
        var $del = document.createElement("button");
        $del.id = "del" + dataArr[i]._id;
        $del.className = "deleteNote";
        $del.textContent = "Del";
        $li.append($del);
      }
      //modal.append($ul);
    })
  }
});
$(".noteList").on("click", function (event) {
  event.preventDefault();
  $("#title").textContent = $(this).textContent;
});
//#del5d2faee0c5f808ba74a61eb6
//$("#del5d2faee0c5f808ba74a61eb6").on("click", function() {
$(document.body).on("click", ".deleteNote",function (){
  event.preventDefault();
  let id = $(this).attr("id");
  console.log(id);
  id = id.substring(3, id.length);
  console.log(id);
  $.post("/api/removeNote/" + id, )
    .then(function (data) {
      $(this).parentElement.remove();
      console.log(data);
    });
});

