/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1E2A44]">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative bg-[radial-gradient(circle_at_center,#3B82F6_0%,#1E2A44_70%)] text-white py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.1),rgba(34,211,238,0.2))] opacity-50"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-[#D1D5DB]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Redefine Productivity with FocusForge
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-[#D1D5DB]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Experience the future of work with our AI-powered Chrome extension, designed to optimize your focus and elevate your efficiency.
            </motion.p>
            <Link
              to="/showcase"
              className="inline-block bg-[#3B82F6] text-white px-8 py-3 rounded-full font-semibold text-lg glow hover:bg-[#22D3EE] transition transform hover:scale-105"
            >
              Discover FocusForge
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home