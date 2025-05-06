'use strict';

import { lambdaHandler } from '../../app.mjs';
import { expect } from 'chai';
var context;

var event = {
    body: JSON.stringify({
      crypto: 'bitcoin',
      email: 'vanshikalal815@gmail.com'
    }),
  };

const result = await lambdaHandler(event, context)

