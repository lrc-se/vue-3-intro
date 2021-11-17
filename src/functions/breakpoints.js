import { reactive, readonly } from "@vue/reactivity";

const breakpoints = reactive({
  isMobile: false,
  isTablet: false,
  isDesktop: false
});

function update() {
  breakpoints.isMobile = window.innerWidth <= 600;
  breakpoints.isTablet = window.innerWidth < 1024;
  breakpoints.isDesktop = window.innerWidth >= 1024;
}

window.addEventListener("resize", update);
update();

export function useBreakpoints() {
  return readonly(breakpoints);
}
