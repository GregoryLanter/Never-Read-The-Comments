//import { link } from "fs";

let articleID = "";

$(".save").on("click", function (event) {
  event.preventDefault();
  console.log(this);

  console.log("save button");
  var newArticle = {
    title: this.parentElement.parentElement.children[0].textContent,
    blurb: this.parentElement.parentElement.children[1].textContent,
    url: this.parentElement.children[0].href
  }
  console.log(newArticle);
  $.post("/api/save/", newArticle)
  .then(function (data) {
    console.log(data);
    $("#myModalSaved").show();
  });
});

$("#saveComment").on("click", function (event) {
  event.preventDefault();
  let title = $("#commentTitle").val();
  let noteText = $("#commentBody").val();
  
  var newNote = {
    title: title,
    body: noteText
  }
  console.log(newNote);
  $.post("/api/saveNote/" + articleID, newNote)
    .then(function (data) {
      console.log(data);
      $("#commentTitle").val("");
      $("#commentBody").val("");
      var $li = document.createElement("li");
      $li.id = data._id;
      $li.className = "noteList";
      $li.textContent = title;
      //$li.dataset("body", dataArr[i].body)
      var $ul = document.getElementById("comments");
      $ul.append($li);
      var $del = document.createElement("button");
      $del.id = "del" + data._id;
      $del.className = "deleteNote";
      $del.textContent = "Del";
      $li.append($del);
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
  let articleId = {
    id: this.id
  }

  console.log("remove button");
  $.post("/api/removeArticle/", articleId)
    .then(function (data) {
      console.log(data);
    });

  location.reload();
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
    $("li").remove();
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

$(".modalControlSaved").on("click", function (event) {
  event.preventDefault();
  let modal = document.getElementById('myModalSaved');
  if ($(this).attr("data-state") === "Close") {
    modal.style.display = "None";
  }
});

/*$(".noteList").on("click", function (event) {
  event.preventDefault();
  $("#title").textContent = $(this).textContent;
});*/
//#del5d2faee0c5f808ba74a61eb6
//$("#del5d2faee0c5f808ba74a61eb6").on("click", function() {
$(document.body).on("click", ".deleteNote",function (){
  event.preventDefault();
  
  let note = $(this).attr("id");
  note = note.substring(3, note.length)
  let ids = {
    article: articleID,
    note: note
  }
  
  $.post("/api/removeNote/" + note, ids)
    .then(function (data) {
      document.getElementById(data.id).remove();
      //$(this).parentElement.remove();
      console.log(data);
    });
});

