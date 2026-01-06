Smart India Hackathon 2024 - Problem Statement SIH-1648


Problem Statement Description:
Background: Visitors to museums often face several significant challenges due to manual ticket booking systems. One prominent issue is the inefficiency and time consumption associated with the process. Long queues are common, especially during peak hours, weekends, or special exhibitions, leading to frustration and impatience among visitors. Besides the wait times, the manual system is prone to errors, such as incorrect ticket issuance, double bookings, or lost records, which can cause further delays and inconvenience. Overall, these challenges associated with manual ticket booking systems significantly detract from the visitor experience, reducing satisfaction and potentially impacting the museum's reputation and visitor numbers. Description: The implementation of a chatbot for ticket booking in a museum addresses several critical needs, enhancing the overall visitor experience and streamlining museum operations. Here are the key reasons for adopting a chatbot ticket booking system: 1. Improved Customer Service 2. Efficient Handling of High Volumes 3. Cost-Effective Solution 4. Data Collection and Analysis 5. Accessibility 6. Reduced Human Error 7. Multilingual Support 8. Enhanced Marketing and Promotion Expected Solution: An efficient and responsive multilingual chatbot based ticketing system that can handle all kinds of bookings from gate entry to shows. Payment gateway should also be integrated to make it fully free from human intervention. It will also provide analytics to aid in more efficient decision making process.




This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- Firebase account and project (for image storage)
- Stripe account (for payments)
- Clerk account (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Heritage-app-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in all required environment variables with your credentials:
     - Supabase URL and Anon Key
     - Firebase configuration
     - Stripe keys
     - Clerk keys (if using Clerk)
     - Application domain

4. Set up the database:
   - Run the Supabase schema: `supabase-schema.sql`
   - Set up RLS policies: `supabase-rls-policies.sql`
   - See `SUPABASE_SETUP.md` for detailed instructions

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

See `.env.example` for all required environment variables. Make sure to:
- Never commit `.env.local` or any `.env` files to version control
- Use environment variables for all sensitive data
- Set up environment variables in your deployment platform (Vercel, etc.)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Problem Statement: SIH-1648
This repository contains the solution for SIH-1648, a problem statement selected for Smart India Hackathon 2024. The challenge, presented by the Ministry of Culture and the National Council of Science Museums, aims to address inefficiencies in museum ticket booking systems.

Background:
Visitors to museums often face several significant challenges due to manual ticket booking systems, including long queues, errors in ticket issuance, double bookings, and lost records. These challenges detract from the visitor experience, leading to reduced satisfaction and potentially impacting the museum’s reputation.

Description:
Our solution involves the implementation of a multilingual chatbot-based ticket booking system that:

1. Handles all types of bookings, including gate entry and shows.
2. Integrates a payment gateway for seamless transactions.
3. Automates the entire process to reduce human intervention and errors.
4. Provides data analytics to improve decision-making.
5. Supports multiple languages to enhance accessibility.
6. Contributes to marketing and promotion through data-driven insights.

Key Benefits:
1. Improved Customer Service: Quick and efficient responses to visitor queries.
2. Efficient Handling of High Volumes: Scalability to manage large crowds.
3. Cost-Effective Solution: Reduced staffing costs and minimized errors.
4. Data Collection and Analysis: Valuable insights for museum management.
5. Accessibility: Multilingual support for a diverse audience.
6. Reduced Human Error: Automated processes ensure accuracy.
7. Enhanced Marketing and Promotion: Data-driven strategies to engage visitors.

Expected Solution:
An efficient, responsive, and multilingual chatbot-based ticketing system with integrated payment options, designed to provide a seamless visitor experience from booking to entry. The solution also includes analytics to help museums make informed decisions.

Solution Demo:
You can access the live demo of the solution at: https://heritage-app-gamma.vercel.app/

Team Members:
1. Shayam Ahmad (Leader)
2. Mohammad Aakib Bhat - https://github.com/bhataakib02
3. Haroon Iqbal - https://github.com/Haroon-89
4. Jan Adnan Farooq - https://github.com/Adnaan-dev
5. Isha Mishra - https://github.com/ishamishra19
6. Shivani Gupta - https://github.com/shivanigupta004

## Project Structure

```
Heritage-app-main/
├── src/
│   ├── app/              # Next.js app router pages and API routes
│   ├── components/        # Reusable React components
│   ├── config/           # Configuration files (Supabase, Firebase)
│   ├── helpers/          # Utility functions
│   ├── interfaces/       # TypeScript interfaces
│   ├── lib/              # Library code and database adapters
│   ├── models/           # Data models
│   └── providers/        # React context providers
├── public/               # Static assets
├── supabase-schema.sql   # Database schema
├── supabase-rls-policies.sql  # Row Level Security policies
└── *.md                  # Documentation files
```

## Documentation

- `README.md` - This file
- `SUPABASE_SETUP.md` - Supabase setup instructions
- `ADMIN_FEATURES.md` - Admin features documentation
- `OPTIMIZATIONS_IMPLEMENTED.md` - Performance optimizations

## Security Notes

⚠️ **Important**: Never commit sensitive information to the repository:
- Environment variables (`.env`, `.env.local`, etc.)
- API keys, secrets, or credentials
- Database connection strings
- Private keys

All sensitive data should be stored in environment variables and configured in your deployment platform.

## Contributing

Feel free to raise any issues or contribute to the project by submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project was created for Smart India Hackathon 2024.


**Note: For an optimal user interface experience, it is recommended to access this platform on a desktop.** 
