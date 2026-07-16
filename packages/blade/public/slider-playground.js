const QA_VERSION = '20260716-2';
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
  {
    id: 'components-slider--variant-matrix',
    kicker: 'Coverage',
    title: 'Complete variant matrix',
    height: 2300,
    wide: true,
  },
];

const frame = document.querySelector('#playground-frame');
const stage = document.querySelector('#preview-stage');
const previewHeights = { 360: '2050px', 768: '1200px', full: '1050px' };
const rangeObservers = new WeakMap();

function loadStoryFrame(storyFrame) {
  if (!storyFrame.src && storyFrame.dataset.src) {
    storyFrame.src = storyFrame.dataset.src;
  }
}

function observeStoryFrames(storyFrames) {
  if (!window.IntersectionObserver) {
    storyFrames.forEach((storyFrame, index) => {
      window.setTimeout(() => loadStoryFrame(storyFrame), 500 * (index + 1));
    });
    return;
  }

  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadStoryFrame(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '160px 0px' },
  );

  storyFrames.forEach((storyFrame) => observer.observe(storyFrame));
}

function renderStoryMatrix() {
  const grid = document.querySelector('#story-grid');
  const template = document.querySelector('#story-card-template');

  const storyFrames = STORIES.map((story) => {
    const card = template.content.cloneNode(true);
    card.querySelector('p').textContent = story.kicker;
    card.querySelector('h3').textContent = story.title;
    card.querySelector('.story-card').classList.toggle('is-wide', Boolean(story.wide));
    const storyFrame = card.querySelector('iframe');
    storyFrame.title = `${story.title} Slider story`;
    storyFrame.dataset.src = `./iframe.html?id=${story.id}&viewMode=story&qa=${QA_VERSION}`;
    storyFrame.height = story.height;
    grid.append(card);
    return storyFrame;
  });

  observeStoryFrames(storyFrames);
}

function setCheck(id, passed, successText, failureText) {
  const check = document.querySelector(`#${id}`);
  check.textContent = passed ? successText : failureText;
  check.className = passed ? 'pass' : 'fail';
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
      (node) =>
        node.offsetParent !== null && !node.closest('[data-blade-component="visually-hidden"]'),
    );
    const labelsPass = textNodes.every((node) => node.scrollWidth <= node.clientWidth + 1);

    setCheck('fit-check', fits, 'Pass', 'Overflow found');
    setCheck('target-check', targetsPass, '44px or larger', 'Below 44px');
    setCheck('label-check', labelsPass, 'No clipping', 'Clipping found');

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
document.querySelectorAll('[data-viewport]').forEach((button) => {
  button.addEventListener('click', () => {
    document
      .querySelectorAll('[data-viewport]')
      .forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    frame.style.width =
      button.dataset.viewport === 'full' ? '100%' : `${button.dataset.viewport}px`;
    frame.style.height = previewHeights[button.dataset.viewport];
    stage.scrollLeft = 0;
    window.setTimeout(inspectFrame, 180);
  });
});

frame.addEventListener('load', () => {
  window.setTimeout(inspectFrame, 250);
  window.setTimeout(inspectFrame, 1000);
});
renderStoryMatrix();
window.setTimeout(inspectFrame, 1800);
window.setInterval(inspectFrame, 1000);
