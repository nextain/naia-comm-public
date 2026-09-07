const form = document.getElementById("survey-form");
const submitBtn = document.getElementById("submit-btn");
const status = document.getElementById("form-status");
const calendarEl = document.getElementById("calendar");
const selectedDatesEl = document.getElementById("selected-dates");

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const selectedDates = new Set();

function pad2(n) { return String(n).padStart(2, "0"); }
function isoDate(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }
function labelDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = WEEKDAY_LABELS[new Date(y, m - 1, d).getDay()];
  return `${m}/${d}(${dow})`;
}

function renderSelectedChips() {
  const dates = Array.from(selectedDates).sort();
  selectedDatesEl.innerHTML = "";
  if (dates.length === 0) {
    selectedDatesEl.textContent = "선택한 날짜가 없습니다.";
    return;
  }
  dates.forEach((iso) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "date-chip";
    chip.textContent = `${labelDate(iso)} ✕`;
    chip.addEventListener("click", () => toggleDate(iso));
    selectedDatesEl.appendChild(chip);
  });
}

function toggleDate(iso) {
  if (selectedDates.has(iso)) selectedDates.delete(iso);
  else selectedDates.add(iso);
  const cell = calendarEl.querySelector(`[data-date="${iso}"]`);
  if (cell) cell.classList.toggle("selected", selectedDates.has(iso));
  renderSelectedChips();
}

function renderMonth(year, monthIndex, minDay) {
  const monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const wrap = document.createElement("div");
  wrap.className = "cal-month";

  const title = document.createElement("div");
  title.className = "cal-month-title";
  title.textContent = `${year}년 ${monthNames[monthIndex]}`;
  wrap.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "cal-grid";
  WEEKDAY_LABELS.forEach((w) => {
    const h = document.createElement("div");
    h.className = "cal-dow";
    h.textContent = w;
    grid.appendChild(h);
  });

  const firstDow = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  for (let i = 0; i < firstDow; i++) {
    grid.appendChild(document.createElement("div"));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cal-day";
    cell.textContent = String(d);
    const iso = isoDate(year, monthIndex, d);
    cell.dataset.date = iso;
    if (d < minDay) {
      cell.disabled = true;
      cell.classList.add("past");
    } else {
      cell.addEventListener("click", () => toggleDate(iso));
    }
    const dow = (firstDow + d - 1) % 7;
    if (dow === 0 || dow === 6) cell.classList.add("weekend");
    grid.appendChild(cell);
  }
  wrap.appendChild(grid);
  return wrap;
}

function initCalendar() {
  const today = new Date();
  calendarEl.appendChild(renderMonth(today.getFullYear(), today.getMonth(), today.getDate()));
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  calendarEl.appendChild(renderMonth(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
  renderSelectedChips();
}
initCalendar();

function collectValues(name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => el.value);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  submitBtn.disabled = true;
  status.textContent = "제출 중...";
  status.removeAttribute("data-state");

  const dates = Array.from(selectedDates).sort().map(labelDate);
  const datesTime = form.dates_time.value.trim();

  const payload = {
    name: form.name.value.trim(),
    role: form.role.value.trim(),
    contact: form.contact.value.trim(),
    intent: (form.querySelector('input[name="intent"]:checked') || {}).value || "",
    dates,
    datesTime,
    venue: form.venue.value.trim(),
    interests: collectValues("interests"),
    notes: form.notes.value.trim(),
    website: form.website.value.trim(),
  };

  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("submit failed");
    form.hidden = true;
    status.textContent = "제출이 완료됐습니다. 감사합니다!";
    status.dataset.state = "ok";
  } catch (err) {
    submitBtn.disabled = false;
    status.textContent = "제출에 실패했습니다. 잠시 후 다시 시도해주세요.";
    status.dataset.state = "err";
  }
});
