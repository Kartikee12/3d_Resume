import { profile as p } from './data.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (id) => document.getElementById(id);
const hide = (id) => { const el = $(id); if (el) el.style.display = 'none'; };

document.title = `${p.name} | Resume`;
$('logo').textContent = p.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
$('name').textContent = p.name;
$('role').textContent = `${p.role} · ${p.location}`;
$('about-text').textContent = p.about;
$('footer-name').textContent = p.name;

// Experience
if (p.experience && p.experience.length) {
  $('experience-list').innerHTML = p.experience.map((e) => `
    <div class="card">
      <div class="row"><h3>${esc(e.title)} · ${esc(e.company)}</h3><span>${esc(e.dates)}</span></div>
      <ul>${(e.points || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>`).join('');
} else {
  hide('experience');
  document.querySelectorAll('a[href="#experience"]').forEach((a) => (a.style.display = 'none'));
}

// Projects
$('project-list').innerHTML = (p.projects || []).map((x) => `
  <a class="card project" href="${esc(x.link)}" target="_blank" rel="noopener">
    <h3>${esc(x.name)}</h3>
    <p>${esc(x.description)}</p>
    <span class="tag">${esc(x.tech)}</span>
  </a>`).join('');

// Education + certifications
const edu = (p.education || []).map((e) => `
  <div class="card">
    <div class="row"><h3>${esc(e.degree)}</h3><span>${esc(e.dates)}</span></div>
    <p>${esc(e.school)}</p>
  </div>`).join('');
const certs = (p.certifications || []).length
  ? `<div class="card"><h3>Certifications</h3><ul>${p.certifications.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>`
  : '';
$('education-list').innerHTML = edu + certs;

// Contact
$('contact-list').innerHTML = `
  <a href="mailto:${esc(p.email)}">${esc(p.email)}</a>
  <a href="${esc(p.github)}" target="_blank" rel="noopener">${esc(p.github.replace(/^https?:\/\//, ''))}</a>
  <a href="${esc(p.linkedin)}" target="_blank" rel="noopener">${esc(p.linkedin.replace(/^https?:\/\//, ''))}</a>`;

// Download PDF = browser "Save as PDF" using the print layout
$('download').addEventListener('click', (e) => { e.preventDefault(); window.print(); });
