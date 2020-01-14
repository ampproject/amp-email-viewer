import { modules as preprocessingModules } from '../../preprocessing/preprocessing-modules/index';
import { preprocessAMP } from '../../preprocessing/preprocess';
import { testdata } from './testdata';

describe('preprocessing', () => {
  const spiedModules: {
    [key: string]:
      | jest.SpyInstance<string | Promise<string>>
      | jest.SpyInstance<void | Promise<void>>;
  } = {};

  beforeEach(() => {
    for (const module of preprocessingModules) {
      if ('processText' in module) {
        spiedModules[module.name] = jest.spyOn(module, 'processText');
      } else {
        spiedModules[module.name] = jest.spyOn(module, 'processDocument');
      }
    }
  });

  afterEach(() => {
    for (const name of Object.keys(spiedModules)) {
      spiedModules[name].mockRestore();
    }
  });

  test('all modules used', async () => {
    // tslint:disable:no-any
    const out = await preprocessAMP(testdata.hello.input, {} as any);
    for (const name of Object.keys(spiedModules)) {
      expect(spiedModules[name]).toHaveBeenCalled();
    }
    expect(out).toBe(testdata.hello.output);
  });

  test('skips modules from config', async () => {
    // tslint:disable:no-any
    await preprocessAMP(testdata.hello.input, {
      skipPreprocessingModules: ['Validator'],
    } as any);
    for (const name of Object.keys(spiedModules)) {
      if (name === 'Validator') {
        expect(spiedModules[name]).not.toHaveBeenCalled();
      } else {
        expect(spiedModules[name]).toHaveBeenCalled();
      }
    }
  });
});
