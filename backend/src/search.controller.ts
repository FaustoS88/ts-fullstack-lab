import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Logger,
} from '@nestjs/common';
import { IndexDocumentDto } from './dto/index-document.dto';
import { osClient } from './opensearch.client';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  @Get()
  async search(
    @Query('q') q = '',
    @Query('from') from = '0',
    @Query('size') size = '50',
  ): Promise<any[]> {
    const fromNum = Math.max(parseInt(from, 10), 0);
    const sizeNum = Math.min(parseInt(size, 10), 100);
    const queryContainer = q
      ? {
          simple_query_string: {
            query: q,
            fields: ['*'],
            default_operator: 'and' as const,
          },
        }
      : { match_all: {} };

    try {
      const response = await osClient.search({
        index: 'documents',
        from: fromNum,
        size: sizeNum,
        body: { query: queryContainer },
      });
      return response.body.hits.hits;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Search error', error.stack);
      } else {
        this.logger.error('Search error', JSON.stringify(error));
      }
      return [];
    }
  }

  @Post('index')
  async indexDoc(@Body() doc: IndexDocumentDto): Promise<{ indexed: string }> {
    const id = doc.id ?? Date.now().toString();
    try {
      await osClient.index({
        index: 'documents',
        id,
        body: doc,
        pipeline: 'attachments',
        refresh: 'true',
      });
      return { indexed: id };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Index error', error.stack);
      } else {
        this.logger.error('Index error', JSON.stringify(error));
      }
      throw error;
    }
  }

  @Delete('index')
  async deleteIndex(): Promise<any> {
    try {
      const response = await osClient.indices.delete({ index: 'documents' });
      return response.body;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Delete index error', error.stack);
      } else {
        this.logger.error('Delete index error', JSON.stringify(error));
      }
      throw error;
    }
  }
}
