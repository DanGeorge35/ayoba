import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const plans = [
  {
    name: "Free",
    price: "₦0",
    features: [
      "✅ Create up to 5 quizzes",
      "✅ Basic analytics",
      "✅ 1 class group",
      "🚫 No gamification features",
    ],
    button: "Get Started",
  },
  {
    name: "Pro",
    price: "₦3,500",
    features: [
      "✅ Unlimited quizzes",
      "✅ Advanced analytics",
      "✅ Up to 5 class groups",
      "✅ Leaderboards & rewards",
    ],
    button: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "₦12,000",
    features: [
      "✅ Everything in Pro",
      "✅ Multiple teacher accounts",
      "✅ Shared question bank",
      "✅ Priority support",
    ],
    button: "Contact Sales",
  },
];

export default function Pricing() {
  return (
    <div className="bg-gradient-to-br from-[#6c63ff] to-[#b621fe] text-white min-h-screen">
        <Navbar />
    <div className="pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg mb-12">
          Flexible pricing to support educators, tutors, and institutions.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-xl p-8 border ${
                plan.highlighted
                  ? "border-[#5735e1] scale-105"
                  : "border-gray-200"
              } hover:shadow-lg transition`}
            >
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold mb-4">
                {plan.price}
                <span className="text-sm font-normal"> /month</span>
              </p>
              <ul className="text-left mb-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button className="w-full bg-[#5735e1] py-2 rounded-lg hover:bg-[#472cc3] transition cursor-pointer">
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}
