import {Viewer} from '@ampproject/email-viewer/dist/viewer.mjs';

const container = document.querySelector('#viewer');
const viewer = new Viewer(container);
viewer.render();
