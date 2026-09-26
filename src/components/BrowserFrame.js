import { getProjectImage } from '../utils/images.js';

export function BrowserFrame({ domain, imageFile, alt, tall = false }) {
  const src = getProjectImage(imageFile);
  return `
    <div class="browser-frame ${tall ? 'browser-frame--tall' : ''}">
      <div class="browser-frame__bar">
        <span class="browser-frame__dots" aria-hidden="true">
          <span class="browser-frame__dot browser-frame__dot--red"></span>
          <span class="browser-frame__dot browser-frame__dot--yellow"></span>
          <span class="browser-frame__dot browser-frame__dot--green"></span>
        </span>
        <span class="browser-frame__domain mono">${domain}</span>
      </div>
      <div class="browser-frame__viewport">
        ${
          src
            ? `<img src="${src}" alt="${alt}" loading="lazy" class="browser-frame__img" />`
            : `<div class="browser-frame__placeholder mono">${domain}</div>`
        }
      </div>
    </div>
  `;
}
