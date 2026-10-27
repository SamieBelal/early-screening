# The Earlier, The Better

A one-page resource for parents worried about their child's development: milestone tracking, autism screening, and how to reach Early Intervention. Available in English, Spanish, Arabic, Urdu and Bengali.

Static HTML, hosted on GitHub Pages.

## Editing

Don't edit the generated `index.html` files directly. Instead:

- Text for every language lives in `build/strings.js`.
- Page structure lives in `build/template.html`.
- Styles and scripts are shared: `style.css`, `app.js`.

Then regenerate the pages and push:

```
node build/build.js
git add -A
git commit -m "Update page"
git push
```

## Notes

The page links to official resources only. The M-CHAT-R/F is not reproduced here; posting it on a website requires a license from its authors (see mchatscreen.com). The non-English pages link to the M-CHAT translations page, which has official Spanish, Arabic, Urdu and Bangla versions.

Translations should be reviewed by native speakers before being promoted.
