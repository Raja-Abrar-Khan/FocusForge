/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'

function FeatureCard({ title, description }) {
  return (
    <motion.div
      className="bg-[#2A3655] p-6 rounded-xl glow transform perspective-1000 border-t-2 border-[#22D3EE]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(34, 211, 238, 0.3)' }}
    >
      <h3 className="text-lg font-semibold text-[#22D3EE] mb-2">{title}</h3>
      <p className="text-[#D1D5DB] text-sm">{description}</p>
    </motion.div>
  )
}

export default FeatureCard