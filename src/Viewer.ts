export class Viewer {
  private parent: HTMLElement;
  private iframe: HTMLIFrameElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  render() {
    this.createViewerIframe();
  }

  print = () => {
    console.log(this.iframe);
  };

  private createViewerIframe() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '1');
    this.parent.appendChild(iframe);
    this.iframe = iframe;
  }
}
