import {
  validationModules,
  transformingModules,
} from '../../preprocessing/preprocessing-modules/index';
import { preprocessAMP } from '../../preprocessing/preprocess';
import { testdata } from './testdata';

describe('preprocessing', () => {
  const spiedTransform: {
    [key: string]: jest.SpyInstance<void | Promise<void>>;
  } = {};
  const spiedValidation: {
    [key: string]: jest.SpyInstance<Error | null | Promise<Error | null>>;
  } = {};

  beforeEach(() => {
    for (const module of transformingModules) {
      spiedTransform[module.name] = jest.spyOn(module, 'transform');
    }
    for (const module of validationModules) {
      if ('validateEnvironment' in module) {
        spiedValidation[module.name] = jest.spyOn(
          module,
          'validateEnvironment'
        );
      } else if ('validateText' in module) {
        spiedValidation[module.name] = jest.spyOn(module, 'validateText');
      } else if ('validateDocument' in module) {
        spiedValidation[module.name] = jest.spyOn(module, 'validateDocument');
      }
    }
  });

  afterEach(() => {
    for (const method of Object.values(spiedTransform)) {
      method.mockRestore();
    }
    for (const method of Object.values(spiedValidation)) {
      method.mockRestore();
    }
  });

  test('all modules used', async () => {
    // tslint:disable:no-any
    const out = await preprocessAMP(testdata.hello.input, {} as any);
    for (const method of Object.values(spiedValidation)) {
      expect(method).toHaveBeenCalled();
    }
    for (const method of Object.values(spiedTransform)) {
      expect(method).toHaveBeenCalled();
    }
    expect(out).toBe(testdata.hello.output);
  });

  test('skips modules from config', async () => {
    // tslint:disable:no-any
    await preprocessAMP(testdata.hello.input, {
      skipPreprocessingModules: ['ValidateAMP'],
    } as any);

    for (const name of Object.keys(spiedValidation)) {
      if (name === 'ValidateAMP') {
        expect(spiedValidation[name]).not.toHaveBeenCalled();
      } else {
        expect(spiedValidation[name]).toHaveBeenCalled();
      }
    }
  });
});
