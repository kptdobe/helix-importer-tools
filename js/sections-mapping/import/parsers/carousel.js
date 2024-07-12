import { extractBackground, getNSiblingsDivs } from '../import.utils.js';

/* global WebImporter */
export default function carouselParser(el, { mapping, document }) {
  const columns = getNSiblingsDivs(el, document, (n) => n > 2);
  if (columns) {
    const children = columns.map((c) => {
      const imgEl = extractBackground(c, document, { strategy: 'image' }) || c.querySelector('img') || null;
      console.log('imgEl', imgEl);
      return [imgEl, c];
    });
    const tableHeading = mapping.variant ? 'carousel-' + mapping.variant : 'carousel';

    const block = WebImporter.DOMUtils.createTable([
      [tableHeading],
      ...children,
    ], document);
    return block;
  }

  return null;
}
