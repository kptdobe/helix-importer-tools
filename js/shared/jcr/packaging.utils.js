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
/* global Handlebars */
/* global he */

// Unescape XML entities
Handlebars.registerHelper('unescapeXML', (escapedString) => new Handlebars.SafeString(he.decode(escapedString)));
const template = Handlebars.compile('{{unescapeXML text}}');

/**
 * Get the properties of a page from the jcr:content node.
 * @param {string} xml the XML string of the page
 * @returns the properties of the jcr:content node
 */
export const getPageProperties = (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // get the jcr:content node properties
  const namespaceURI = 'http://www.jcp.org/jcr/1.0';
  const localName = 'content';
  const jcrContent = doc.getElementsByTagNameNS(namespaceURI, localName)[0];
  // eslint-disable-next-line max-len
  // return jcrContent ? jcrContent.getAttributeNames() : [];
  return jcrContent ? Array.from(jcrContent.attributes).map((attr) => attr.name) : [];
};

/**
 * Get the children of the jcr:content node.
 * @param {string} xml the XML string of the page
 * @returns the children of the jcr:content node
 */
export const getPageContentChildren = (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  // get the names of the jcr:content node children
  const namespaceURI = 'http://www.jcp.org/jcr/1.0';
  const localName = 'content';
  const jcrContent = doc.getElementsByTagNameNS(namespaceURI, localName)[0];
  const children = jcrContent?.children;
  return children ? Array.from(children).map((child) => child.tagName) : [];
};

/**
 * Generate the properties.xml file for the content package.
 * @param {string} packageName the name of the package
 * @returns the properties.xml file
 */
export const getPropertiesXml = (packageName) => {
  const author = 'anonymous';
  const now = new Date().toISOString();
  const propXml = `<?xml version='1.0' encoding='UTF-8'?>
      <!DOCTYPE properties SYSTEM 'http://java.sun.com/dtd/properties.dtd'>
      <properties>
      <comment>FileVault Package Properties</comment>
      <entry key='description'></entry>
      <entry key='generator'>org.apache.jackrabbit.vault:3.7.1-T20231005151103-335689a8</entry>
      <entry key='packageType'>content</entry>
      <entry key='lastWrappedBy'>${author}</entry>
      <entry key='packageFormatVersion'>2</entry>
      <entry key='group'>my_packages</entry>
      <entry key='created'>${now}</entry>
      <entry key='lastModifiedBy'>${author}</entry>
      <entry key='buildCount'>1</entry>
      <entry key='lastWrapped'>${now}</entry>
      <entry key='version'></entry>
      <entry key='dependencies'></entry>
      <entry key='createdBy'>${author}</entry>
      <entry key='name'>${packageName}</entry>
      <entry key='lastModified'>${now}</entry>
      </properties>`;
  const propXmlPath = 'META-INF/vault/properties.xml';
  return { propXmlPath, propXml };
};

/**
 * Get the filter.xml file for the content package.
 * @param {Array} jcrPages the JCR pages to include in the package
 * @returns the filter.xml file
 */
export const getFilterXml = async (jcrPages) => {
  const pageFilters = jcrPages.reduce((acc, page) => `${acc}<filter root='${page.jcrPath}'>\n</filter>\n`, '');

  const filterXml = `<?xml version='1.0' encoding='UTF-8'?>
    <workspaceFilter version='1.0'>
      ${pageFilters}
    </workspaceFilter>`;
  const filterXmlPath = 'META-INF/vault/filter.xml';
  return { filterXmlPath, filterXml };
};

/**
 * Get the package name based on the site folder name and the pages.
 * @param {Array} pages the pages to be included in the package
 * @param {string} siteFolderName the name of the site folder in AEM
 * @returns the package name
 */
export const getPackageName = (pages, siteFolderName) => {
  if (pages.length === 1) {
    const pageName = pages[0].path.split('/').pop();
    return `${siteFolderName}_${pageName}`;
  }
  return siteFolderName;
};

/**
 * Get the JCR page path based on the site folder name and the path.
 * @param {string} path the path of the page
 * @param {string} siteFolderName the name of the site folder in AEM
 * @returns the JCR page path
 */
export const getJcrPagePath = (path, siteFolderName) => {
  if (path.startsWith('/content/')) {
    // replace the 2nd token with the site folder name
    const tokens = path.split('/');
    tokens.splice(2, 1, siteFolderName);
    return tokens.join('/');
  }
  // Remove any leading "/" from the path
  // eslint-disable-next-line no-param-reassign
  path = path.replace(/^\/+/, '');
  return `/content/${siteFolderName}/${path}`;
};

/**
 * Get all elements with the "fileReference" attribute.
 * @param {string} xml - The XML string to parse.
 * @returns {Array} Array of objects containing image element and attribute name.
 */
export const getBlocks = (doc) => {
  // Find all elements that have the 'fileReference' attribute
  const allElements = doc.getElementsByTagName('*'); // Get all elements
  const items = [];

  for (let i = 0; i < allElements.length; i += 1) {
    const element = allElements[i];

    // Check if the element has the 'fileReference' attribute
    if (element.getAttribute('sling:resourceType') === 'core/franklin/components/block/v1/block') {
      items.push(element);
    }
  }

  return items;
};

/**
 * Get the JCR path for an asset.
 * @param {string} assetUrl - The URL of the asset
 * @param {string} assetFolderName - The name of the asset folder in AEM
 * @returns the JCR path for the asset
 */
const getJcrAssetPath = (assetUrl, assetFolderName) => {
  // add the query parameters to the path as _name1value1_name2value2
  const extension = (assetUrl.pathname.includes('.')) ? `.${assetUrl.pathname.split('.').pop()}` : '';
  let path = assetUrl.pathname.replace(extension, '');
  if (path.startsWith('/content/dam/')) {
    // replace the 3rd token with the asset folder name
    const tokens = path.split('/');
    tokens.splice(3, 1, assetFolderName);
    return `${tokens.join('/')}${extension}`;
  }
  // const suffix = Array.from(params.keys()).map((key) => `_${key}${params.get(key)}`).join('');
  const suffix = '';
  // replace media_ with media1_ in path to avoid conflicts with the media folder
  path = path.replace('/media_', '/media1_');

  return `/content/dam/${assetFolderName}${path}${suffix}${extension}`;
};

/**
 * Get the JCR path for a asset reference.
 * @param {string} assetReference the asset reference
 * @param {string} pageUrl the URL of the page
 * @param {string} assetFolderName the name of the asset folder in AEM
 * @returns the JCR path for the file reference
 */
const getJcrAssetRef = (assetReference, pageUrl, assetFolderName) => {
  if (!assetReference || assetReference === '') {
    return null;
  }
  const host = new URL(pageUrl).origin;
  let jcrPath = assetReference;
  let url;
  const pagePath = new URL(pageUrl).pathname;

  if (assetReference.startsWith('http')) {
    // external fileReference
    url = new URL(assetReference);
    jcrPath = getJcrAssetPath(url, assetFolderName);
  } else if (assetReference.startsWith('/content/dam/')) {
    // DAM fileReference
    url = new URL(`${host}${assetReference}`);
    jcrPath = getJcrAssetPath(url, assetFolderName);
  } else if (assetReference.startsWith('/')) {
    // absolute fileReference
    url = new URL(`${host}${assetReference}`);
    jcrPath = getJcrAssetPath(url, assetFolderName);
  } else if (assetReference.startsWith('./')) {
    // relative fileReference: use the page path to make it an absolute path
    const parentPath = pagePath.substring(0, pagePath.lastIndexOf('/'));
    // eslint-disable-next-line no-param-reassign
    url = new URL(`${host}${parentPath}${assetReference.substring(1)}`);
    jcrPath = getJcrAssetPath(url, assetFolderName);
  }
  return jcrPath;
};

/**
 * Converts an asset reference (relative, absolute, or DAM path) into a fully qualified URL
 * based on the page URL.
 * @param {string} assetReference - The asset reference (relative, absolute, or DAM path).
 * @param {string} pageUrl - The full URL of the current page.
 * @returns {string|null} - The fully qualified URL or null if the input is invalid.
 */
function getFullAssetUrl(assetReference, pageUrl) {
  if (!assetReference) return null;

  const pageUrlObj = new URL(pageUrl); // Parse only once
  const host = pageUrlObj.origin;

  // Already a full URL, return as is
  if (assetReference.startsWith('http://') || assetReference.startsWith('https://')) {
    return assetReference;
  }

  // If the asset reference starts with './', it is a relative file path
  if (assetReference.startsWith('./')) {
    return new URL(assetReference, pageUrlObj.href).pathname;
  }

  // Absolute asset reference, appending the asset path to the host
  return `${host}${assetReference}`;
}

/**
 * Update the JCR asset map with the jcr asset path.
 * @param {Map} jcrAssetMap - The map of asset references to their corresponding JCR paths
 * @param {string} originalPath - The original asset path
 * @param {string} updatedAssetPath - The updated jcr asset path
 * @param {string} pageUrl - The URL of the page
 */
function updateJcrAssetMap(jcrAssetMap, originalPath, updatedAssetPath, pageUrl) {
  if (originalPath.startsWith('./') || originalPath.startsWith('/')) {
    const fullyQualifiedUrl = getFullAssetUrl(originalPath, pageUrl);
    jcrAssetMap.delete(originalPath);
    jcrAssetMap.set(fullyQualifiedUrl, updatedAssetPath);
  } else {
    jcrAssetMap.set(originalPath, updatedAssetPath);
  }
}

/**
 * Traverse the DOM tree and update the asset references to point to the JCR paths.
 * @param {*} node - The node to traverse
 * @param {string} pageUrl - The URL of the page
 * @param {string} assetFolderName - The name of the asset folder in AEM
 * @param {Map} jcrAssetMap - A map of asset references to their corresponding JCR paths
 */
export const traverseAndUpdateAssetReferences = (node, pageUrl, assetFolderName, jcrAssetMap) => {
  if (node.nodeType === 1) { // Element node
    // eslint-disable-next-line no-restricted-syntax
    for (const attr of node.attributes) {
      const attrValue = node.getAttribute(attr.name);
      // Unescape HTML entities
      let unescapedAttrValue = Handlebars.Utils.escapeExpression
        ? template({ text: attrValue }) : attrValue;
      let modified = false;
      // eslint-disable-next-line no-restricted-syntax
      for (const originalPath of jcrAssetMap.keys()) {
        if (unescapedAttrValue.includes(originalPath)) {
          const jcrAssetPath = getJcrAssetRef(originalPath, pageUrl, assetFolderName);
          // update the map with the new jcr path
          updateJcrAssetMap(jcrAssetMap, originalPath, jcrAssetPath, pageUrl);
          // update the attribute value with the new jcr path
          unescapedAttrValue = unescapedAttrValue.replace(originalPath, jcrAssetPath);
          modified = true;
        }
      }
      // if any image path was found and updated in the attribute value, escape and set it back
      if (modified) {
        const escapedAttrValue = Handlebars.Utils.escapeExpression
          ? Handlebars.Utils.escapeExpression(unescapedAttrValue) : unescapedAttrValue;
        // update the attribute value
        node.setAttribute(attr.name, escapedAttrValue);
      }
    }
  }
  // Traverse child nodes
  for (let i = 0; i < node.childNodes.length; i += 1) {
    traverseAndUpdateAssetReferences(node.childNodes[i], pageUrl, assetFolderName, jcrAssetMap);
  }
};
