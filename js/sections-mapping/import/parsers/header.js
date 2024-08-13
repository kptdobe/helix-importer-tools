export default function headerParser(el, { document, params, allMappings }) {
  const containerEl = document.createElement('div');

  const brandEl = document.createElement('div');
  const bodyWidth = allMappings.sections[0]?.blocks[0]?.width;
  const originURL = new URL(params.originalURL).origin;

  const brandLogoMapping = [
    {
      checkFn: (e) => e.querySelector('a > img'),
      parseFn: (e, targetEl, x) => {
        if (bodyWidth && x < bodyWidth / 2) {
          targetEl.append(e);
          return true;
        }
        return false;
      },
    },
    {
      checkFn: (e) => e.querySelector('picture + br + a, img + br + a'),
      parseFn: (e, targetEl, x) => {
        if (bodyWidth && x < bodyWidth / 2) {
          const imgEl = e.closest('picture, img');
          if (imgEl) {
            targetEl.append(imgEl);
          }
          return true;
        }
        return false;
      },
    },
    {
      checkFn: (e) => e.querySelector('img'),
      parseFn: (e, targetEl, x) => {
        if (bodyWidth && x < bodyWidth / 2) {
          targetEl.append(e);
          return true;
        }
        return false;
      },
    },
    {
      checkFn: (e) => e.querySelector(`a[href="/"], a[href="${originURL}"], a[href="${originURL}/"]`),
      parseFn: (e, targetEl, x) => {
        if (bodyWidth && x < bodyWidth / 2) {
          targetEl.append(e);
          return true;
        }
        return false;
      },
    },
    {
      checkFn: (e) => {
        // fetch favicon
        const resp = fetch('/favicon.ico');
        if (resp && resp.status === 200) {
          const logoEl = document.createElement('img');
          logoEl.src = '/favicon.ico';
          return logoEl;
        }
        return null;
      },
      parseFn: (e, targetEl) => {
        targetEl.append(e);
        return true;
      },
    },
  ];

  brandLogoMapping.some((m) => {
    const logoEl = m.checkFn(el);
    if (logoEl) {
      let x = 0;
      try {
        x = JSON.parse(logoEl.closest('div')?.getAttribute('data-hlx-imp-rect')).x;
      } catch (e) {
        console.error('error', e);
      }

      return m.parseFn(logoEl, brandEl, x);
    }
    return false;
  });

  // get navigation content
  const navEl = document.createElement('div');
  const menuEl = [...el.querySelectorAll('ol,ul')].filter((f) => f.parentElement.closest('ol,ul') === null).reduce(
    (acc, listEl) => {
      const items = [...listEl.querySelectorAll('li')].filter((liEl) => {
        liEl.querySelectorAll('script', 'style', '[data-hlx-imp-hidden-div]').forEach((e) => e.remove());
        return liEl.textContent.replaceAll('\n', '').trim().length > 0;
      });

      let x = null;
      try {
        x = JSON.parse(listEl.closest('div')?.getAttribute('data-hlx-imp-rect')).x;
      } catch (e) {
        console.error('error', e);
      }

      console.log('items', items.length, acc?.children.length, x, bodyWidth, listEl);

      if (
        items.length > 1
        && (!acc || items.length > acc.children.length)
        && (!bodyWidth || (x && x < bodyWidth / 2))
      ) {
        return listEl;
      }
      return acc;
    },
    null,
  );
  if (menuEl) {
    navEl.append(menuEl);
  }

  const listEl = el.querySelector('ol,ul');
  if (listEl) {
    navEl.append(document.createElement('hr'));
    navEl.append(listEl);
    navEl.append(document.createElement('hr'));
  }

  const toolsEl = document.createElement('div');
  toolsEl.append(...el.children);

  let hiddenEl;
  while (hiddenEl = toolsEl.querySelector('[data-hlx-imp-hidden-div]')) {
    hiddenEl.remove();
  }

  containerEl.append(brandEl);
  containerEl.append(navEl);
  containerEl.append(toolsEl);

  return containerEl;
}
