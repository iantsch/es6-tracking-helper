export const log = (message, name = 'TrackingHelper', color = 'rgb(150, 189, 217)') => {
  console.log(
    `%c[${name}]%c ${message}`,
    `color: ${color};`,
    'color: inherit'
  );
};
export const logObject = (object, name = 'TrackingHelper', color = 'rgb(150, 189, 217)') => {
  console.log(
    `%c[${name}]%c`,
    `color: ${color};`,
    'color: inherit',
    object
  );
};
export const error = (message, name = 'TrackingHelper', color = 'rgb(150, 189, 217)') => {
  console.error(
    `%c[${name}]%c ${message}`,
    `color: ${color};`,
    'color: inherit'
  );
};
export const warn = (message, name = 'TrackingHelper', color = 'rgb(150, 189, 217)') => {
  console.warn(
    `%c[${name}]%c ${message}`,
    `color: ${color};`,
    'color: inherit'
  );
};
