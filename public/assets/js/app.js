$(".save").on("click", function(event) {
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
  .then(function(data) {
    console.log(data);
  });
});
$("#scrape").on("click", function(event) {
  event.preventDefault();
  debugger;
  $.ajax("/scrape", {}).then(function(resEvents){
    console.log("scrape client side");
    console.log(resEvents);
    window.location.replace("/scrape");
  })
});
$("#showSaved").on("click", function(event) {
  event.preventDefault();
  console.log("ShowSaved");
  window.location.replace("/showSaved");
});
$(".remove").on("click", function(event) {
  event.preventDefault();
  console.log(this);
  let id = this.id;
  console.log("remove button");
  $.post("/api/remove/", id)
  .then(function(data) {
    console.log(data);
  });
});
