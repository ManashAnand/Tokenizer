
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { BlockChainAgent } from './agents';

export const mastra = new Mastra({
  agents: { BlockChainAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
