// back to top
document.addEventListener("DOMContentLoaded", function () {
    const toTopButton = document.querySelector(".to_top");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 100) {
            toTopButton.style.display = "flex";
        } else {
            toTopButton.style.display = "none";
        }
    });

    toTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
