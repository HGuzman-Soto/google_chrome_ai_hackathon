import { AppState } from './app_state.js';

export class StateManager {
  constructor() {
    this.currentState = AppState.INSTRUCTIONS; // Start in the Instructions state
    this.viewContainer = document.getElementById('app'); // Main container for views

    if (!this.viewContainer) {
      console.error('No element with ID #app found!');
    }
  }

  // Method to transition to a new state
  transitionTo(state) {
    if (!Object.values(AppState).includes(state)) {
      console.error(`Invalid state: ${state}`);
      return;
    }

    console.log(`Transitioning to state: ${state}`);
    this.currentState = state;
    this.renderView();
  }

  // Method to render the view for the current state
  renderView() {
    if (!this.viewContainer) {
      console.error('No view container available for rendering!');
      return;
    }

    console.log(`Rendering view for state: ${this.currentState}`);
    this.viewContainer.innerHTML = ''; // Clear the current view

    switch (this.currentState) {
      case AppState.INSTRUCTIONS:
        this.renderInstructionsView();
        break;
      case AppState.TEXT_INPUT:
        this.renderTextInputView();
        break;
      case AppState.GENERATING_QUIZ:
        this.renderGeneratingQuizView();
        break;
      case AppState.QUIZ_SCREEN:
        this.renderQuizView();
        break;
      case AppState.QUIZ_RESULTS_HOME:
        this.renderQuizResultsView();
        break;
      case AppState.ERROR_SCREEN:
        this.renderErrorView();
        break;
      default:
        console.error(`Unknown state: ${this.currentState}`);
    }
  }

  // Methods to render each view
  renderInstructionsView() {
    this.viewContainer.innerHTML = '<h2>Welcome to the Quiz App</h2><p>Follow the instructions to get started.</p>';
  }

  renderTextInputView() {
    this.viewContainer.innerHTML = '<h2>Text Input</h2><p>Select or input text to generate the quiz.</p>';
  }

  renderGeneratingQuizView() {
    this.viewContainer.innerHTML = '<h2>Generating Quiz...</h2><p>Please wait while we generate the quiz.</p>';
  }

  renderQuizView() {
    this.viewContainer.innerHTML = '<h2>Quiz Screen</h2><p>This is the quiz view.</p>';
  }

  renderQuizResultsView() {
    this.viewContainer.innerHTML = '<h2>Quiz Results</h2><p>Here are the results.</p>';
  }

  renderErrorView() {
    this.viewContainer.innerHTML = '<h2>An Error Occurred</h2><p>Something went wrong. Please try again later.</p>';
  }
}
