window.onpopstate = (event) => check_route();
document.addEventListener("DOMContentLoaded", async () => {
    check_route();

    // Add a click event listener to all links
    const links = [...document.querySelectorAll("a[route]")];
    links.forEach(async (el) => {
        el.onclick = () => route(el);
    });

    // Save routes
    const routes = [...links].map((el) => el.getAttribute("href"));
    sessionStorage.setItem("routes", JSON.stringify(routes));
});

async function route(el) {
    event.preventDefault();

    // Get the URL from the href attribute
    const url = el.getAttribute("href");

    // Update the URL
    window.history.pushState({}, "", url.split(".html")[0]);

    // Fetch the content of the URL
    const html = await fetch(url).then((res) => res.text());

    // Load the HTML content into the router-view element
    document.querySelector("router-view").innerHTML = html;
}

async function check_route() {
    // Get the current URL
    const url = window.location.hash.slice(1);

    // Get routes from session storage
    const routes = JSON.parse(sessionStorage.getItem("routes")) || [];

    // Check if the URL is in the routes
    if (routes.includes(url)) {
        // Fetch the content of the URL
        const html = await fetch(url).then((res) => res.text());
        document.querySelector("router-view").innerHTML = html;
    }
}
