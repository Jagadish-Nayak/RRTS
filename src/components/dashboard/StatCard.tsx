import { useState, useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor?: string;
}

const StatCard = ({ title, value, icon, bgColor, textColor = 'white' }: StatCardProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const animationDuration = 2000; // ms
    const steps = 30;
    const stepValue = value / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      setCount(Math.min(Math.floor(stepValue * currentStep), value));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setCount(value);
      }
    }, animationDuration / steps);
    
    return () => clearInterval(interval);
  }, [value]);
  
  const formattedValue = new Intl.NumberFormat().format(count);
  
  return (
    <div className={`px-5 py-8 rounded-lg shadow-md transition-transform hover:scale-105 ${bgColor}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`text-sm font-medium mb-1 text-${textColor}`}>{title}</h3>
          <p className={`text-2xl font-bold text-${textColor}`}>{formattedValue}</p>
        </div>
        <div className={`text-${textColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard; 