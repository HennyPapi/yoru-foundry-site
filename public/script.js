const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("buildForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = `Yoru Foundry Build Request — ${data.get("name")}`;
  const body = [
    "YORU FOUNDRY BUILD REQUEST",
    "",
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Preferred layout: ${data.get("layout")}`,
    `Budget: ${data.get("budget")}`,
    `Switch feel: ${data.get("feel")}`,
    `Sound preference: ${data.get("sound")}`,
    "",
    "Build details:",
    data.get("details") || "No additional details provided."
  ].join("\n");

  window.location.href =
    `mailto:hello@yorufoundry.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
