const resultsEl = document.getElementById('results');
const resultCountEl = document.getElementById('result-count');
const searchEl = document.getElementById('search');
const form = document.getElementById('submission-form');
const submissionOutput = document.getElementById('submission-output');

let allEntries = [];

const statusClass = (value) => {
  const normalized = value.toLowerCase();
  if (normalized.includes('not')) return 'bad';
  if (normalized.includes('partial') || normalized.includes('needs') || normalized.includes('mostly')) return 'warn';
  return 'ok';
};

const formatEntry = (entry) => {
  return `
    <article class="card">
      <h3>${entry.deviceModel}</h3>
      <p><strong>Chip:</strong> ${entry.chip} • <strong>GPU:</strong> ${entry.gpu}</p>
      <p>
        <span class="tag ${statusClass(entry.wifi)}">Wi‑Fi: ${entry.wifi}</span>
        <span class="tag ${statusClass(entry.bluetooth)}">Bluetooth: ${entry.bluetooth}</span>
        <span class="tag ${statusClass(entry.audio)}">Audio: ${entry.audio}</span>
        <span class="tag ${statusClass(entry.camera)}">Camera: ${entry.camera}</span>
      </p>
      <p><strong>Overall:</strong> ${entry.overallStatus}</p>
      <p class="muted">${entry.notes || 'No notes provided.'}</p>
      <p class="muted">Submitted by: ${entry.submittedBy || 'Community'} • ${entry.testedOn || 'Unknown date'}</p>
    </article>
  `;
};

const render = (query = '') => {
  const q = query.trim().toLowerCase();
  const filtered = allEntries.filter((entry) =>
    [entry.deviceModel, entry.chip, entry.gpu, entry.overallStatus]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );

  resultCountEl.textContent = `${filtered.length} result${filtered.length === 1 ? '' : 's'} found`;
  resultsEl.innerHTML = filtered.map(formatEntry).join('') || '<p class="muted">No matching results yet.</p>';
};

const loadData = async () => {
  const [repoData, localData] = await Promise.all([
    fetch('./data/devices.json').then((r) => r.json()).catch(() => []),
    Promise.resolve(JSON.parse(localStorage.getItem('pearos-local-tests') || '[]')),
  ]);

  allEntries = [...localData, ...repoData];
  render();
};

searchEl.addEventListener('input', (event) => {
  render(event.target.value);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const entry = Object.fromEntries(formData.entries());
  entry.submittedBy = 'Local Contributor';
  entry.testedOn = new Date().toISOString().slice(0, 10);

  const current = JSON.parse(localStorage.getItem('pearos-local-tests') || '[]');
  current.unshift(entry);
  localStorage.setItem('pearos-local-tests', JSON.stringify(current));

  submissionOutput.hidden = false;
  submissionOutput.textContent = `Copy this JSON into data/devices.json in a PR:\n${JSON.stringify(entry, null, 2)}`;
  form.reset();
  loadData();
});

loadData();
