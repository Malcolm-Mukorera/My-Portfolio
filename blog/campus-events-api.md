# Building a Campus Events API: A Full-Stack Journey

*How I went from zero to a fully functional REST API using the MERN stack — authentication, RSVP system, filtering, and everything in between.*

---

## Where It Started

Every developer has that moment when tutorial projects stop feeling like enough. You've built the to-do app, followed the YouTube crash courses, and you understand the syntax — but you haven't built anything real yet. That was me a few weeks ago.

I wanted to build something that solved an actual problem, something I could point to in an interview and explain properly. The idea came from a simple frustration: finding out about campus events too late, or not at all. A notice on a board here, a WhatsApp message there. There had to be a better way.

So I decided to build the **Campus Events API** — a backend service that lets students and societies create, manage and discover university events. The kind of thing that could power a real app. And along the way I learned more than I expected.

> *"I didn't want to build another tutorial project. I wanted to build something I could actually explain to an employer."*

---

## The Tech Stack

I chose the MERN stack — MongoDB, Express, React and Node.js. The decision came down to one key advantage: JavaScript across the entire project. One language for the backend, one language for the frontend. For a solo developer still building confidence, that matters.

### Node.js & Express

Node.js is the runtime that lets JavaScript run on a server instead of just in a browser. Express is the framework that sits on top of it and makes building APIs clean and structured. Together they handle all incoming HTTP requests, route them to the right logic, and send back responses.

Every route in the API — registering a user, creating an event, toggling an RSVP — is handled by Express. It also manages middleware, which is code that runs between a request arriving and it reaching its destination. My JWT authentication check runs as middleware, meaning it intercepts every protected request before any logic executes.

### MongoDB & Mongoose

MongoDB is a NoSQL database that stores data as documents rather than rows in a table. This works particularly well for events because events naturally have different shapes — some have a capacity, some don't, some are faculty-specific, some are open to everyone.

Mongoose is the layer that sits between Node and MongoDB. It lets you define schemas — blueprints for what your data should look like — and adds validation, hooks and methods on top. For example, my User schema has a pre-save hook that automatically hashes passwords before they ever touch the database.

### React (Frontend Client)

The frontend is a separate React application that consumes the API. It handles routing with React Router v6, manages authentication state with the Context API, and uses Axios to make HTTP requests. Keeping the client and server as separate repositories mirrors how real teams actually work.

---

## How the API is Structured

One of the first things I learned is that structure matters as much as code. A messy project that works is still a messy project. I organised the backend into four layers, each with a clear responsibility:

- **Models** — define what the data looks like and the rules it must follow
- **Controllers** — contain the actual business logic for each operation
- **Routes** — match incoming URLs to the right controller and run validation
- **Middleware** — code that runs between the request and the controller

This separation means if I need to change how events are validated, I touch the routes file. If I need to change what happens when an event is created, I touch the controller. Nothing bleeds into everything else.

### The Request Flow

Every single request in the API follows the same journey. Take creating an event as an example. The request arrives at the server, Express sees it starts with `/api/events` and passes it to the events router. The router sees it's a POST request and runs the `protect` middleware first — this checks the JWT token and attaches the logged-in user to the request object. Then input validation runs to check the fields are correct. Only then does the `createEvent` controller execute, save the data to MongoDB, and send back a response.

Once you understand this flow you understand the entire codebase. Every endpoint works the same way.

---

## What the API Can Do

### Authentication

Users register with a name, email and password. The password is hashed with bcrypt before it's stored — meaning even if the database was compromised, passwords would be unreadable. On login, the API generates a JSON Web Token that the client stores and sends with every future request. The token contains the user's ID and is signed with a secret key only the server knows, so it can't be faked.

### Event Management

Authenticated users can create events with a title, description, date, location, category, faculty and optional capacity. They can update or delete their own events — but only their own. The ownership check runs server-side, not client-side, so it can't be bypassed by manipulating the frontend.

### RSVP System

The RSVP endpoint is a toggle — call it once and you're attending, call it again and you're not. Before adding an attendee the API checks whether the event has a capacity set and whether it's already full. If it is, the request is rejected with a clear error message.

### Search, Filtering and Pagination

The events listing endpoint accepts query parameters for filtering by category, faculty and date. Keyword search uses MongoDB's text index which searches across both the title and description fields simultaneously. Results come back paginated — 10 per page by default — with metadata like total pages and current page so the frontend can render pagination controls.

---

## Challenges I Ran Into

### Understanding Middleware

The concept of middleware took me a while to click. At first I thought of it as just "extra code that runs". But understanding that it runs in a chain — and that calling `next()` is what passes control forward — changed how I thought about the whole request lifecycle. Once I understood that, building the auth middleware felt logical rather than magical.

### Getting MongoDB Running Locally

This sounds trivial but it genuinely took time. MongoDB needs to be running as a background service before your Node server can connect to it. On Windows this means starting it through Services, which isn't something most beginner tutorials mention. Setting up MongoDB Compass alongside it made a huge difference — being able to visually see your data in real time while building the API is invaluable for debugging.

### JWT — Understanding What It Actually Is

I knew I needed authentication. I knew JWT was the thing to use. But understanding *why* took some time. A JWT isn't a session stored on the server — the server doesn't remember anything. The token itself contains all the information needed, signed with a secret. The server just verifies the signature on every request. This stateless nature is what makes it scale so well.

### Ownership Checks

Early on I had the update and delete routes working but hadn't added ownership checks. Any logged-in user could edit anyone's event. The fix was simple — compare the event's organizer field to `req.user._id` — but catching that gap taught me to think about every endpoint from a security perspective, not just a functionality one.

> *"Every time I hit a wall, I had to understand the concept properly before I could fix the code. That's actually the most valuable thing this project taught me."*

---

## Features I'm Planning to Add

### Rate Limiting

Using `express-rate-limit` to cap requests per IP. This is a basic but essential security measure that prevents abuse and brute force attacks on the login endpoint. It's about 15 lines of code but shows you think about the API beyond just making it functional.

### Image Uploads with Cloudinary

Letting organisers upload a banner image for their event. This involves `multer` for handling file uploads on the server and Cloudinary for storing them in the cloud. This is a real-world skill that appears in almost every production application.

### Email Notifications

Using Nodemailer to send a confirmation email when someone RSVPs, and a reminder email 24 hours before the event. This is the feature that would make the platform feel like a real product rather than a portfolio piece. It also introduces the concept of background jobs and scheduled tasks.

### Event Waitlist

When an event reaches capacity, users can join a waitlist. If an attendee cancels, the next person on the waitlist is automatically given their spot and notified by email. This combines several concepts — array manipulation, conditional logic, and notifications — into one feature.

### Swagger API Documentation

Adding a live, interactive documentation page at `/api/docs` using Swagger UI. This is something I've seen in every professional API I've used and it shows you think about how other developers will consume your work. For a portfolio project it's a strong finishing touch.

### Admin Role

Adding a role field to the User model. Admins can moderate any event, not just their own. This introduces role-based access control — a concept that comes up constantly in real codebases and in interviews.

---

## What I've Learned So Far

Beyond the technical skills, this project taught me how to think about building software properly. A few things that stick out:

- **Structure your project before you write code.** The folder structure I chose — models, controllers, routes, middleware — made every decision easier as the project grew.
- **Security isn't a feature you add at the end.** Password hashing, JWT verification, ownership checks and input validation were all built in from the start.
- **Read the error messages.** Almost every problem I hit was solvable by reading what the terminal was actually telling me.
- **Build a seed script early.** Having realistic data to work with from day one makes development much faster and testing much more meaningful.
- **Document as you go.** Writing the README forced me to think clearly about what the API does and how it works — which in turn made me write better code.

---

## Where This is Going

The backend is complete and the React frontend is being built to consume it. The next milestone is getting both deployed — the API on Render and the frontend on Netlify — so there's a live URL I can share.

After that the add-ons begin. Rate limiting first because it's quick. Then image uploads because they make the biggest visual difference. Then email notifications because they make it feel real.

This project started as a way to learn how APIs work. It became something I'm genuinely proud of and something I can talk about in depth. That's the difference between following a tutorial and building something yourself.

---

*The GitHub repositories are public — `campus-events-api` and `campus-events-client`. Feel free to explore the code, open an issue, or reach out if you have questions.*
