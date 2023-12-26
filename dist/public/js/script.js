const table = document.querySelector(".table");

const shortUrlTd = table.querySelectorAll("td.short-url");
shortUrlTd.forEach((td) => {
  const a = td.querySelector("a");
  const button = td.querySelector(".copy-link-button");
  // copy text
  button.addEventListener("click", (e) => {
    const text = a.innerHTML;
    const link = window.location.href + text;
    navigator.clipboard.writeText(link);
    a.innerHTML = "Copied!";
    setTimeout(() => {
      a.innerHTML = text;
    }, 2000);
  });
  // update clicks
  a.addEventListener("click", () => {
    const clicksCell = td.nextSibling.nextSibling;
    const value = parseInt(clicksCell.innerHTML) + 1;
    clicksCell.innerHTML = value;
  });
});
