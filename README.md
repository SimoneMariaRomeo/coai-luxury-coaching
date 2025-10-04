# CoAI - Luxury AI Coaching Platform

A premium AI-powered coaching platform designed for executive development and leadership training. Built with Next.js, TailwindCSS, and OpenAI GPT-4.

## 🚀 Features

- **Luxury Design System**: Dark modern theme with gold accents and premium typography
- **AI-Powered Coaching**: Personalized coaching sessions using OpenAI GPT-4
- **Unified Coaching Style**: Coaching methodology applied across all sessions (legacy Socratic prompt archived as socratc-inactive)
- **Progress Tracking**: Session completion tracking with persistent state
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Toast Notifications**: Real-time feedback and status updates

## 📁 Project Structure

```
coai/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── topics/            # Topic pages
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities and stores
│   ├── styles/                # Style prompts (coaching + legacy socratc-inactive)
│   └── system-prompts/        # Session prompts
│       ├── leadership/        # Leadership session prompts
│       ├── feedback/          # Feedback session prompts
│       └── general-coaching/ # General coaching prompts
├── config.json               # Topic and session configuration
├── secrets.env              # Environment variables (gitignored)
└── start.bat               # One-click development start
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd coai
   npm install
   ```

2. **Configure Environment**
   - Copy `secrets.env` to `.env.local`
   - Update `OPENAI_API_KEY` with your API key
   - Update `OPENAI_MODEL` if needed (default: gpt-4)

3. **Start Development**
   ```bash
   # Windows
   start.bat
   
   # Or manually
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:3000`

## 🎯 Available Topics

### Leadership Excellence
- **Focus**: Situational Leadership
- **Sessions**: 7 coaching-led sessions (legacy Socratic material now delivered with the coaching style)
- **Objectives**: 
  - Understand development stages and characteristics
  - Learn to assess team members' development level
  - Apply appropriate leadership styles

### Feedback Mastery  
- **Focus**: Radical Candor and feedback practice
- **Sessions**: 9 coaching-led sessions (legacy Socratic material now delivered with the coaching style)
- **Objectives**:
  - Master Radical Candor principles
  - Distinguish between facts and judgments
  - Apply the SBI model for effective feedback

## 🔧 Adding New Topics

### 1. Create Topic Configuration
Add your topic to `config.json`:

```json
{
  "topics": {
    "your-topic": {
      "title": "Your Topic Title",
      "intro": "One sentence describing the value for learners",
      "objectives": [
        "Learning objective 1",
        "Learning objective 2", 
        "Learning objective 3"
      ],
      "sessions": [
        {
          "id": "session-1",
          "title": "Session Title",
          "type": "Coaching", // use "Coaching"
          "file": "session-1.txt"
        }
      ]
    }
  }
}
```

### 2. Create Session Prompts
Create prompt files in `src/system-prompts/your-topic/`:

```
src/system-prompts/your-topic/
├── session-1.txt
├── session-2.txt
└── session-3.txt
```

### 3. Session Prompt Format
Each session prompt should include:
- **Session title and description**
- **Key questions to explore**
- **Learning objectives**
- **Practice scenarios**
- **Reflection prompts**

## 🎨 Design System

### Colors
- **Primary**: `#0a0a0a` (Luxury Dark)
- **Secondary**: `#1a1a1a` (Luxury Gray)  
- **Accent**: `#d4af37` (Luxury Gold)
- **Text**: `#ffffff` (Luxury White)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- **Glass Effect**: Backdrop blur with transparency
- **Luxury Shadow**: Multi-layer shadows with gold accent
- **Gradient Backgrounds**: Dark to light luxury gradients

## 🔄 How Topics + Style Prompts Combine

The system automatically combines:
1. **Style Prompt** (`src/styles/coaching.txt`; legacy prompt retained at `src/styles/socratc-inactive.txt`)
2. **Session Prompt** (`src/system-prompts/[topic]/[session].txt`)

**Combined System Prompt:**
```
[Style Prompt Content]

[Session Prompt Content]
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional)

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Model to use (default: gpt-4)

### Customization
- **Colors**: Update `tailwind.config.js`
- **Fonts**: Modify `src/app/globals.css`
- **Topics**: Edit `config.json`
- **Prompts**: Update files in `src/system-prompts/`

## 📱 Responsive Design

- **Desktop**: Full layout with sidebars and expanded content
- **Tablet**: Optimized grid layouts and touch interactions  
- **Mobile**: Stacked layouts with mobile-first navigation

## 🎯 Key Features

### AI Coaching
- Personalized coaching based on session prompts
- Context-aware conversations
- Progress tracking across sessions

### State Management
- Zustand for global state
- Persistent progress tracking
- Session memory (resets on refresh)

### Notifications
- Toast notifications for user feedback
- Loading states and error handling
- Success/error messaging

## 🛠️ Development

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### File Structure
- **Pages**: Next.js app router structure
- **Components**: Reusable UI components
- **Lib**: Utilities, stores, and hooks
- **Styles**: Global styles and Tailwind config

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for executive excellence**


