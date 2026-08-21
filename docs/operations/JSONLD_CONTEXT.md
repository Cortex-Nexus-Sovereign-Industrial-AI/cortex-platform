# JSON-LD Contexts — CINIS NEXUS

## Public identity (SEO)

| Surface | Context |
|---------|--------|
| `identity.html` | `"@context": "https://schema.org"` only |

Do not point the public identity page at the custom context. Google and standard crawlers expect Schema.org.

## Custom context (agents / MCP)

| Resource | Location |
|----------|----------|
| Context file | `ns/context.jsonld` |
| Live URL | https://cortex-platforms.netlify.app/ns/context.jsonld |
| Namespace base | `https://cortex-platforms.netlify.app/ns#` |
| Notes | `ns/README.md` |

### When to use

- Multi-agent or MCP payloads that need stable CINIS term IRIs
- Internal knowledge graphs (edgeCBF, millionsSdk, commandCenter, …)
- Cross-service documents that must stay consistent without inventing ad-hoc keys

### When not to use

- Google Business / Rich Results identity
- Public marketing pages that only need Organization / Person / WebSite

## Validation

- Public page: [Rich Results Test](https://search.google.com/test/rich-results) on `/identity.html`
- Context document: [JSON-LD Playground](https://json-ld.org/playground/) — expand a sample that references the context URL
- Schema.org terms: [validator.schema.org](https://validator.schema.org/)

## Related

- [IDENTITY.md](../../IDENTITY.md)
- [identity.html](../../identity.html)
