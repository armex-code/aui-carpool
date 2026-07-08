# Homepage photos

Drop three photos in this folder and the homepage picks them up
automatically on the next deploy (the slots stay hidden while the files
are missing):

| File | Where it shows | Suggested content |
| --- | --- | --- |
| `car.jpg` | Hero, right side | Riders in a car |
| `campus.jpg` | "How it works" section, smaller | AUI campus |

(`booking.jpg` is currently not shown; the file can stay here in case a
future page needs it.)

Landscape orientation works best (roughly 4:3 for campus, 16:10 for the
others). Keep each under ~400 KB so the page stays fast: https://squoosh.app
does this in the browser for free.

Easiest way to add them: GitHub repo page -> `public/images` -> "Add file"
-> "Upload files" -> commit to main. Vercel redeploys on its own.
