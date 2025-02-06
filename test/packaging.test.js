/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-env mocha */
import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom';
import he from 'he';
import assert from 'assert';
import { updateAssetReferences } from '../js/shared/jcr/packaging.js';
import { getFullAssetUrl } from '../js/shared/jcr/packaging.utils.js';

const PAGE_URL = 'https://main--stini--bhellema.hlx.page';
const ASSET_FOLDER_NAME = 'plush';
const ORIGINAL_XML_PATH = './fixtures/jcr/plush-original.xml';
const IMAGE_MAPPING_PATH = './fixtures/jcr/plush-image-mapping.json';
const PROCESS_XML_PATH = './fixtures/jcr/plush-processed.xml';

const loadFile = async (file) => readFile(new URL(file, import.meta.url), 'utf-8');

// Helper function to normalize XML for comparison
const parseXmlWithJsdom = (xmlString) => new JSDOM(xmlString, { contentType: 'text/xml' }).window.document;

// Helper function to initialize image URL mapping from test data
const getImageUrlMap = async () => loadFile(IMAGE_MAPPING_PATH)
  .then((response) => JSON.parse(response))
  .then((data) => new Map(Object.entries(data)))
  // eslint-disable-next-line no-console
  .catch((error) => console.error('Error loading JSON:', error));

// Helper function to initialize image URL keys map from test data
const getImageUrlKeysMap = async () => loadFile(IMAGE_MAPPING_PATH)
  .then((response) => JSON.parse(response))
  .then((data) => new Map(Object.keys(data).map((key) => [key, ''])))
  // eslint-disable-next-line no-console
  .catch((error) => console.error('Error loading JSON:', error));

// Test suite for jcr-path-mapping
describe('jcr-path-mapping', () => {
  before(() => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.DOMParser = new JSDOM().window.DOMParser;
    global.document = dom.window.document;
    global.window = dom.window;
    global.XMLSerializer = dom.window.XMLSerializer;
    global.he = he;
  });

  // compare the processed xml with the expected xml
  it('verify asset paths updates in xml', async () => {
    const originalXml = await loadFile(ORIGINAL_XML_PATH);
    const expectedProcessedXml = await loadFile(PROCESS_XML_PATH);

    // Init image URL map (original urls only, jcr paths will be added by updateAssetReferences)
    const imageUrlMapping = await getImageUrlKeysMap();
    const actualProcessedXml = await updateAssetReferences(
      originalXml,
      PAGE_URL,
      ASSET_FOLDER_NAME,
      imageUrlMapping,
    );

    // Parse both XMLs using jsdom
    const actualXmlDom = parseXmlWithJsdom(actualProcessedXml);
    const expectedXmlDom = parseXmlWithJsdom(expectedProcessedXml);

    // Assert that processed XML matches expected XML
    assert.strictEqual(
      actualXmlDom.documentElement.outerHTML,
      expectedXmlDom.documentElement.outerHTML,
      'Processed XML does not match expected XML',
    );
  });

  // compare the generated image mapping with the expected image mapping
  it('verify generated image mapping', async () => {
    const originalXml = await loadFile(ORIGINAL_XML_PATH);
    const expectedImageUrlMapping = await getImageUrlMap();
    // Init image URL map (original urls only, jcr paths will be added by updateAssetReferences)
    const actualImageUrlMapping = await getImageUrlKeysMap();

    await updateAssetReferences(originalXml, PAGE_URL, ASSET_FOLDER_NAME, actualImageUrlMapping);

    // Compare the two maps
    assert.strictEqual(
      actualImageUrlMapping.size,
      expectedImageUrlMapping.size,
      'Image mapping sizes do not match',
    );

    // Array.from(map.entries()).forEach(), which avoids ESLint's no-restricted-syntax rule.
    Array.from(expectedImageUrlMapping.entries()).forEach(([key, expectedValue]) => {
      // the original image urls may be relative, so we need to get the full url for comparison
      const actualValue = actualImageUrlMapping.get(getFullAssetUrl(key, PAGE_URL));
      assert.strictEqual(
        actualValue,
        expectedValue,
        `Mismatch for key: ${key}, expected: ${expectedValue}, got: ${actualValue}`,
      );
    });
  });
});
