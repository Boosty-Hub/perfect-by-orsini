/**
 * Renders one or more schema.org objects as a JSON-LD <script>. Drop into any
 * page/layout: <JsonLd data={[clinicSchema(), physicianSchema()]} />
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from trusted, typed data (no user input) → safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
