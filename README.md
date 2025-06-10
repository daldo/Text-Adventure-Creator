# Text-Adventure-Creator

## 🚂 Inspiration

You know the feeling: sitting on the train, half-awake, not in the mood for doomscrolling, but also not enough time to dive into a full game. The idea was simple: a quick interactive text adventure for in between – easy access, runs in the browser, no login, no setup. Just you, a few clicks, and your own story.

## 💡 What it does

**Text Adventure Creator** generates a personalized text adventure in seconds based on your selected genres (Sci-Fi, Fantasy, Horror, etc.). Optionally, you can add a custom setting (e.g., “abandoned space station” or “medieval tavern”) and the app builds an instant story for you.
It runs on any device, only needs your **OpenAI API key** (stored locally in your browser), and you're good to go – **no backend, no login, no delays**.

## 🛠️ How we built it

* **Frontend** using React + Tailwind
* Built with the **Bolt DIY Version** – super fast to deploy, no server config needed
* Fully **responsive** and mobile-friendly
* API key stored via `localStorage` – stays local, never sent anywhere
* Direct GPT API requests from the browser
* Language toggle (e.g., English/German)
* Focused on minimal, intuitive UX: few clicks, instant play

## 🧱 Challenges we ran into

* Securely handling the API key entirely on the frontend
* Designing a UI that works well even on small screens
* Ensuring the key management feels safe without needing a backend
* Hackathon time pressure – LOL no! I am kidding. I built it with Bolt DIY and Sonnet 4.0 - One hour.

## 🏁 Accomplishments that we're proud of

* Fully functional, fun-to-use app built quickly
* Truly zero-friction experience – no sign-up, no onboarding
* It’s genuinely fun to dive into these mini-adventures
* Effective, no-frills use of GPT in a real, playable context

## 📚 What we learned

* How to quickly build useful, production-ready GPT tools in the frontend
* The value of clear UX when time and attention are short
* Simple ideas can be surprisingly fun when well executed
* “Bolt & done” can actually work – with the right tools and mindset

## 🔮 What's next for Text Adventure Creator

* Save your story progress and continue later
* Add character creation or decision-based gameplay
* Share your adventures with friends
* Prompt tuning for more nuanced or genre-specific results
* Maybe even some hidden easter eggs – just for fun
