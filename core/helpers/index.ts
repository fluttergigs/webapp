// Generic helper to create a delete mode for any type T
export const createDeleteMode = <T>() => {
  const isEnabled = ref(false);
  const selectedItem = ref<T | null>(null);

  function enable(item: T) {
    selectedItem.value = item;
    isEnabled.value = true;
  }

  function disable() {
    selectedItem.value = null;
    isEnabled.value = false;
  }

  function toggle() {
    isEnabled.value = !isEnabled.value;
  }

  return {
    isEnabled,
    selectedItem,
    toggle,
    enable,
    disable,
  };
};

export function createModalToggle() {
  const isVisible = ref(false);

  function open() {
    isVisible.value = true;
  }

  function close() {
    isVisible.value = false;
  }

  function toggle() {
    isVisible.value = !isVisible.value;
  }

  return {
    isVisible,
    open,
    close,
    toggle,
  };
}

export function createUpdateModal<T>() {
  const isVisible = ref(false);
  const selectedItem = ref<T | null>(null);

  function open(item: T) {
    selectedItem.value = item;
    isVisible.value = true;
  }

  function close() {
    selectedItem.value = null;
    isVisible.value = false;
  }

  function toggle() {
    isVisible.value = !isVisible.value;
  }

  return {
    isVisible,
    selectedItem,
    open,
    close,
    toggle,
  };
}
