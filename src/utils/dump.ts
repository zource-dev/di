import { inspect } from 'util';

export const dump = (value: unknown) => {
  console.log(
    inspect(value, {
      showHidden: false,
      depth: null,
      maxArrayLength: null,
      maxStringLength: null,
      breakLength: Infinity,
      colors: true,
      compact: false,
    })
  );
};
