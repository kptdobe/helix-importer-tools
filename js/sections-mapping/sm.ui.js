import alert from '../shared/alert.js';
import { getContentFrame } from '../shared/ui.js';
import { getElementByXpath } from '../shared/utils.js';

const ADD_FRAGMENT_BTN = document.getElementById('sm-add-fragment');
const SM_FRAGMENTS_CONTAINER = document.getElementById('sm-fragments-container');
const SM_LOCAL_STORAGE_KEY = 'helix-importer-sections-mapping';

let importerConfig = {};

// selected fragment
const selectedSectionInFragmentProxy = { id: null };
const selectedSectionInFragment = new Proxy(selectedSectionInFragmentProxy, {
  set: (target, key, value) => {
    console.log('selectedSectionInFragment', target, key, value);

    const oldValue = target[key];
    console.log(`${key} set from ${selectedSectionInFragmentProxy.id} to ${value}`);
    target[key] = value;
    const oldOverlayDiv = SM_FRAGMENTS_CONTAINER.querySelector(`[data-id="${oldValue}"]`);
    if (oldOverlayDiv) {
      oldOverlayDiv.classList.remove('selected');
    }
    const overlayDiv = SM_FRAGMENTS_CONTAINER.querySelector(`[data-id="${value}"]`);
    if (overlayDiv) {
      overlayDiv.classList.add('selected');
    }
    return true;
  },
});

// selected section
const selectedBoxInSectionProxy = { id: null };
const selectedBoxInSection = new Proxy(selectedBoxInSectionProxy, {
  set: (target, key, value) => {
    const oldValue = target[key];
    target[key] = value;
    const oldOverlayDiv = getContentFrame().contentDocument.querySelector(`.xp-overlay[data-box-id="${oldValue}"]`);
    if (oldOverlayDiv) {
      oldOverlayDiv.classList.remove('hover');
    }
    const overlayDiv = getContentFrame().contentDocument.querySelector(`.xp-overlay[data-box-id="${value}"]`);
    if (overlayDiv) {
      overlayDiv.classList.add('hover');
    }
    return true;
  },
});

export function getSMData() {
  const fragments = [];
  // return fragments;
  SM_FRAGMENTS_CONTAINER.querySelectorAll('.sm-fragment').forEach((el) => {
    const fragment = {
      id: el.dataset.id,
      path: el.dataset.path,
      sections: [],
    };
    el.querySelectorAll('.sm-fragment-sections .sm-frg-section').forEach((section) => {
      const blocks = [];
      const secObj = {
        id: section.dataset.id,
        blocks,
        settings: {
          'section-metadata-block': {
            add: section.querySelector('#frg-section-sm-block-checkbox').checked,
            style: section.querySelector('#frg-section-section-metadata-style').value,
          },
        },
      };
      section.querySelectorAll('.row').forEach((block) => {
        secObj.blocks.push({
          ...JSON.parse(block.dataset.boxData),
          mapping: block.querySelector('sp-picker').value,
          customBlockName: block.querySelector('sp-textfield').value,
        });
      });

      fragment.sections.push(secObj);
    });

    fragments.push(fragment);
  });
  return fragments;
}

export function getSMCache() {
  return JSON.parse(localStorage.getItem(SM_LOCAL_STORAGE_KEY) || '[]');
}

export function saveSMCache() {
  // disable for now
  const url = importerConfig.fields['import-url'];
  const autoDetect = importerConfig.fields['import-sm-auto-detect'];
  const cache = getSMCache();
  const mapping = getSMData();

  const found = cache.find((item) => item.url === url && item.autoDetect === autoDetect);

  if (found) {
    found.mapping = mapping;
  } else {
    cache.push({
      url,
      autoDetect,
      mapping,
    });
  }

  localStorage.setItem(SM_LOCAL_STORAGE_KEY, JSON.stringify(cache));
}

export function createAddFragmentBtn(target) {
  const el = document.createElement('sp-button');
  el.innerHTML = '<sp-icon-add slot="icon"></sp-icon-add>Add Fragment</sp-button>';
  el.addEventListener('click', () => {
    // getFragmentAccordionElement(target);
  });
  target.appendChild(el);
}

export function addFragmentAccordionElement(path) {
  const id = SM_FRAGMENTS_CONTAINER.lastElementChild
    ? parseInt(SM_FRAGMENTS_CONTAINER.lastElementChild.dataset.id, 10) + 1 : 1;

  const label = path || `/new-fragment-${id.toString().padStart(2, '0')}`;
  const elId = `sm-frg-${id.toString().padStart(2, '0')}`;

  const el = document.createElement('div');
  el.id = elId;
  el.dataset.id = id;
  el.dataset.path = label;
  el.className = 'sm-fragment';
  el.setAttribute('open', '');
  el.innerHTML = `
  <sp-button id="delete-frg" size="s" variant="negative" treatment="fill" role="button" icon-only>
    <sp-icon-delete slot="icon" dir="ltr" aria-hidden="true"></sp-icon-delete>
  </sp-button>
  <sp-action-button id="sm-fragment-edit-path-btn" size="s" quiet>
    <sp-icon-text-edit slot="icon"></sp-icon-text-edit>
    <sp-tooltip self-managed placement="left">
      <div>
        <sp-field-label for="fragment-path" side-aligned="start">Fragment Path (ex. /index)</sp-field-label>
        <sp-textfield id="fragment-path" placeholder="${label}">
          <sp-help-text slot="negative-help-text">Please enter a name.</sp-help-text>
        </sp-textfield>
      </div>
    </sp-tooltip>
  </sp-action-button>
  <details open>
    <summary>${label}</summary>
    <div class="sm-fragment-content">
      <div class="sm-frg-sections-title">
        <h2>Sections</h2>
        <sp-button id="frg-add-section" size="s" treatment="fill" role="button" icon-only>
          <sp-icon-add-circle slot="icon" dir="ltr" aria-hidden="true"></sp-icon-add-circle>
        </sp-button>
      </div>
      <div class="sm-fragment-sections">
      </div>
    </div>
  </details>
`;

  SM_FRAGMENTS_CONTAINER.appendChild(el);

  const accItemNameTextfieldEl = el.querySelector('sp-textfield');

  accItemNameTextfieldEl.addEventListener('input', (e) => {
    el.dataset.path = e.target.value;
    el.querySelector('summary').textContent = e.target.value;
    saveSMCache();
  });

  const deleteBtnEl = el.querySelector('#delete-frg');
  deleteBtnEl.addEventListener('click', () => {
    el.remove();
    saveSMCache();
  });

  const addSectionBtnEl = el.querySelector('#frg-add-section');
  addSectionBtnEl.addEventListener('click', () => {
    const sectionId = addSectionAccordionElement(id, el.querySelector('.sm-fragment-sections'));
    selectedSectionInFragment.id = sectionId;
    saveSMCache();
  });

  saveSMCache();

  return el;
}

export function initUIFromData(data) {
  data.forEach((fragment) => {
    const el = addFragmentAccordionElement(fragment.path);
    fragment.sections.forEach((section) => {
      addBlockInSection(getMappingRow(section), el);
    });
  });
}

export function init(config) {
  importerConfig = config;
  ADD_FRAGMENT_BTN?.addEventListener('click', () => addFragmentAccordionElement());
}

export function initOverlayClickHandler() {
  getContentFrame().contentDocument.body.addEventListener('click', (e) => {
    const overlayDiv = e.target;
    // shift + click to remove overlay
    if (e.shiftKey) {
      overlayDiv.remove();
    } else if (overlayDiv.dataset.boxData) {
      const boxData = JSON.parse(overlayDiv.dataset.boxData);
      boxData.color = overlayDiv.style.borderColor;
      boxData.mapping = 'unset';
      addBlockInSection(getMappingRow(boxData));
    }
  });
}

export function reset() {
  SM_FRAGMENTS_CONTAINER.innerHTML = '';
  SM_FRAGMENTS_CONTAINER.childNodes.forEach((el) => {
    el.remove();
  });
}

export function setImporterConfig(config) {
  importerConfig = config;
}

function getBlockPicker(value = 'defaultContent') {
  const blockPicker = document.createElement('sp-picker');
  blockPicker.setAttribute('label', 'Mapping ...');
  blockPicker.setAttribute('id', 'block-picker');

  [
    [
      { label: 'Default Content', attributes: { value: 'defaultContent' } },
    ],
    [
      { label: 'Cards', attributes: { value: 'cards' } },
      { label: 'Carousel', attributes: { value: 'carousel' } },
      { label: 'Columns', attributes: { value: 'columns' } },
      { label: 'Hero', attributes: { value: 'hero' } },
    ],
    [{ label: 'Header Nav', attributes: { value: 'header' } }],
    [{ label: 'Snapshot', attributes: { value: 'snapshot', disabled: true } }],
    [{ label: 'Exclude', attributes: { value: 'exclude' } }],
  ].forEach((group, idx, arr) => {
    group.forEach((item) => {
      const mItem = document.createElement('sp-menu-item');
      item.attributes = item.attributes || [];
      Object.keys(item.attributes).forEach((k) => {
        mItem.setAttribute(k, item.attributes[k]);
      });
      mItem.textContent = item.label;
      blockPicker.appendChild(mItem);
    });
    if (idx < arr.length - 1) {
      blockPicker.appendChild(document.createElement('sp-menu-divider'));
    }
  });

  blockPicker.setAttribute('value', value);

  blockPicker.addEventListener('change', (e) => {
    saveSMCache();
  });

  return blockPicker;
}

export function getMappingRow(boxData, idx = 1) {
  const row = document.createElement('div');
  row.dataset.idx = idx;
  row.dataset.boxId = boxData.id;
  row.dataset.xpath = boxData.xpath;
  row.dataset.boxY = boxData.y;
  row.classList.add('row');
  row.dataset.boxData = JSON.stringify(boxData);
  if (row.dataset.childrenXpaths) {
    row.dataset.childrenXpaths = JSON.stringify(boxData.childrenXpaths);
  }
  row.innerHTML = `
  <div id="sec-color" style="background-color: ${boxData.color || 'white'};"></div>
  <h3 id="sec-id"><strong>${boxData.id}</strong></h3>
  <h3 id="sec-layout" title="Cols x Rows"><sp-icon-view-grid size="xxs"></sp-icon-view-grid> ${boxData.layout.numCols} x ${boxData.layout.numRows}</h3>
  `;

  let pickerMapping = 'defaultContent';
  if (boxData.mapping === 'unset') {
    const t = SM_FRAGMENTS_CONTAINER.querySelector('.sm-fragment:has(.sm-frg-section.selected)');
    const path = t ? t.dataset.path : '';
    if (path === '/nav') {
      pickerMapping = 'header';
    } else if (boxData.layout.numCols > 1) {
      pickerMapping = 'columns';
    }
  } else {
    pickerMapping = boxData.mapping;
  }
  const mappingPicker = getBlockPicker(pickerMapping);
  mappingPicker.dataset.boxId = boxData.id;
  mappingPicker.dataset.xpath = boxData.xpath;

  row.appendChild(mappingPicker);

  // Add a react-spectrum textbox for custom block name
  const customBlockNamePicker = document.createElement('sp-textfield');
  customBlockNamePicker.setAttribute('label', 'Custom Block Name');
  customBlockNamePicker.setAttribute('id', 'custom-block-name');
  customBlockNamePicker.setAttribute('placeholder', 'Custom Block Name');
  customBlockNamePicker.setAttribute('value', boxData.customBlockName || '');
  customBlockNamePicker.addEventListener('input', (e) => {
    boxData.customBlockName = e.target.value;
    saveSMCache();
  });
  row.appendChild(customBlockNamePicker);

  const deleteBtn = document.createElement('sp-button');
  deleteBtn.setAttribute('variant', 'negative');
  deleteBtn.setAttribute('size', 's');
  deleteBtn.setAttribute('icon-only', '');
  deleteBtn.innerHTML = '<sp-icon-delete slot="icon"></sp-icon-delete>';
  row.appendChild(deleteBtn);
  deleteBtn.addEventListener('click', (e) => {
    console.log(e);
    console.log('delete section', boxData.id);
    // row
    const rowEl = e.target.closest('.row');
    if (rowEl) {
      rowEl.remove();
      saveSMCache();
    }
  });

  row.querySelector('#sec-id').addEventListener('mouseenter', (e) => {
    // const target = e.target.nodeName === 'DIV' ? e.target : e.target.closest('.row');
    const target = e.target.closest('.row');
    if (target) {
      const id = target.dataset.boxId;
      const div = getElementByXpath(getContentFrame().contentDocument, target.dataset.xpath);
      div.scrollIntoViewIfNeeded({ behavior: 'smooth' });
      selectedBoxInSection.id = id;
    }
  });

  row.addEventListener('mouseleave', (e) => {
    const target = e.target.nodeName === 'DIV' ? e.target : e.target.closest('.row');
    if (target.nodeName === 'DIV') {
      selectedBoxInSection.id = null;
    }
  });

  return row;
}

function getMainFragmentPath(url) {
  const u = new URL(url);
  let mainPath = u.pathname.replace(/\.[^/.]+$/, '');
  if (mainPath === '/') {
    mainPath = '/index';
  }
  return mainPath;
}

export function setUIFragmentsFromCache(url) {
  // const cache = getSMCache();
  // const autoDetect = false;

  // const found = cache.find((item) => item.url === url && item.autoDetect === autoDetect);
  // if (found) {
  //   initUIFromData(found.mapping);
  // } else {
    addFragmentAccordionElement('/nav');
    addFragmentAccordionElement(getMainFragmentPath(url));
    addFragmentAccordionElement('/footer');
  // }
}

export function setUIFragmentsFromSections(url, sections) {
  const navFrgEl = addFragmentAccordionElement('/nav');
  const mainFrgEl = addFragmentAccordionElement(getMainFragmentPath(url));
  const footerFrgEl = addFragmentAccordionElement('/footer');

  // sections.forEach((section, idx) => {
  //   const row = getMappingRow(section, idx + 1);
  //   if (section.mapping === 'header') {
  //     addBlockInSection(row, navFrgEl);
  //   } else if (section.mapping === 'footer') {
  //     addBlockInSection(row, footerFrgEl);
  //   } else {
  //     addBlockInSection(row, mainFrgEl);
  //   }
  // });
}

export function useImportRules() {
  return importerConfig.fields['import-sm-use-rules'];
}

/**
 * sections ui elements
 */

export function addSectionAccordionElement(sectionId, target) {
  const id = target.lastElementChild
    ? parseInt(target.lastElementChild.dataset.id.split('-')[1], 10) + 1 : 1;

  const label = `section-${id.toString().padStart(2, '0')}`;
  const elId = `sm-frg-section-${sectionId.toString().padStart(2, '0')}-${id.toString().padStart(2, '0')}`;

  const el = document.createElement('div');
  el.id = elId;
  el.dataset.id = `${sectionId}-${id}`;
  el.dataset.path = label;
  el.className = 'sm-frg-section';
  el.setAttribute('open', '');
  el.innerHTML = `
  <sp-button id="delete-section" size="s" variant="negative" treatment="fill" role="button" icon-only>
    <sp-icon-delete slot="icon" dir="ltr" aria-hidden="true"></sp-icon-delete>
  </sp-button>
  <details open>
    <summary>${label}</summary>
    <div class="sm-frg-section-content">
      <div class="sm-frg-sections-title">
        <h2>Blocks</h2>   
        <sp-action-button size="s" quiet>
            <sp-icon-info slot="icon"></sp-icon-info>
            <sp-tooltip self-managed placement="bottom">
                * To add Blocks to this Section:<br>
                  1. Select the Section by clicking the gray rectangle on the left
                  2. click overlays in the page preview.
                <br><br>
                * If an overlay is blocking access to other ones, "shift + click" on it to remove it.
            </sp-tooltip>
        </sp-action-button>
      </div>
      <div class="sm-frg-section-blocks">
      </div>
      <sp-divider size="m"></sp-divider>
      <div class="sm-frg-section-settings-wrapper">
        <h4>Settings</h4>
        <div class="sm-frg-section-settings-container">
          <div>
            <sp-checkbox id="frg-section-sm-block-checkbox" size="s">Add <code>section-metadata</code> Block</sp-checkbox>
            <sp-textfield id="frg-section-section-metadata-style" size="s" placeholder="style property (ex. 'dark, center)" disabled>
            </sp-textfield>
          </div>
        </div>
      </div>
    </div>
  </details>
`;

  target.appendChild(el);

  const deleteBtnEl = el.querySelector('#delete-section');
  deleteBtnEl.addEventListener('click', () => {
    el.remove();
    saveSMCache();
  });

  el.addEventListener('click', (e) => {
    // handle sm section selection in fragment
    if (e.offsetX >= -25 && e.offsetX <= 0) {
      const evTarget = e.target || e.currentTarget;
      selectedSectionInFragment.id = evTarget.dataset.id;
    }
  });

  el.querySelector('#frg-section-sm-block-checkbox').addEventListener('change', (e) => {
    const cbEl = e.target;
    if (cbEl.checked) {
      el.querySelector('#frg-section-section-metadata-style').removeAttribute('disabled');
    } else {
      const tfEl = el.querySelector('#frg-section-section-metadata-style');
      tfEl.setAttribute('disabled', '');
      tfEl.value = '';
    }
    saveSMCache();
  });

  const settingsSMStyleTextfieldEl = el.querySelector('#frg-section-section-metadata-style');
  settingsSMStyleTextfieldEl.addEventListener('input', () => {
    saveSMCache();
  });

  saveSMCache();

  return el.dataset.id;
}

/**
 * blocks ui elements
 */

export function addBlockInSection(row, target) {
  const rows = SM_FRAGMENTS_CONTAINER.querySelectorAll('.row');
  const t = target || SM_FRAGMENTS_CONTAINER.querySelector('.sm-frg-section.selected');
  if (t) {
    const found = Array.from(rows).find((r) => r.dataset.boxId === row.dataset.boxId);
    if (!found) {
      const sectionContainerEl = t.querySelector('.sm-frg-section-blocks');
      const found2 = Array.from(sectionContainerEl.querySelectorAll('.row')).find((r) => parseInt(r.dataset.boxY, 10) > parseInt(row.dataset.boxY, 10));
      if (found2) {
        sectionContainerEl.insertBefore(row, found2);
      } else {
        sectionContainerEl.append(row);
      }
      saveSMCache();
    } else {
      const sectionEl = found.closest('.sm-frg-section');
      const frgEl = sectionEl.closest('.sm-fragment');
      alert.warning(`Block already added to Section [${frgEl.dataset.path}][${sectionEl.dataset.path.toUpperCase()}]`);
    }
  } else {
    alert.warning('Please select a Section first');
  }
}
