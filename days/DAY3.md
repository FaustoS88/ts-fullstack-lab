# OpenSearch Quickstart Guide

## Summary
Day 3 ties together our full-stack search flow:
- Creating a typed index in OpenSearch
- Installing the PDF-attachment plugin via Docker (temporary and permanent with multi-arch Buildx)
- Defining an ingest pipeline
- Wiring in NestJS routes with validation and body-size fixes
- Providing a typed DTO
- Adding a React file-upload component

You'll get both curl and React-UI methods for indexing base64-encoded PDFs, plus index deletion and troubleshooting tips.

## Prerequisites
- Docker & Docker Compose configured with an OpenSearch service in docker-compose.yml
- OpenSearch endpoint: `https://localhost:9200` (self-signed certs allowed)
- Credentials: `admin:Str0ngP@ssw0rd!` for basic auth
- Node.js/NestJS backend and React (Vite) frontend set up
- cURL or another HTTP client installed

---

## 1. Create the Documents Index
Define mappings so that:
- `title`/`body` are full-text searchable  
- `tags` are keywords  
- `published` is a date field

```bash
curl -k -u admin:Str0ngP@ssw0rd! \
  -X PUT https://localhost:9200/documents \
  -H 'Content-Type: application/json' \
  -d '{
        "mappings": {
          "properties": {
            "title":     { "type": "text" },
            "body":      { "type": "text" },
            "tags":      { "type": "keyword" },
            "published": { "type": "date" }
          }
        }
      }'
```

---

## 2. Install the Ingest-Attachment Plugin

### 2.1 Temporary (Container-only)
```bash
# Identify your OpenSearch container
docker ps

# Install plugin inside the running container
docker exec -it <opensearch_container> \
  bash -c "/usr/share/opensearch/bin/opensearch-plugin install --batch ingest-attachment"

# Restart container
docker restart <opensearch_container>

# Verify installation
docker exec -it <opensearch_container> \
  /usr/share/opensearch/bin/opensearch-plugin list
```

### 2.2 Permanent via Custom Image
Create a Dockerfile next to docker-compose.yml:

```dockerfile
FROM opensearchproject/opensearch:latest
RUN /usr/share/opensearch/bin/opensearch-plugin install --batch ingest-attachment
```

#### Option A: Push to Docker Hub
```bash
docker login --username <your-username>             # use your Docker Hub PAT
docker buildx create --use --name mybuilder         # if not already
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t <your-username>/my-opensearch-ingest:latest \
  --push .
```

#### Option B: Load Locally (ARM64 only)
```bash
docker buildx build \
  --platform linux/arm64 \
  -t my-opensearch-ingest:latest \
  --load .
```

Update docker-compose.yml:
```yaml
services:
  opensearch:
    image: my-opensearch-ingest:latest
    environment:
      - discovery.type=single-node
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=Str0ngP@ssw0rd!
    ports:
      - "9200:9200"
```

---

## 3. Define the Ingest Pipeline
Extract all text from a base64-encoded data field into attachment.content:

```bash
curl -k -u admin:Str0ngP@ssw0rd! \
  -X PUT https://localhost:9200/_ingest/pipeline/attachments \
  -H 'Content-Type: application/json' \
  -d '{
        "description": "Extract attachment content",
        "processors": [
          {
            "attachment": {
              "field":          "data",
              "target_field":   "attachment",
              "indexed_chars": -1
            }
          }
        ]
      }'
```

---

## 4. Configure NestJS for Large Payloads & Validation

### 4.1 Install Packages
```bash
cd backend
npm install class-validator class-transformer reflect-metadata
```

### 4.2 Update tsconfig.json
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    /* …other settings… */
  }
}
```

### 4.3 Configure main.ts
```typescript
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Raise default JSON & URL-encoded body size from ~100KB to 50MB
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
```

---

## 5. Define the Typed DTO
`backend/src/dto/index-document.dto.ts`

```typescript
import { IsOptional, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class IndexDocumentDto {
  @IsOptional() @IsString()     id?: string;
  @IsOptional() @IsString()     title?: string;
  @IsOptional() @IsString()     body?: string;
  @IsOptional() @IsArray()
  @ArrayNotEmpty() @IsString({ each: true })
                                 tags?: string[];
  @IsOptional() @IsString()     data?: string;     // base64-PDF
  @IsOptional() @IsString()     published?: string;
}
```

---

## 6. NestJS Controller Routes
`backend/src/search.controller.ts`

```typescript
import {
  Controller, Get, Post, Delete,
  Body, Query, Logger,
} from '@nestjs/common';
import { osClient } from './opensearch.client';
import { IndexDocumentDto } from './dto/index-document.dto';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  @Get()
  async search(
    @Query('q') q = '',
    @Query('from') from = '0',
    @Query('size') size = '50',
  ): Promise<any[]> {
    const fromNum = Math.max(+from, 0);
    const sizeNum = Math.min(+size, 100);
    const queryBody = q
      ? { simple_query_string: { query: q, fields: ['*'], default_operator: 'and' as const } }
      : { match_all: {} };

    try {
      const response = await osClient.search({
        index: 'documents',
        from: fromNum,
        size: sizeNum,
        body: { query: queryBody },
      });
      return response.body.hits.hits;
    } catch (err) {
      this.logger.error('Search error', err instanceof Error ? err.stack : JSON.stringify(err));
      return [];
    }
  }

  @Post('index')
  async indexDoc(@Body() doc: IndexDocumentDto): Promise<{ indexed: string }> {
    const id = doc.id ?? Date.now().toString();
    try {
      await osClient.index({
        index:    'documents',
        id,
        body:     doc,
        pipeline: 'attachments',
        refresh:  'true',
      });
      return { indexed: id };
    } catch (err) {
      this.logger.error('Index error', err instanceof Error ? err.stack : JSON.stringify(err));
      throw err;
    }
  }

  @Delete('index')
  async deleteIndex(): Promise<any> {
    try {
      const res = await osClient.indices.delete({ index: 'documents' });
      return res.body;
    } catch (err) {
      this.logger.error('Delete index error', err instanceof Error ? err.stack : JSON.stringify(err));
      throw err;
    }
  }
}
```

---

## 7. Frontend: React Integration

### 7.0 useSearch Hook
Handles debounce and AbortController-based cancellation.

import { useState, useEffect } from 'react';

```typescript
// Define the shape of your search results
interface SearchResult {
  id: string;
  // Add other fields returned by your backend
}

// Custom hook to fetch and return search results with debouncing and cancellation
export function useSearch(query: string, delay = 300) {
  const [results, setResults] = useState<SearchResult[]>([]);   
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }

    // Debounce the fetch
    const handler = setTimeout(() => {
      const controller = new AbortController();
      setLoading(true);
      
      fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then(res => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data: SearchResult[]) => {
          setResults(data);
          setError(null);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        })
        .finally(() => setLoading(false));

      // Cleanup to abort fetch if query changes
      return () => controller.abort();
    }, delay);

    // Cleanup debounce timer on query change
    return () => clearTimeout(handler);
  }, [query, delay]);

  return { results, error, loading };
}
```

### 7.1 PdfUploader Component
`frontend/src/components/PdfUploader.tsx`

```typescript
import { useState, ChangeEvent } from 'react';

export function PdfUploader() {
  const [file, setFile] = useState<File|null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setMsg('');
  };

  const upload = async () => {
    if (!file) return setMsg('Select a PDF first');
    setBusy(true);
    try {
      const data = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => {
          const b64 = (reader.result as string).split(',')[1];
          res(b64);
        };
        reader.onerror = () => rej(reader.error);
        reader.readAsDataURL(file);
      });

      const resp = await fetch('http://localhost:3000/search/index', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ title: file.name, data }),
      });
      if (!resp.ok) throw new Error(resp.statusText);
      const { indexed } = await resp.json();
      setMsg(`Indexed with ID ${indexed}`);
    } catch (e: any) {
      setMsg(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={onChange} />
      <button disabled={!file||busy} onClick={upload}>
        {busy ? 'Uploading…' : 'Upload'}
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
```

### 7.2 Update App.tsx
Import and render PdfUploader above search UI.

---

## 8. cURL Upload via Terminal

### 8.1 Using a Payload File
```bash
# 1. Create payload.json
FILE_BASE64=$(base64 < ./pdf/mydoc.pdf)
cat > payload.json <<EOF
{"title":"My PDF","data":"$FILE_BASE64"}
EOF

# 2. Send via curl
curl -k -u admin:Str0ngP@ssw0rd! \
  -X PUT "https://localhost:9200/documents/_doc/2?pipeline=attachments&refresh" \
  -H 'Content-Type: application/json' \
  --data @payload.json

# 3. Clean up
rm payload.json
```

### 8.2 Streaming JSON via stdin
```bash
(
  echo -n '{"title":"My PDF","data":"'
  base64 < ./pdf/mydoc.pdf
  echo '"}'
) | curl -k -u admin:Str0ngP@ssw0rd! \
      -X PUT "https://localhost:9200/documents/_doc/2?pipeline=attachments&refresh" \
      -H 'Content-Type: application/json' \
      --data @-
```

---

## 9. Deleting the Documents Index
```bash
curl -k -u admin:Str0ngP@ssw0rd! \
  -X DELETE https://localhost:9200/documents
```

---

## 10. Lessons learned
- **Separation of Concerns**:Custom hooks (useSearch) encapsulate debounce and cancellation, keeping UI components focused on rendering
- **Debounce vs. Throttle**: A 300 ms debounce waits for typing to pause before sending a request, reducing network churn and memory pressure in Chrome 
- **AbortController**: Cancelling in-flight fetches frees up memory and prevents data races when queries change rapidly
- **Safe Query Parsing**: Using simple_query_string inside body.query guards against shard parse errors from user input (special characters, punctuation)
- **Pagination by Default**: Capping results (size ≤ 100) prevents huge payloads—avoid fetching thousands of hits at once
- **Validation & Security**: Use TypeScript interfaces to define payloads and validate them with Zod
- **Multi-Arch Docker**: Building a custom image with Buildx for both ARM64 and AMD64 ensures reproducibility on M1 Macs and other environments 
- **413 Payload Too Large**: DTOs with class-validator ensure only expected fields enter the system, and raising request limits in Express (express.json({ limit: '50mb' })) avoids 413 errors for large PDFs
- **Operational Flexibility**: Supported both UI-based PDF uploads and CLI-based indexing, giving developers and scripts alike a straightforward ingestion path
- **Security**: Swap `-k` for proper certs and remove plaintext creds in production

✅ **Day 3 Complete** – You now have a robust, end-to-end search interface with PDF ingestion, and secure, validated server routes.
