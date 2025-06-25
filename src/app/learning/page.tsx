import { learningSections } from "../../data/learning";

export default function LearningPage() {
  return (
    <main className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 py-12 pt-24">
      <div className="max-w-3xl w-full bg-white dark:bg-[#101223] rounded-2xl shadow-xl p-6 md:p-12 mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Gas Education</h1>
        <div className="text-center text-gray-500 text-xs mb-8">Last Updated: June 22, 2025</div>
        {learningSections.map((section, i) => (
          <section key={section.title} className="mb-12">
            <h2 className="text-lg md:text-xl font-semibold text-grazgas-blue mb-4 mt-8 first:mt-0">
              {section.title}
            </h2>
            <ul className="space-y-6">
              {section.questions.map((q, idx) => (
                <li key={q.question} className="mb-2">
                  <h2 className="font-semibold text-base md:text-lg mb-1">{q.question}</h2>
                  <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line text-xs md:text-sm">
                    {q.answer}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
} 