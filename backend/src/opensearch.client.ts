/* eslint-disable @typescript-eslint/no-unsafe-member-access,
                  @typescript-eslint/no-unsafe-assignment,
                  prettier/prettier */
import { Client } from '@opensearch-project/opensearch';

export const osClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'admin',
    password: 'Str0ngP@ssw0rd!',
  },
  ssl: { rejectUnauthorized: false },
});

async function ping() {
  const { body } = await osClient.info();
  console.log('OpenSearch OK', (body as any).version.number);
}

void ping();
