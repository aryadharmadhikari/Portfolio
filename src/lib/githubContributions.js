const API_URL = "https://github-contributions-api.jogruber.de/v4";
const SHORT_MONTH = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const FULL_MONTH = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" });

export async function fetchGitHubContributions(username, signal) {
  const res = await fetch(`${API_URL}/${encodeURIComponent(username)}?y=last`, {
    cache: "no-store",
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const { total, contributions = [] } = await res.json();
  if (!contributions.length) throw new Error("No contribution data");

  const days = contributions.map((day) => ({ ...day, label: formatTooltipText(day) }));
  const leadPad = Array(parseUtcDate(days[0].date).getUTCDay()).fill(null);
  const padded = [...leadPad, ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    const week = padded.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return {
    total: total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0),
    weeks,
    months: groupMonths(weeks),
  };
}

function groupMonths(weeks) {
  const groups = [];
  for (const week of weeks) {
    const first = week.find(Boolean);
    if (!first) continue;
    const month = SHORT_MONTH.format(parseUtcDate(first.date));
    const last = groups[groups.length - 1];
    if (last?.month === month) last.span += 1;
    else groups.push({ month, span: 1 });
  }

  const lastIdx = groups.length - 1;
  const duplicateEdge = groups.length > 12 && groups[0].month === groups[lastIdx].month;
  const hideTrailingDuplicate = duplicateEdge && groups[lastIdx].span < groups[0].span;

  return groups.map((g, i) => ({
    ...g,
    show: !(
      (i === 0 && (g.span < 3 || (duplicateEdge && !hideTrailingDuplicate))) ||
      (i === lastIdx && (g.span < 2 || hideTrailingDuplicate))
    ),
  }));
}

function formatTooltipText({ date, count }) {
  const d = parseUtcDate(date);
  const day = d.getUTCDate();
  const suffix = day >= 11 && day <= 13 ? "th" : ["th", "st", "nd", "rd"][day % 10] || "th";
  const label = `${FULL_MONTH.format(d)} ${day}${suffix}`;
  return `${count || "No"} ${count === 1 ? "contribution" : "contributions"} on ${label}.`;
}

function parseUtcDate(date) {
  return new Date(`${date}T00:00:00Z`);
}
