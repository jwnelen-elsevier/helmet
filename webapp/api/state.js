class State {
  constructor() {
    this.state = {
      isLoaded: false,
      model: {
        model_checkpoint: "",
        tokenizer_checkpoint: "",
        model_type: "",
      },
    };
  }

  getState() {
    return this.state;
  }

  getIsloaded() {
    return this.state.isLoaded;
  }

  getModel() {
    return this.state.model;
  }

  setModel(model) {
    this.state.model = model;
    this.state.isLoaded = true;
  }
}
module.exports = State;
