// Illustration for the "theme designed from scratch" service card:
// a page wireframe on one side, the Liquid it becomes on the other.
// Kept direction-neutral (dir="ltr") because code always reads left to right.
export function DesignToTheme(label) {
  return `
    <div class="design-to-theme" role="img" aria-label="${label}" dir="ltr">
      <div class="design-to-theme__frame">
        <span class="design-to-theme__block design-to-theme__block--hero"></span>
        <span class="design-to-theme__row">
          <span class="design-to-theme__block"></span>
          <span class="design-to-theme__block"></span>
          <span class="design-to-theme__block"></span>
        </span>
        <span class="design-to-theme__line"></span>
      </div>
      <span class="design-to-theme__arrow" aria-hidden="true"></span>
      <pre class="design-to-theme__code" aria-hidden="true">{% schema %}
  "name": "Hero",
  "blocks": [ … ]
{% endschema %}</pre>
    </div>
  `;
}
