/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FeatureCard from '../components/FeatureCard'

function Showcase() {
  const [showDocs, setShowDocs] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#1E2A44]">
      <Header />
      <main className="flex-grow pt-16">
        {/* Intro Section */}
        <section className="py-20 bg-[#2A3655]">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-[#D1D5DB] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              FocusForge: The Ultimate Productivity Revolution
            </motion.h1>
            <motion.p
              className="text-lg text-[#D1D5DB] max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              FocusForge is not just an extension—it’s a paradigm shift. Powered by cutting-edge AI, our Chrome extension transforms how you work, study, and live by intelligently tracking and optimizing your productivity in real-time.
            </motion.p>
            <Link
              to="/login"
              className="inline-block bg-[#3B82F6] text-white px-6 py-3 rounded-full font-semibold glow hover:bg-[#22D3EE] transition transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[#1E2A44]">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-[#D1D5DB] text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Unparalleled Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                title="AI-Driven Insights"
                description="Our DistilBERT-powered AI analyzes your browsing habits with unmatched precision, classifying activities as productive or unproductive in real-time."
              />
              <FeatureCard
                title="Elegant Dashboard"
                description="Dive into a visually stunning dashboard that visualizes your productivity metrics with clarity and style (coming soon)."
              />
              <FeatureCard
                title="Motivational Guidance"
                description="Receive personalized, AI-generated tips to stay focused, motivated, and on track to achieve your goals."
              />
              <FeatureCard
                title="Zero-Friction Setup"
                description="Install the extension and start optimizing your productivity instantly—no complex configurations required."
              />
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="py-20 bg-[#2A3655]">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-[#D1D5DB] text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Why FocusForge?
            </motion.h2>
            <motion.button
              onClick={() => setShowDocs(!showDocs)}
              className="mx-auto block bg-[#3B82F6] text-white px-6 py-3 rounded-full font-semibold glow hover:bg-[#22D3EE] transition transform hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {showDocs ? 'Hide Details' : 'Learn More'}
            </motion.button>
            {showDocs && (
              <motion.div
                className="mt-8 max-w-4xl mx-auto text-[#D1D5DB]"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-[#22D3EE]">The Power of FocusForge</h3>
                    <p className="mt-2 text-sm">
                      FocusForge harnesses the power of artificial intelligence to redefine productivity. By seamlessly integrating with your Chrome browser, it tracks your activity and uses our proprietary DistilBERT model to classify tasks with unmatched accuracy. Whether you’re coding, researching, or browsing, FocusForge ensures you stay on track.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#22D3EE]">How It Works</h3>
                    <p className="mt-2 text-sm">
                      1. <strong>Install the Extension</strong>: Get FocusForge from the Chrome Web Store.<br />
                      2. <strong>Create an Account</strong>: Register or log in to sync your data.<br />
                      3. <strong>Track Effortlessly</strong>: Browse as usual, and our AI analyzes your activity in real-time.<br />
                      4. <strong>Unlock Insights</strong>: Access your productivity metrics and tips via the upcoming dashboard.<br />
                      <strong>Note</strong>: The extension is required to collect data. Without it, your dashboard will remain empty.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#22D3EE]">Why You Need It</h3>
                    <p className="mt-2 text-sm">
                      In a world full of distractions, FocusForge is your secret weapon. It’s not just about tracking time—it’s about understanding how you work and empowering you to do better. From students to professionals, FocusForge is designed for anyone who wants to take control of their productivity and achieve greatness.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Showcase