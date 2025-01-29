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
import { getProcessedJcr } from '../js/shared/jcr/packaging.js';
import { JSDOM } from 'jsdom';

const loadFile = async (file) => readFile(new URL(file, import.meta.url), 'utf-8');

describe('md2html', () => {
  before(() => {
    global.DOMParser = new JSDOM().window.DOMParser;
  });

  it('plush', async () => {
    const xml = await loadFile('./fixtures/jcr/plush.xml');
    const imageMappingFile = await loadFile('./fixtures/jcr/plush-image-mapping.json');
    const imageMapping = JSON.parse(imageMappingFile);
    // generate a Map object from the json object imageMapping
    const imageMappingMap = new Map(Object.entries(imageMapping));
    await getProcessedJcr(xml, 'https://main--stini--bhellema.hlx.page', 'assetFolderName', imageMappingMap);
  });
});
