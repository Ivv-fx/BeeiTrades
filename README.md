# BeeiTrades

## UI components

Shared React primitives live in `components/ui/`, the shadcn/ui default location. Keeping primitives there makes them easy to discover and reuse across the app; import them through the `@/components/ui` alias. Tailwind 4 is configured in `index.css`, and the Vite React entry is `main.tsx`. The existing page renderer remains in `script.js`.

The project is configured for shadcn/ui (`components.json`). To add a shadcn component, run:

```sh
npx shadcn@latest add button
```

Install dependencies with `npm install`, start the app with `npm run dev`, and validate with `npm run typecheck` and `npm run build`.