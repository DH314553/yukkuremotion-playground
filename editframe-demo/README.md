# Editframe Demo

This is a small Editframe starter inside the existing workspace.
It reuses the generated transcript from `../transcripts/autoVideo.ts` so you can render a prompt-generated script with Editframe too.

## Commands

```bash
npm --prefix editframe-demo install
npm --prefix editframe-demo run start
npm --prefix editframe-demo run render
```

## Notes

- `npm run auto:prompt -- "タイトル" --no-render` updates the transcript source.
- `editframe-demo/src/Video.tsx` reads the generated transcript and turns it into a simple Editframe composition.
- The layout is intentionally lightweight so you can extend it with more scenes from the examples repo.
