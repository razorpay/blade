'use strict';

const QA_VERSION = '20260715-10';
const STORIES = [
  { id: 'components-slider--default', kicker: 'Foundation', title: 'Default', height: 220 },
  { id: 'components-slider--range', kicker: 'Variant', title: 'Range', height: 240 },
  { id: 'components-slider--sizes', kicker: 'Scale', title: 'Sizes', height: 390 },
  { id: 'components-slider--colors', kicker: 'Semantics', title: 'Colors', height: 560 },
  {
    id: 'components-slider--values-and-labels',
    kicker: 'Content',
    title: 'Values and labels',
    height: 400,
  },
  { id: 'components-slider--marks', kicker: 'Guidance', title: 'Marks', height: 430 },
  { id: 'components-slider--states', kicker: 'Interaction', title: 'States', height: 610 },
  {
    id: 'components-slider--composed-with-text-input',
    kicker: 'Composition',
    title: 'With TextInput',
    height: 350,
  },
];

const DEFAULTS = {
  variant: 'single',
  size: 'medium',
  color: 'information',
  labelPosition: 'top',
  defaultValue: 50,
  showValue: true,
  showThumbValue: false,
  showMarks: false,
  showMinMax: false,
  isDisabled: false,
  isRequired: false,
  validationState: 'none',
};

const frame = document.querySelector('#playground-frame');
const stage = document.querySelector('#preview-stage');
const valueOutput = document.querySelector('#value-output');
const eventLog = document.querySelector('#event-log');
const controls = [...document.querySelectorAll('[data-arg]')];
const boundDocuments = new WeakSet();
const rangeObservers = new WeakMap();
let updateTimer;
let lastRangeSignature = '';

function renderStoryMatrix() {
  const grid = document.querySelector('#story-grid');
  const template = document.querySelector('#story-card-template');

  STORIES.forEach((story) => {
    const card = template.content.cloneNode(true);
    card.querySelector('p').textContent = story.kicker;
    card.querySelector('h3').textContent = story.title;
    const storyFrame = card.querySelector('iframe');
    storyFrame.title = `${story.title} Slider story`;
    storyFrame.src = `./iframe.html?id=${story.id}&viewMode=story&qa=${QA_VERSION}`;
    storyFrame.height = story.height;
    grid.append(card);
  });
}

function getArguments() {
  const args = controls.reduce((result, control) => {
    const value = control.type === 'checkbox' ? control.checked : control.value;
    result[control.dataset.arg] = value;
    return result;
  }, {});
  if (args.validationState === 'error') args.errorText = 'Choose a value within the range';
  if (args.validationState === 'success') args.successText = 'Value looks good';
  return args;
}

function updatePreview() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    const url = new URL('./iframe.html', window.location.href);
    const args = Object.entries(getArguments())
      .map(([key, value]) => `${key}:${String(value)}`)
      .join(';');
    url.searchParams.set('id', 'components-slider--default');
    url.searchParams.set('viewMode', 'story');
    url.searchParams.set('args', args);
    url.searchParams.set('qa', QA_VERSION);
    frame.src = url.toString();
  }, 120);
}

function setCheck(id, passed, successText, failureText) {
  const check = document.querySelector(`#${id}`);
  check.textContent = passed ? successText : failureText;
  check.className = passed ? 'pass' : 'fail';
}

function recordInteraction(message) {
  const item = document.createElement('li');
  item.textContent = message;
  eventLog.prepend(item);
  while (eventLog.children.length > 6) eventLog.lastElementChild.remove();

  const eventCheck = document.querySelector('#event-check');
  eventCheck.textContent = message;
  eventCheck.className = 'pass';
}

function addEvent(event) {
  const target = event.target;
  const values = [...target.ownerDocument.querySelectorAll('input[type="range"]')].map(
    (input) => input.value,
  );
  lastRangeSignature = values.join('|');
  recordInteraction(`${event.type}: ${target.value}`);
}

function inspectInteraction() {
  try {
    const values = [...frame.contentDocument.querySelectorAll('input[type="range"]')].map(
      (input) => input.value,
    );
    const signature = values.join('|');
    if (lastRangeSignature && signature && signature !== lastRangeSignature) {
      recordInteraction(`value: ${values.join(' - ')}`);
    }
    lastRangeSignature = signature;
  } catch {}
}

function inspectFrame() {
  try {
    const doc = frame.contentDocument;
    const ranges = [...doc.querySelectorAll('input[type="range"]')];
    const body = doc.body;
    const fits =
      doc.documentElement.scrollWidth <= frame.clientWidth + 1 &&
      body.scrollWidth <= frame.clientWidth + 1;
    const targetsPass =
      ranges.length > 0 &&
      ranges.every((input) => {
        const inputHeight = input.getBoundingClientRect().height;
        const wrapperHeight = input.parentElement?.getBoundingClientRect().height ?? 0;
        return Math.round(Math.max(inputHeight, wrapperHeight)) >= 44;
      });
    const textNodes = [...doc.querySelectorAll('label, output, p, span')].filter(
      (node) => node.offsetParent !== null,
    );
    const labelsPass = textNodes.every((node) => node.scrollWidth <= node.clientWidth + 1);

    setCheck('fit-check', fits, 'Pass', 'Overflow found');
    setCheck('target-check', targetsPass, '44px or larger', 'Below 44px');
    setCheck('label-check', labelsPass, 'No clipping', 'Clipping found');

    if (!boundDocuments.has(doc)) {
      doc.addEventListener('input', addEvent, true);
      doc.addEventListener('change', addEvent, true);
      boundDocuments.add(doc);
    }
    if (!rangeObservers.has(doc) && doc.defaultView?.ResizeObserver) {
      const observer = new doc.defaultView.ResizeObserver(inspectFrame);
      ranges.forEach((input) => observer.observe(input));
      rangeObservers.set(doc, observer);
    }
  } catch (error) {
    ['fit-check', 'target-check', 'label-check'].forEach((id) =>
      setCheck(id, false, '', 'Unavailable'),
    );
  }
}

function resetControls() {
  controls.forEach((control) => {
    const defaultValue = DEFAULTS[control.dataset.arg];
    if (control.type === 'checkbox') control.checked = defaultValue;
    else control.value = defaultValue;
  });
  valueOutput.value = DEFAULTS.defaultValue;
  updatePreview();
}

controls.forEach((control) => {
  control.addEventListener('input', () => {
    if (control.id === 'value-control') valueOutput.value = control.value;
    updatePreview();
  });
});

document.querySelector('#reset-controls').addEventListener('click', resetControls);
document.querySelectorAll('[data-viewport]').forEach((button) => {
  button.addEventListener('click', () => {
    document
      .querySelectorAll('[data-viewport]')
      .forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    frame.style.width =
      button.dataset.viewport === 'full' ? '100%' : `${button.dataset.viewport}px`;
    stage.scrollLeft = 0;
    window.setTimeout(inspectFrame, 180);
  });
});

frame.addEventListener('load', () => {
  lastRangeSignature = '';
  window.setTimeout(inspectFrame, 250);
  window.setTimeout(inspectFrame, 1000);
});
renderStoryMatrix();
window.setTimeout(inspectFrame, 1800);
window.setInterval(inspectFrame, 1000);
window.setInterval(inspectInteraction, 200);
