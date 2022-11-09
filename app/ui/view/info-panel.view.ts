class InfoPanel {
  model: {};
  container: HTMLElement | null;

  constructor(model: {}) {
    this.model = model;
    this.container = document.querySelector("#infoPanel");
  }

  render() {}
}

export default InfoPanel;
