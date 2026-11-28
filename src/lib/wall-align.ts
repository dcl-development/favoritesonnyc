/** Rounds each `.wall-region` on the home page to whole block courses. Shared by WallAlign and SignStrips. */

export function alignHomeWall(): void {
  const home = document.querySelector<HTMLElement>(".home");
  if (!home) return;
  const course = Number.parseFloat(
    getComputedStyle(document.body).getPropertyValue("--wall-course"),
  );
  if (!course) return;

  const regions = Array.from(home.querySelectorAll<HTMLElement>(".wall-region"));
  for (const region of regions) {
    const computedMin = getComputedStyle(region).minHeight;
    region.style.minHeight = "0px";
    const natural = region.getBoundingClientRect().height;
    const courses = Math.max(1, Math.ceil(natural / course - 1e-3));
    const next = `${courses * course}px`;
    region.style.minHeight = next;
    if (computedMin === next && !region.style.getPropertyPriority("min-height")) {
      region.style.removeProperty("min-height");
    }
  }
}