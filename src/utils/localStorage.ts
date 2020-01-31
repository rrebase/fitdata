export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("fitdata-state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: any) => {
  const serializedState = JSON.stringify(state);
  localStorage.setItem("fitdata-state", serializedState);
};

export default { loadState, saveState };
