const routes = {
  "/": "home",
  "/electronics": "electronics",
  "/kits": "kits",
  "/tools": "tools",
  "/pcb": "pcb"
};

function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

function router() {
  const path = window.location.pathname;
  const page = routes[path] || "home";

  document.getElementById("app").innerHTML = pages[page]();

  window.scrollTo(0, 0);
}

window.addEventListener("popstate", router);

document.addEventListener("click", e => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigateTo(e.target.href.replace(window.location.origin, ""));
  }
});