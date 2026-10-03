# Aarni Annanolli

Game and software developer from Järvenpää, Finland.

## About me

I'm a second-year software development student at Keuda. I mostly work in Godot, and I enjoy engine-side programming and building editor tools. I also like working on every part of a system: design, code, tests and deployment.

My biggest project is YHDE, which I've been building since January 2026. I wrote all of it myself, including the native client, the server, the database, the website and the production deployment. Along the way I learned event sourcing, concurrent programming and load testing.

I'm looking for a programming job, preferably at a game studio, where I can write code every day and learn from people who have shipped games.

## Projects

### [YHDE](https://yhde.frostinteractive.fi) (Jan 2026 – now)

YHDE is real-time collaboration for the Godot editor, and it's currently in beta. Everyone on a team works in the same project and sees each other's cursors, selections and edits as they happen. Two people can move nodes in the same scene or type in the same script at the same time. Git is still used for commits and releases.

The editor side is a C++ GDExtension that runs on Windows, macOS and Linux. Godot doesn't report what an edit changed, so after every change to the undo history the client compares the open scenes with the last synced state and sends the differences to the server. That means it works with every editor tool and with other plugins without any extra code. Unsent edits are kept on disk, so nothing is lost if the connection drops or the editor crashes.

The server is written in C# on .NET 10 and talks to the editors over WebSockets and MessagePack. Each project is stored in PostgreSQL as an append-only, hash-chained log of operations, and the same log is used for history, undo, replay and auditing. The server validates every edit, puts the edits in order and saves them before sending them to the rest of the team. Live script editing uses operational transformation, and Ctrl+Z only undoes your own changes.

The first load test failed at 500 editors because PostgreSQL ran out of connections during bursts. To fix it, I changed the commit path so that each branch has one writer that commits all waiting edits in a single transaction. I also kept the connection pool under PostgreSQL's limit and encoded each cursor update once for all recipients. After that, the production server handled:

- 800 editors online at once with no disconnects
- a 40 ms p95 for an edit to be committed and broadcast
- 517 MB peak RAM at 1,000 simulated editors

YHDE runs in Docker Compose on a Hetzner server behind Caddy. It takes daily database backups, and an update rolls back automatically if the new version fails to start. GitHub Actions builds the native core for all three platforms and runs the 154 server tests on every change. Users can sign in with email, GitHub or Google, even from inside Godot. Teams have roles and invite links, and there's a React + TypeScript dashboard and admin page.

In total it's about 30,000 lines of C++ and C#. YHDE is going open source: [YhdeDevelopmentOrganization/yhde](https://github.com/YhdeDevelopmentOrganization/yhde)

### Aatra (Jun 2026 – now)

Aatra is a grand strategy game inspired by Europa Universalis. A new world is generated every time a game starts, so every playthrough has different continents. The world generation is written in C++ for performance, and the gameplay is in GDScript in Godot. I'm making it alone, and it's still in development.

## Experience

**Web developer, LuppaSoppi** (2025 – now)

I work in a team of four on a client project through Keuda. We built LuppaSoppi's WordPress website together with the client, and we're now expanding it into an online store.

## Education

**Keuda** (July 2025 – now)

I'm studying for a vocational qualification in information and communications technology, specifically in software development. I'm in my second year.

## Skills

- Games: Godot with GDScript and C++, editor plugins
- Languages: C++, C#, Python, TypeScript, JavaScript, SQL
- Backend: .NET, PostgreSQL, Dapper, WebSockets, MessagePack
- Frontend: React, Vite, Tailwind CSS, WordPress
- DevOps: Docker, Docker Compose, Caddy, Ubuntu servers, GitHub Actions
- Spoken languages: Finnish (native), English (fluent)

## Contact

Email: aarninko@gmail.com
Portfolio: [aarnixx.dev](https://aarnixx.dev/)
