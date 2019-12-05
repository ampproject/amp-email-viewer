import { modules as preprocessingModules } from '../../preprocessing/preprocessing-modules/index';
import { preprocessAMP } from '../../preprocessing/preprocess';

describe('preprocessing', () => {
  const spiedModules: {
    [key: string]: jest.SpyInstance<string | Promise<string>>;
  } = {};

  beforeEach(() => {
    for (const module of preprocessingModules) {
      spiedModules[module.name] = jest.spyOn(module, 'process');
    }
  });

  afterEach(() => {
    for (const name of Object.keys(spiedModules)) {
      spiedModules[name].mockRestore();
    }
  });

  test('all modules used', async () => {
    // tslint:disable:no-any
    await preprocessAMP('', {} as any);
    for (const name of Object.keys(spiedModules)) {
      expect(spiedModules[name]).toHaveBeenCalled();
    }
  });

  test('skips modules from config', async () => {
    // tslint:disable:no-any
    await preprocessAMP('', {
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
