window.onpopstate = (event) => check_route();
document.addEventListener("DOMContentLoaded", async () => {
    // Save the routes if not already saved
    const links = [...document.querySelectorAll("a[route]")];
    if (!sessionStorage.getItem("routes")) {
        // Get path reliably
        const base = get_base();
        const routes = [...links].map((el) => el.getAttribute("href"));
        sessionStorage.setItem("routes", JSON.stringify(routes));
        sessionStorage.setItem("base", base);
    }

    // Check the route on page load
    check_route();

    // Add a click event listener to all links
    links.forEach(async (el) => {
        el.onclick = () => route(el);
    });
});

async function route(el) {
    event.preventDefault();

    // Get the URL from the href attribute
    const href = el.getAttribute("href");

    // Get base
    const base = sessionStorage.getItem("base") || "";
    const url = base + "/#" + href;

    // Update the URL
    console.log("Updating to:", url);
    window.history.pushState({}, "", url);

    // Fetch the content of the URL
    const html = await fetch(href).then((res) => res.text());

    // Load the HTML content into the router-view element
    document.querySelector("router-view").innerHTML = html;
}

function get_base() {
    const href = window.location.href
        .replace(window.location.origin, "")
        .split("/")[1];
    if (!href) return "";
    return "/" + href;
}

function get_path(el) {
    const href = el.getAttribute("href");
    return href;
}

async function check_route() {
    // Get the current URL
    let path = window.location.href.replace(
        window.location.origin + window.location.pathname,
        "",
    );
    if (!path) return;

    // Get routes from session storage
    const origin = sessionStorage.getItem("origin") || "";
    const routes = JSON.parse(sessionStorage.getItem("routes")) || [];

    // Get url
    path = path.slice(1);

    // Check if the URL is in the routes
    if (routes.includes(path)) {
        // Fetch the content of the URL
        const html = await fetch(path).then((res) => res.text());
        document.querySelector("router-view").innerHTML = html;
    }
}
