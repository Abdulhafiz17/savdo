export const CONTENT_TOP = 50;

export const contentTop = `${CONTENT_TOP}px`;

import { ref, computed } from 'vue'

export const collapsed = ref(false)
export let toggleSidebar = () => (collapsed.value = !collapsed.value)
export let close_sidebar

export const SIDEBAR_WIDTH = 50
export const SIDEBAR_WIDTH_COLLAPSED = 0
export let sidebarWidth = computed(() => `${collapsed.value ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`)
export let sidebarPadding = sidebarWidth

function myFunction(x) {
  if (x.matches) {
    collapsed.value = true;
    sidebarPadding = 0
    close_sidebar = () => (collapsed.value = !collapsed.value)
  } else {
    collapsed.value = false;
  }
}

var x = window.matchMedia("(max-width: 800px)");
myFunction(x); // Call listener function at run time
x.addListener(myFunction); // Attach listener function on state changesА