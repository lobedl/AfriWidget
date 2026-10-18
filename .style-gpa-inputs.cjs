const fs = require('node:fs');
const file = 'gpa-calculator.html';
let html = fs.readFileSync(file, 'utf8');

const styles = `
.course-table-head{display:none;padding:0 .875rem .5rem;color:#6b7280;font-size:.6875rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
.course-field-label{display:block;font-size:.6875rem;font-weight:800;color:#374151;letter-spacing:.04em;text-transform:uppercase;margin-bottom:.25rem}
.course-card{border:1.5px solid #e5e7eb;transition:border-color .15s,box-shadow .15s,background .15s}
.course-card:hover{border-color:#d1d5db}
.course-card:focus-within{border-color:#facc15;box-shadow:0 0 0 3px rgba(250,204,21,.16)}
.course-card .course-field{min-width:0}
.course-card .form-input,.course-card .form-select{min-height:48px}
.course-card .btn-remove{min-width:44px}
@media (min-width:768px){
  .course-table-head{display:grid;grid-template-columns:2fr 1fr 1.5fr 44px;gap:.625rem;align-items:center}
  .course-card{grid-template-columns:2fr 1fr 1.5fr 44px;align-items:end;padding:.75rem .875rem}
  .course-field-label{display:none}
  .course-card .btn-remove{width:44px;min-width:44px;padding:0}
  .course-card .btn-remove span{display:none}
}
@media (max-width:639px){
  .course-card{padding:.875rem;gap:.75rem}
  .course-card .btn-remove{min-height:44px}
}`;

if (!html.includes('.course-table-head{')) {
  html = html.replace('</style>', `${styles}</style>`);
}

const oldHeader = '<div class="course-list" id="courseList"></div>';
const newHeader = '<div class="course-table-head" aria-hidden="true"><span>Course name</span><span>Credit hours</span><span>Grade</span><span></span></div><div class="course-list" id="courseList"></div>';
if (!html.includes(newHeader)) {
  if (!html.includes(oldHeader)) throw new Error('Could not locate the course row list.');
  html = html.replace(oldHeader, newHeader);
}

const replacements = [
  [
    `'<label class="field-label">Course name</label>' +'<input type="text" class="form-input course-name" placeholder="e.g. Data Structures" value="' +(name ?escapeHtml(name) :'') +'" />'`,
    `'<label class="field-label course-field-label">Course name</label>' +'<input type="text" class="form-input course-name" aria-label="Course name" placeholder="e.g. Data Structures" value="' +(name ?escapeHtml(name) :'') +'" />'`
  ],
  [
    `'<label class="field-label">Credit hours</label>' +'<input type="number" class="form-input course-credits" min="0.5" max="60" step="0.5" placeholder="3" value="' +(credits ?escapeHtml(credits) :'') +'" inputmode="decimal" />'`,
    `'<label class="field-label course-field-label">Credit hours</label>' +'<input type="number" class="form-input course-credits" aria-label="Credit hours" min="0.5" max="60" step="0.5" placeholder="e.g. 3" value="' +(credits ?escapeHtml(credits) :'') +'" inputmode="decimal" />'`
  ],
  [
    `'<label class="field-label">Grade</label>' +gradeHtml`,
    `'<label class="field-label course-field-label">Grade</label>' +gradeHtml`
  ],
  [
    `gradeHtml ='<input type="number" class="form-input course-grade" min="0"'+maxAttr+' step="0.01" placeholder="e.g. 3.5" inputmode="decimal" />'`,
    `gradeHtml ='<input type="number" class="form-input course-grade" aria-label="Grade points" min="0"'+maxAttr+' step="0.01" placeholder="e.g. 3.5" inputmode="decimal" />'`
  ],
  [
    `gradeHtml ='<select class="form-select course-grade">' +opts +'</select>'`,
    `gradeHtml ='<select class="form-select course-grade" aria-label="Grade">' +opts +'</select>'`
  ],
  [
    `gradeHtml ='<select class="form-select course-grade" disabled><option value="">Select a grading system first</option></select>'`,
    `gradeHtml ='<select class="form-select course-grade" aria-label="Select a grading system first" disabled><option value="">Choose a grading system first</option></select>'`
  ]
];
for (const [before, after] of replacements) {
  if (html.includes(before)) html = html.replace(before, after);
}

fs.writeFileSync(file, html);
console.log('Updated the GPA calculator course inputs to use the converter-style labeled grid.');
