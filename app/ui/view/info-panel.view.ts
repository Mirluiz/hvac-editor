class InfoPanel {
  model: {};
  container: HTMLElement | null;
  pipeModeFrame: HTMLElement | null;
  pipeType: NodeListOf<HTMLInputElement> | null;

  constructor(model: {}) {
    this.model = model;
    this.container = document.querySelector("#infoPanel");
    this.pipeModeFrame = document.querySelector("#pipeModeFrame");
    this.pipeType = document.querySelectorAll("[name='mode-switch-pipe']");
  }

  render() {}
}

export default InfoPanel;
