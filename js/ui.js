// js/ui.js — Қайталанатын DOM және хабарлама функциялары
function createElementWithProps(tagName, props = {}, styles = {}) {
  const el = document.createElement(tagName);
  Object.assign(el, props);
  Object.assign(el.style, styles);
  return el;
}

function setStatusMessage(el, text, type = "info") {
  if (!el) return;
  el.textContent = text;

  if (type === "error") {
    el.style.backgroundColor = "#fdecea";
    el.style.color = "#b81c1c";
  } else if (type === "success") {
    el.style.backgroundColor = "#eef4f0";
    el.style.color = "#1f4d3b";
  } else {
    el.style.backgroundColor = "transparent";
    el.style.color = "inherit";
  }
}