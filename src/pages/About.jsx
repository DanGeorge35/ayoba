import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const teamMembers = [
  {
    name: "David Ige",
    role: "Frontend Developer",
    image: "src/assets/dave.png",
  },
  {
    name: "George Michael",
    role: "Frontend Developer",
    image: "src/assets/victor.png",
  },
  {
    name: "Dan George",
    role: "Frontend Developer",
    image: "src/assets/ladylaptop.png",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6c63ff] to-[#b621fe] text-white">
        <Navbar />
      <div className="max-w-5xl mx-auto px-1 pt-12 pb-24">
        <h1 className="text-4xl font-bold mb-6 text-center">About QuizLead</h1>

        <p className="text-lg mb-8 text-center">
          QuizLead is a powerful platform designed for educators to effortlessly create, manage, and share quizzes
          with their students. Whether you're running a classroom test, preparing for exams, or assigning
          interactive learning tasks, QuizLead streamlines the entire process with ease.
        </p>

        <div className="border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Why Educators Love QuizLead</h2>
          <ul className="list-disc list-inside space-y-3">
            <li>📝 Create multiple-choice, true/false, and custom quizzes easily</li>
            <li>📊 Track student performance in real-time</li>
            <li>🎯 Set deadlines, assign quizzes by class or group</li>
            <li>🔐 Secure access controls for student submissions</li>
            <li>📚 Organized dashboard to manage all quizzes in one place</li>
          </ul>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p>
            QuizLead empowers teachers with digital tools to make assessment smarter, simpler, and more engaging.
            We aim to transform classrooms by providing a seamless way to track progress and personalize learning.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            {
              teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-xl p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 mx-auto rounded-full mb-4 object-cover object-top"
                  />
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm">{member.role}</p>
                </div>
              ))
            }

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
