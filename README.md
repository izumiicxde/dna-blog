# DNA Blog

DNA Blog is a feature-rich blogging platform that allows users to write, publish, and explore articles. It provides a seamless experience for both writers and readers.

## Features

- ✍️ **Create & Publish Blogs** – Users can write and publish their own blogs.
- 📖 **Read Blogs** – Browse and read blogs from various users.
- 📝 **Edit & Delete** – Users can edit or delete their own blogs.
- 🔍 **Search & Filter** – Find blogs based on keywords and categories.
- 🔐 **User Authentication** – Secure login and signup functionality.
- 🎨 **Responsive UI** – A clean and user-friendly design for all devices.

## Tech Stack

- **Fullstack**: Remix, TailwindCSS
- **Database**: PostgreSQL
- **Authentication**: Session based auth
- **Storage**: Cloudinary / Local file storage (for images)

## Installation & Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/izumiicxde/dna-blog.git
   cd dna-blog
   ```
2. Install dependencies:
   ```sh
   npm install
   or
   bun install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     DATABASE_URL=your_database_url
     SESSION_SECRET=something_here
     CLOUDINARY_URL=your_cloudinary_url (if using image uploads)
     ```
4. Run database migrations (if using Prisma):
   ```sh
   npx prisma migrate dev
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

- Sign up or log in to start creating blogs.
- Write, edit, and publish your blogs.
- Explore blogs from other users and interact through likes and comments.

## License

This project is licensed under the MIT License.
