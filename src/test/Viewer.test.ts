import anyTest, {TestInterface} from 'ava';
import {Viewer} from '../Viewer';

const test = anyTest as TestInterface<{
  parentDiv: HTMLElement;
}>;

test.beforeEach(t => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  t.context = {
    parentDiv: div,
  };
});

test('test render() creates iframe', t => {
  const {parentDiv} = t.context;
  const viewer = new Viewer(parentDiv);
  viewer.render();
  t.assert(parentDiv.querySelector(`iframe`));
});
