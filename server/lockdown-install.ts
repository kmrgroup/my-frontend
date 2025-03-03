import { lockdown } from 'ses';

// Configure SES lockdown with unsafe error taming to avoid uncaught exceptions
lockdown({
  errorTaming: 'unsafe',
  consoleTaming: 'unsafe',
  overrideTaming: 'severe',
  stackFiltering: 'verbose',
  domainTaming: 'unsafe',
  fakePerformance: true, // For mining operations
  __allowUnsafeMonkeyPatching__: true // For TensorFlow.js compatibility
});