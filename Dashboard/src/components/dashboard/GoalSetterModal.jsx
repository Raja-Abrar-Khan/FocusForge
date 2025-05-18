/* eslint-disable no-unused-vars */
// File: Frontend/src/components/dashboard/GoalSetterModal.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';

function GoalSetterModal({ isOpen, onClose, onSave, currentGoal, theme }) {
  const [goalHours, setGoalHours] = useState(currentGoal);

  if (!isOpen) return null;

  const handleSave = () => {
    if (goalHours >= 1 && goalHours <= 24) {
      onSave(goalHours);
      onClose();
    } else {
      alert('Please enter a goal between 1 and 24 hours.');
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 ${theme === 'dark' ? 'bg-[#0A0A2A]/60' : 'bg-black/40'} flex items-center justify-center z-50`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`p-6 rounded-2xl holographic glow max-w-sm w-full ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h3 className={`text-lg font-orbitron ${theme === 'dark' ? 'text-[#00F5FF]' : 'text-gray-900'} mb-4`}>Set Daily Goal</h3>
        <input
          type="number"
          value={goalHours}
          onChange={(e) => setGoalHours(parseFloat(e.target.value))}
          className={`w-full p-2 ${theme === 'dark' ? 'bg-[#1E1E4A] text-[#00F5FF]' : 'bg-gray-100 text-gray-900'} rounded-lg mb-4 border ${theme === 'dark' ? 'border-[#00F5FF]/50' : 'border-gray-300'}`}
          min="1"
          max="24"
          step="0.5"
          aria-label="Daily goal hours"
        />
        <div className="flex justify-end gap-2">
          <motion.button
            onClick={onClose}
            className={`px-4 py-2 ${theme === 'dark' ? 'bg-[#1E1E4A] text-[#00F5FF]' : 'bg-gray-200 text-gray-900'} rounded-lg hover:bg-opacity-80 glow`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cancel"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSave}
            className={`px-4 py-2 ${theme === 'dark' ? 'bg-[#00F5FF] text-[#0A0A2A]' : 'bg-blue-600 text-white'} rounded-lg hover:bg-opacity-90 glow`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Save goal"
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GoalSetterModal;