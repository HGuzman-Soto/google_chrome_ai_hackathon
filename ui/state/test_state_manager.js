import { AppState } from './app_state.js';
import { StateManager } from './state_manager.js';

document.addEventListener('DOMContentLoaded', () => {
  const stateManager = new StateManager();

  // Render the initial view
  stateManager.renderView();

  // Add event listeners to buttons for state transitions
  document.querySelectorAll('.control-buttons button').forEach(button => {
    button.addEventListener('click', (event) => {
      const newState = event.target.getAttribute('data-state');
      console.log(`Button clicked for state: ${newState}`);
      if (AppState[newState]) {
        stateManager.transitionTo(AppState[newState]);
      } else {
        console.error(`Invalid state: ${newState}`);
      }
    });
  });
});
