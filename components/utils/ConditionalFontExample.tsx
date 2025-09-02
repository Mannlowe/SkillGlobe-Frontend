// Example: Dashboard page with conditional font loading

'use client';

import FontLoader from './FontLoader';

export default function DashboardExample() {
  return (
    <>
      {/* Load Rubik font only when this dashboard component is used */}
      <FontLoader fonts={['rubik']} />
      
      <div className="font-rubik">
        {/* Your dashboard content that needs Rubik font */}
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>This content uses Rubik font, loaded only when needed.</p>
      </div>
    </>
  );
}

// Example: Skills page that needs both fonts
export function SkillsExample() {
  return (
    <>
      {/* Load both fonts only when this skills component is used */}
      <FontLoader fonts={['rubik', 'nunito']} />
      
      <div className="font-rubik">
        <h1 className="text-2xl font-bold">Skills Section</h1>
        <div className="font-nunito">
          <p>This section uses Nunito font for body text.</p>
        </div>
      </div>
    </>
  );
}