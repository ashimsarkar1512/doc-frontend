import React from 'react';
import { CalendarDays, X } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f4f4f5] rounded-3xl w-full max-w-[800px] shadow-2xl relative flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-800 transition z-10"
        >
          <X size={24} />
        </button>
        
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          {/* Header Area */}
          <div className="flex items-center gap-5 mb-6">
            <div className="bg-[#2563EB] w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
               <span className="text-white font-bold text-3xl">W</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Appointment With, Carol Zurita</h2>
              <p className="text-gray-600 mt-1">Web3 Strategist</p>
            </div>
          </div>
          
          <div className="border-t border-dashed border-gray-300 my-6"></div>
          
          <h3 className="text-gray-600 font-medium mb-4 text-[15px]">Appointment details</h3>
          
          <div className="flex gap-3 mb-8">
            <button className="bg-[#2563EB] text-white px-8 py-2.5 rounded-full text-sm font-medium transition shadow-md">
              In-person
            </button>
            <button className="bg-[#e4e4e7] hover:bg-[#d4d4d8] text-gray-700 px-8 py-2.5 rounded-full text-sm font-medium transition">
              Virtual visit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Office Location</label>
              <div className="relative">
                <select className="w-full bg-[#e4e4e7] border-none rounded-xl p-3.5 text-gray-700 outline-none appearance-none focus:ring-2 focus:ring-[#2563EB]/50 transition">
                  <option>Select an office</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider/Doctor</label>
              <div className="relative">
                <select className="w-full bg-[#e4e4e7] border-none rounded-xl p-3.5 text-gray-700 outline-none appearance-none focus:ring-2 focus:ring-[#2563EB]/50 transition">
                  <option>Select a doctor</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-5">Pick date time for appointment. Pacific standard time(P.T)</p>
          
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 mb-6">
            {/* Calendar Widget */}
            <div className="bg-[#222222] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-center mb-6 text-[15px] font-medium border-b border-gray-700/50 pb-4">
                <button className="text-gray-400 hover:text-white transition p-1">&lt;</button>
                <span>Sep, 2025</span>
                <button className="text-gray-400 hover:text-white transition p-1">&gt;</button>
              </div>
              <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-4 font-medium">
                <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
              </div>
              <div className="grid grid-cols-7 text-center text-sm gap-y-4">
                <div className="col-span-4"></div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">1</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">2</div>
                
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">3</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">4</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">5</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">6</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">7</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">8</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">9</div>
                
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">10</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">11</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">12</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">13</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">14</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">15</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">16</div>
                
                <div className="bg-[#2563EB] w-8 h-8 mx-auto flex items-center justify-center rounded-full text-white shadow-md shadow-blue-500/30 cursor-pointer">17</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">18</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">19</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">20</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">21</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">22</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">23</div>
                
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">24</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">25</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">26</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">27</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">28</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">29</div>
                <div className="hover:bg-gray-700 rounded-full w-8 h-8 mx-auto flex items-center justify-center cursor-pointer transition">30</div>
              </div>
            </div>
            
            {/* Time Slots Widget */}
            <div className="bg-[#222222] rounded-2xl p-6 text-white shadow-lg flex flex-col">
              <h4 className="text-center font-medium mb-6 text-[15px]">Time Availability</h4>
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
                <button className="bg-[#333333] hover:bg-gray-700 rounded-xl py-3 text-sm transition">6:30 PM</button>
                <button className="bg-[#2563EB] text-white rounded-xl py-3 text-sm shadow-lg shadow-blue-500/20 font-medium">6:30 PM</button>
                <button className="bg-[#333333] hover:bg-gray-700 rounded-xl py-3 text-sm transition">6:30 PM</button>
                <button className="bg-[#333333] hover:bg-gray-700 rounded-xl py-3 text-sm transition">6:30 PM</button>
                <button className="bg-[#333333] hover:bg-gray-700 rounded-xl py-3 text-sm transition">6:30 PM</button>
              </div>
            </div>
          </div>
          
          {/* Footer Area */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                <CalendarDays size={18} className="text-[#2563EB]" />
                <span className="font-medium">17 Set, 2023</span>
              </div>
              <span className="text-gray-300">------</span>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
                <span>set time</span>
              </div>
            </div>
            <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold transition shadow-lg shadow-blue-500/30 text-[15px]">
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
