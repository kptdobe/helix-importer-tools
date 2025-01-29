/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global JSZip */
import {
  getPageProperties,
  getPageContentChildren,
  getPropertiesXml,
  getFilterXml,
  getPackageName,
  getJcrPagePath,
  traverseAndUpdateAssetReferences,
} from './packaging.utils.js';
import { saveFile } from '../filesystem.js';

// cache for pages
let jcrPages = [];

const init = () => {
  jcrPages = [];
};

const addPage = async (page, dir, prefix, zip) => {
  zip.file(page.contentXmlPath, page.processedXml);
  await saveFile(dir, `${prefix}/${page.contentXmlPath}`, page.processedXml);
};

// Updates the asset references to point to their respective JCR paths
export const getProcessedJcr = async (xml, pageUrl, assetFolderName, imageMappings) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // if parsing fails, log the error
  if (doc.getElementsByTagName('parsererror').length > 0) {
    // eslint-disable-next-line no-console
    const errors = doc.getElementsByTagName('parsererror');
    // eslint-disable-next-line no-restricted-syntax
    for (const error of errors) {
      console.error('Error parsing the XML document for the JCR page ', pageUrl, error.textContent);
    }
    // console.error('Error parsing the XML document for the JCR page ', pageUrl);
    return xml;
  }

  // Start traversal from the document root and update the asset references
  traverseAndUpdateAssetReferences(doc.documentElement, pageUrl, assetFolderName, imageMappings);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
};

export const getJcrPages = async (pages, siteFolderName, assetFolderName, imageMappings) => {
  if (jcrPages.length === 0) {
    jcrPages = Promise.all(pages.map(async (page) => ({
      path: page.path,
      sourceXml: page.data,
      pageProperties: getPageProperties(page.data),
      pageContentChildren: getPageContentChildren(page.data),
      processedXml: await getProcessedJcr(page.data, page.url, assetFolderName, imageMappings),
      jcrPath: getJcrPagePath(page.path, siteFolderName),
      contentXmlPath: `jcr_root${getJcrPagePath(page.path, siteFolderName)}/.content.xml`,
      url: page.url,
    })));
  }
  return jcrPages;
};

const addFilterXml = async (dir, prefix, zip) => {
  const { filterXmlPath, filterXml } = await getFilterXml(jcrPages);
  zip.file(filterXmlPath, filterXml);
  await saveFile(dir, `${prefix}/${filterXmlPath}`, filterXml);
};

const addPropertiesXml = async (dir, prefix, zip, packageName) => {
  const { propXmlPath, propXml } = getPropertiesXml(packageName);
  zip.file(propXmlPath, propXml);
  await saveFile(dir, `${prefix}/${propXmlPath}`, propXml);
};

const getEmptyAncestorPages = (pages) => {
  const seenAncestors = new Set();
  const jcrPaths = pages.map((page) => page.jcrPath);
  const emptyAncestors = [];
  const ancestorXml = `<?xml version="1.0" encoding="UTF-8"?>
      <jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0" jcr:primaryType="cq:Page">
          <jcr:content cq:template="/libs/core/franklin/templates/page" jcr:primaryType="cq:PageContent" sling:resourceType="core/franklin/components/page/v1/page"/>
      </jcr:root>`;

  jcrPaths.forEach((pagePath) => {
    const pathSegments = pagePath.split('/');
    let ancestorPath = '/content';

    for (let i = 2; i < pathSegments.length - 1; i += 1) {
      ancestorPath += `/${pathSegments[i]}`;

      if (!seenAncestors.has(ancestorPath)) {
        seenAncestors.add(ancestorPath);
        emptyAncestors.push({
          jcrPath: ancestorPath,
          contentXmlPath: `jcr_root${ancestorPath}/.content.xml`,
          processedXml: ancestorXml,
        });
      }
    }
  });

  return emptyAncestors;
};

/**
 * Creates a JCR content package from a directory containing pages.
 * @param {*} dir - The directory handle
 * @param {Array} pages - An array of pages
 * @param {Map} imageMappings - An map to store the image urls and their corresponding jcr paths
 * @param {string} siteFolderName - The name of the site folder in AEM
 * @param {string} assetFolderName - The name of the asset folder in AEM
 * @returns {Promise} The file handle for the generated package.
 */
export const createJcrPackage = async (
  dir,
  pages,
  imageMappings,
  siteFolderName,
  assetFolderName,
) => {
  if (pages.length === 0) {
    return;
  }

  init();
  const packageName = getPackageName(pages, siteFolderName);
  const zip = new JSZip();
  const prefix = 'jcr';

  // add the pages
  jcrPages = await getJcrPages(pages, siteFolderName, assetFolderName, imageMappings);
  for (let i = 0; i < jcrPages.length; i += 1) {
    const page = jcrPages[i];
    // eslint-disable-next-line no-await-in-loop
    await addPage(page, dir, prefix, zip);
  }

  // add the empty ancestor pages
  const emptyAncestorPages = getEmptyAncestorPages(jcrPages);
  for (let i = 0; i < emptyAncestorPages.length; i += 1) {
    const page = emptyAncestorPages[i];
    // eslint-disable-next-line no-await-in-loop
    await addPage(page, dir, prefix, zip);
  }

  // add the filter.xml file
  await addFilterXml(dir, prefix, zip);

  // add the properties.xml file
  await addPropertiesXml(dir, prefix, zip, packageName);

  // save the zip file
  await zip.generateAsync({ type: 'blob' })
    .then(async (blob) => saveFile(dir, `${packageName}.zip`, blob));
};
